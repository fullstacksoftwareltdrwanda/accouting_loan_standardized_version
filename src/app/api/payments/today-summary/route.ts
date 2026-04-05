import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse } from "@/lib/api-response";

// GET /api/payments/today-summary
export const GET = withAuth(async (_req: AuthedRequest) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const payments = await prisma.loanPayment.findMany({
    where: { paymentDate: { gte: start, lte: end }, reversedAt: null },
  });

  const totalCollected = payments.reduce((s, p) => s + Number(p.paymentAmount), 0);
  const count = payments.length;

  const byMethodMap = new Map<string, { count: number; amount: number }>();
  for (const p of payments) {
    const method = p.paymentMethod ?? "Unknown";
    const entry  = byMethodMap.get(method) ?? { count: 0, amount: 0 };
    entry.count  += 1;
    entry.amount += Number(p.paymentAmount);
    byMethodMap.set(method, entry);
  }

  const byMethod = Array.from(byMethodMap.entries()).map(([method, data]) => ({
    method, ...data,
  }));

  return successResponse({ totalCollected, count, byMethod });
}) as unknown as (req: NextRequest) => Promise<Response>;
