import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, createdResponse, validationError, errorResponse, buildPaginationMeta } from "@/lib/api-response";
import { createJournalEntry } from "@/helpers/accounting-functions";

// GET /api/ledger — paginated ledger entries
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const accountCode = searchParams.get("accountCode") ?? undefined;
  const dateFrom    = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined;
  const dateTo      = searchParams.get("to")   ? new Date(searchParams.get("to")!)   : undefined;
  const entryType   = searchParams.get("entryType") ?? undefined;
  const page        = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage     = Math.min(100, parseInt(searchParams.get("perPage") ?? "50"));

  const where: Record<string, unknown> = {};
  if (accountCode) where.accountCode = accountCode;
  if (dateFrom || dateTo) {
    where.transactionDate = {
      ...(dateFrom ? { gte: dateFrom } : {}),
      ...(dateTo   ? { lte: dateTo   } : {}),
    };
  }
  if (entryType) where.referenceType = entryType;

  const [total, entries, aggregates] = await Promise.all([
    prisma.ledger.count({ where }),
    prisma.ledger.findMany({
      where,
      skip:    (page - 1) * perPage,
      take:    perPage,
      orderBy: [{ transactionDate: "desc" }, { sequenceNumber: "desc" }],
    }),
    prisma.ledger.aggregate({
      where,
      _sum: {
        debitAmount: true,
        creditAmount: true,
      },
    }),
  ]);

  return successResponse(
    { 
      entries: entries.map(formatEntry),
      totals: {
        debit: Number(aggregates._sum.debitAmount ?? 0),
        credit: Number(aggregates._sum.creditAmount ?? 0),
      }
    },
    buildPaginationMeta(total, page, perPage)
  );
}) as unknown as (req: NextRequest) => Promise<Response>;

// POST /api/ledger/manual-entry — balanced manual journal entry
export const POST = withAuth(async (req: AuthedRequest) => {
  let body: { date?: string; description?: string; reference?: string; lines?: unknown[] };
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const errs: { field: string; issue: string }[] = [];
  if (!body.date)        errs.push({ field: "date",        issue: "Required" });
  if (!body.description) errs.push({ field: "description", issue: "Required" });
  if (!Array.isArray(body.lines) || body.lines.length < 2)
    errs.push({ field: "lines", issue: "At least 2 journal lines required" });
  if (errs.length) return validationError(errs);

  try {
    const journalId = await createJournalEntry(
      prisma,
      new Date(body.date!),
      body.description!,
      (body.lines! as Record<string, unknown>[]).map((l) => ({
        accountCode:   String(l.accountCode),
        particular:    String(l.particular),
        narration:     l.narration ? String(l.narration) : undefined,
        debitAmount:   Number(l.debitAmount ?? 0),
        creditAmount:  Number(l.creditAmount ?? 0),
        referenceType: "manual",
        createdBy:     parseInt(req.user.sub),
      })),
      body.reference,
      parseInt(req.user.sub)
    );

    const journal = await prisma.journalEntry.findUnique({
      where:   { id: journalId },
      include: { lines: true },
    });

    return createdResponse({ journalEntry: journal });
  } catch (err: unknown) {
    return errorResponse("JOURNAL_ERROR", (err as Error).message, undefined, 422);
  }
}, ["Director", "MD", "Accountant", "Developer", "Admin"]) as unknown as (req: NextRequest) => Promise<Response>;

function formatEntry(e: Record<string, unknown>) {
  return {
    id:               String(e.ledgerId),
    transactionDate:  e.transactionDate instanceof Date ? e.transactionDate.toISOString().split("T")[0] : e.transactionDate,
    class:            e.class,
    accountCode:      e.accountCode,
    accountName:      e.accountName,
    particular:       e.particular,
    narration:        e.narration,
    voucherNumber:    e.voucherNumber,
    beginningBalance: Number(e.beginningBalance),
    debitAmount:      Number(e.debitAmount),
    creditAmount:     Number(e.creditAmount),
    movement:         Number(e.movement),
    endingBalance:    Number(e.endingBalance),
    referenceType:    e.referenceType,
    referenceId:      e.referenceId,
    journalEntryId:   e.journalEntryId ? String(e.journalEntryId) : null,
    createdAt:        e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
  };
}
