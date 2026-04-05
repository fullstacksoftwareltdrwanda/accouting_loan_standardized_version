import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { notFound, validationError, errorResponse } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/loans/[id]/schedule/export — export schedule as CSV (PDF/XLSX require a renderer library)
export const GET = withAuth(async (req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const loanId = parseInt(ctx.params.id);
  const loan = await prisma.loanPortfolio.findUnique({
    where:   { loanId },
    include: { customer: { select: { customerName: true } } },
  });
  if (!loan) return notFound("loan");

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") ?? "csv";

  if (!["csv", "pdf", "xlsx"].includes(format)) {
    return validationError([{ field: "format", issue: "Must be csv, pdf, or xlsx" }]);
  }

  const instalments = await prisma.loanInstalment.findMany({
    where:   { loanId },
    orderBy: { instalmentNumber: "asc" },
  });

  if (format === "csv") {
    const header = "No,Due Date,Opening Balance,Principal,Interest,Management Fee,Total Payment,Closing Balance,Status\n";
    const rows   = instalments.map((i) =>
      [
        i.instalmentNumber,
        i.dueDate.toISOString().split("T")[0],
        Number(i.openingBalance),
        Number(i.principalAmount),
        Number(i.interestAmount),
        Number(i.managementFee),
        Number(i.totalPayment),
        Number(i.closingBalance),
        i.status,
      ].join(",")
    ).join("\n");

    const csv = header + rows;
    return new Response(csv, {
      headers: {
        "Content-Type":        "text/csv",
        "Content-Disposition": `attachment; filename="schedule-${loan.loanNumber}.csv"`,
      },
    });
  }

  // PDF/XLSX: placeholder — requires a server-side rendering library (puppeteer, exceljs, etc.)
  return errorResponse(
    "NOT_IMPLEMENTED",
    `${format.toUpperCase()} export is not yet implemented. Use format=csv.`,
    undefined,
    501
  );
}) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
