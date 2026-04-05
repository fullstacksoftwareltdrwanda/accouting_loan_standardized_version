import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound, validationError, createdResponse } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// POST /api/customers/[id]/documents — upload KYC document reference
export const POST = withAuth(async (req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const customerId = parseInt(ctx.params.id);
  const customer = await prisma.customer.findUnique({ where: { customerId } });
  if (!customer) return notFound("customer");

  let body: { documentType?: string; fileUrl?: string; expiryDate?: string };
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const ALLOWED_TYPES = ["NIN", "BVN", "Passport", "DriverLicense", "UtilityBill", "BankStatement", "EmploymentLetter"];
  if (!body.documentType || !ALLOWED_TYPES.includes(body.documentType)) {
    return validationError([{ field: "documentType", issue: `Must be one of: ${ALLOWED_TYPES.join(", ")}` }]);
  }
  if (!body.fileUrl) return validationError([{ field: "fileUrl", issue: "Required (URL of uploaded file)" }]);

  // Store the document URL in the appropriate column
  const fieldMap: Record<string, string> = {
    NIN:              "docId",
    Passport:         "docId",
    DriverLicense:    "docId",
    BankStatement:    "docStatement",
    EmploymentLetter: "docContract",
  };
  const field = fieldMap[body.documentType];
  if (field) {
    await prisma.customer.update({
      where: { customerId },
      data: { [field]: body.fileUrl },
    });
  }

  return createdResponse({
    document: {
      type:       body.documentType,
      url:        body.fileUrl,
      uploadedAt: new Date().toISOString(),
      verified:   false,
    },
  });
}, ["Director", "MD", "Accountant", "Secretary", "Developer", "Admin"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
