import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, createdResponse, notFound, validationError, conflict } from "@/lib/api-response";

function formatAccount(a: Record<string, unknown>) {
  return {
    id:            String(a.accountId),
    accountCode:   a.accountCode,
    accountName:   a.accountName,
    class:         a.class,
    accountType:   a.accountType,
    subType:       a.subType,
    normalBalance: a.normalBalance,
    description:   a.description,
    isActive:      a.isActive,
    createdAt:     a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
  };
}

// GET /api/accounts
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const classFilter  = searchParams.get("class") ?? undefined;
  const typeFilter   = searchParams.get("accountType") ?? undefined;
  const activeOnly   = searchParams.get("active") !== "false";

  const accounts = await prisma.chartOfAccount.findMany({
    where: {
      ...(classFilter  ? { class: classFilter }       : {}),
      ...(typeFilter   ? { accountType: typeFilter }  : {}),
      ...(activeOnly   ? { isActive: true }           : {}),
    },
    orderBy: { accountCode: "asc" },
  });

  return successResponse({ accounts: accounts.map(formatAccount) });
}) as unknown as (req: NextRequest) => Promise<Response>;

// POST /api/accounts
export const POST = withAuth(async (req: AuthedRequest) => {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const errs: { field: string; issue: string }[] = [];
  if (!body.accountCode)   errs.push({ field: "accountCode",   issue: "Required" });
  if (!body.accountName)   errs.push({ field: "accountName",   issue: "Required" });
  if (!body.class)         errs.push({ field: "class",         issue: "Required" });
  if (!body.normalBalance) errs.push({ field: "normalBalance", issue: "Required (Debit | Credit)" });
  if (errs.length) return validationError(errs);

  const existing = await prisma.chartOfAccount.findUnique({ where: { accountCode: String(body.accountCode) } });
  if (existing) return conflict("ACCOUNT_CODE_EXISTS", `Account code ${body.accountCode} already exists.`);

  const account = await prisma.chartOfAccount.create({
    data: {
      accountCode:   String(body.accountCode),
      accountName:   String(body.accountName),
      class:         String(body.class),
      accountType:   body.accountType ? String(body.accountType) : undefined,
      subType:       body.subType     ? String(body.subType)     : undefined,
      normalBalance: String(body.normalBalance),
      description:   body.description ? String(body.description) : undefined,
    },
  });

  return createdResponse({ account: formatAccount(account as unknown as Record<string, unknown>) });
}, ["Director", "MD", "Accountant", "Developer", "Admin"]) as unknown as (req: NextRequest) => Promise<Response>;
