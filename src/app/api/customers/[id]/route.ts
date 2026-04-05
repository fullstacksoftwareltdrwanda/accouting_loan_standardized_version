import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound, validationError, createdResponse } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/customers/[id]
export const GET = withAuth(async (_req: AuthedRequest, ctx: any) => {
  const params = await ctx.params;
  const customerId = parseInt(params.id);
  const customer = await prisma.customer.findUnique({
    where: { customerId },
    include: {
      loans: {
        select: {
          loanId: true, loanNumber: true, loanStatus: true,
          loanAmount: true, totalOutstanding: true, daysOverdue: true,
        },
      },
    },
  });

  if (!customer) return notFound("customer");

  return successResponse({ customer: formatCustomer(customer) });
}) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;

// PUT /api/customers/[id]
export const PUT = withAuth(async (req: AuthedRequest, ctx: any) => {
  const params = await ctx.params;
  const customerId = parseInt(params.id);
  const existing = await prisma.customer.findUnique({ where: { customerId } });
  if (!existing) return notFound("customer");

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  // Sensitive fields trigger approval workflow instead
  const APPROVAL_FIELDS = ["idNumber", "accountNumber"];
  const needsApproval = APPROVAL_FIELDS.some((f) => f in body);

  if (needsApproval) {
    const approval = await prisma.pendingApproval.create({
      data: {
        actionType:     "EDIT_CUSTOMER",
        entityType:     "customer",
        entityId:       customerId,
        actionData:     JSON.stringify({ customerId, ...body }),
        previousState:  JSON.stringify(existing),
        description:    `Edit sensitive fields for customer ${existing.customerCode}`,
        submittedBy:    req.user.sub,
        submittedByRole: req.user.role,
      },
    });
    return createdResponse({ approvalId: String(approval.approvalId), pendingApproval: true });
  }

  const updated = await prisma.customer.update({
    where: { customerId },
    data: {
      customerName: body.customerName ? String(body.customerName) : undefined,
      phone:        body.phone        ? String(body.phone)        : undefined,
      email:        body.email        ? String(body.email)        : undefined,
      address:      body.address      ? String(body.address)      : undefined,
      province:     body.province     ? String(body.province)     : undefined,
      occupation:   body.occupation   ? String(body.occupation)   : undefined,
      status:       body.status       ? String(body.status)       : undefined,
    },
  });

  return successResponse({ customer: formatCustomer(updated) });
}, ["Director", "MD", "Accountant", "Secretary", "Developer", "Admin"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;

function formatCustomer(c: Record<string, unknown>) {
  return {
    id:             String(c.customerId),
    customerNumber: c.customerCode,
    fullName:       c.customerName,
    phone:          c.phone,
    email:          c.email,
    gender:         c.gender,
    dateOfBirth:    c.dateOfBirth instanceof Date ? c.dateOfBirth.toISOString() : c.dateOfBirth,
    address:        c.address,
    idNumber:       c.idNumber,
    accountNumber:  c.accountNumber,
    occupation:     c.occupation,
    province:       c.province,
    status:         c.status,
    createdAt:      c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    updatedAt:      c.updatedAt instanceof Date ? c.updatedAt.toISOString() : c.updatedAt,
  };
}
