import { NextRequest } from "next/server";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, errorResponse } from "@/lib/api-response";

// POST /api/payments/bulk-upload — CSV bulk payment processing stub
export const POST = withAuth(async (req: AuthedRequest) => {
  // In production, parse CSV via a streaming parser (e.g. papaparse or csv-parse)
  // Each row maps to: loanNumber, instalmentNumber, paymentDate, paymentAmount, paymentMethod, reference
  // Then call the same logic as POST /api/payments for each row atomically
  return errorResponse(
    "NOT_IMPLEMENTED",
    "Bulk upload is not yet implemented. Upload a CSV with columns: loanNumber, instalmentNumber, paymentDate, paymentAmount, paymentMethod, referenceNumber",
    undefined,
    501
  );
}, ["Director", "MD", "Accountant", "Developer", "Admin"]) as unknown as (req: NextRequest) => Promise<Response>;
