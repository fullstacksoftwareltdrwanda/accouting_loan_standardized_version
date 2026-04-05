import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound, validationError } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/accounts/[id]
export const PUT = withAuth(async (req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const accountId = parseInt(ctx.params.id);
  const account = await prisma.chartOfAccount.findUnique({ where: { accountId } });
  if (!account) return notFound("account");

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const updated = await prisma.chartOfAccount.update({
    where: { accountId },
    data: {
      accountName:   body.accountName   ? String(body.accountName)   : undefined,
      accountType:   body.accountType   ? String(body.accountType)   : undefined,
      subType:       body.subType       ? String(body.subType)       : undefined,
      normalBalance: body.normalBalance ? String(body.normalBalance) : undefined,
      description:   body.description   ? String(body.description)   : undefined,
      isActive:      body.isActive !== undefined ? Boolean(body.isActive) : undefined,
    },
  });

  return successResponse({ account: updated });
}, ["Director", "MD", "Developer"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
