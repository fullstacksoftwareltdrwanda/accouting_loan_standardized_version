import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse } from "@/lib/api-response";

// GET /api/reports/cash-flow
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : new Date(new Date().getFullYear(), 0, 1);
  const to   = searchParams.get("to")   ? new Date(searchParams.get("to")!)   : new Date();

  // Operating activities: payments received
  const paymentsIn = await prisma.loanPayment.aggregate({
    _sum: { paymentAmount: true },
    where: { paymentDate: { gte: from, lte: to }, reversedAt: null },
  });

  // Operating activities: expenses paid
  const expensesOut = await prisma.expense.aggregate({
    _sum: { expenseAmount: true },
    where: { expenseDate: { gte: from, lte: to } },
  });

  // Investment activities: loan disbursements
  const disbursements = await prisma.loanPortfolio.aggregate({
    _sum: { totalDisbursed: true },
    where: { disbursementDate: { gte: from, lte: to }, loanStatus: { notIn: ["Pending_Approval", "Draft", "Rejected"] } },
  });

  // Investment activities: asset purchases
  const assetPurchases = await prisma.asset.aggregate({
    _sum: { acquisitionValue: true },
    where: { acquisitionDate: { gte: from, lte: to }, status: { not: "Disposed" } },
  });

  const operatingInflow   = Number(paymentsIn._sum.paymentAmount   ?? 0);
  const operatingOutflow  = Number(expensesOut._sum.expenseAmount  ?? 0);
  const investingOutflow  = Number(disbursements._sum.totalDisbursed ?? 0) + Number(assetPurchases._sum.acquisitionValue ?? 0);
  const netCashFlow       = operatingInflow - operatingOutflow - investingOutflow;

  return successResponse({
    period: { from: from.toISOString().split("T")[0], to: to.toISOString().split("T")[0] },
    operating: {
      inflows:  [{ description: "Loan Repayments Received",  amount: operatingInflow  }],
      outflows: [{ description: "Operating Expenses Paid",   amount: operatingOutflow }],
      net:      operatingInflow - operatingOutflow,
    },
    investing: {
      inflows:  [],
      outflows: [
        { description: "Loan Disbursements",   amount: Number(disbursements._sum.totalDisbursed ?? 0)    },
        { description: "Asset Acquisitions",   amount: Number(assetPurchases._sum.acquisitionValue ?? 0) },
      ],
      net: -investingOutflow,
    },
    financing: { inflows: [], outflows: [], net: 0 },
    netCashFlow,
  });
}) as unknown as (req: NextRequest) => Promise<Response>;
