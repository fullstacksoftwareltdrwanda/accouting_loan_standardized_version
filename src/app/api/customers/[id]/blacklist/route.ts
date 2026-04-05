import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound, validationError } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/customers/[id]/blacklist
export const PATCH = withAuth(async (req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const customerId = parseInt(ctx.params.id);
  const customer = await prisma.customer.findUnique({ where: { customerId } });
  if (!customer) return notFound("customer");

  let body: { blacklisted?: boolean; reason?: string };
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const errs: { field: string; issue: string }[] = [];
  if (body.blacklisted === undefined) errs.push({ field: "blacklisted", issue: "Required (boolean)" });
  if (!body.reason) errs.push({ field: "reason", issue: "Required" });
  if (errs.length) return validationError(errs);

  const updated = await prisma.customer.update({
    where: { customerId },
    data: {
      status:         body.blacklisted ? "Blacklisted" : "Active",
      blacklistReason: body.blacklisted ? body.reason : null,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId:     parseInt(req.user.sub),
      username:   req.user.sub,
      actionType: "UPDATE",
      entityType: "customer",
      entityId:   customerId,
      description: `Customer ${body.blacklisted ? "blacklisted" : "un-blacklisted"}: ${body.reason}`,
    },
  });

  return successResponse({ customer: updated });
}, ["Director", "MD", "Developer"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
