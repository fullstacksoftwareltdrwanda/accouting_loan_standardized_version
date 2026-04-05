import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound } from "@/lib/api-response";
import { formatInstalment } from "@/app/api/loans/[id]/route";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/loans/[id]/schedule
export const GET = withAuth(async (_req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const loanId = parseInt(ctx.params.id);
  const loan = await prisma.loanPortfolio.findUnique({ where: { loanId } });
  if (!loan) return notFound("loan");

  const instalments = await prisma.loanInstalment.findMany({
    where:   { loanId },
    orderBy: { instalmentNumber: "asc" },
  });

  return successResponse({ instalments: instalments.map(formatInstalment) });
}) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
