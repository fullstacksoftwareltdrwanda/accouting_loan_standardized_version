/**
 * Loan Service — real API implementation.
 * Replaces src/services/mock/loan.service.ts
 * All function signatures are identical to the mock version.
 */
import { api, APIResult } from "@/lib/api-client";
import { Loan } from "@/types/loan";

export interface LoanCalculateParams {
  loanAmount: number;
  interestRate: number;
  numberOfInstalments: number;
  managementFeeRate?: number;
  deductFeeUpfront: boolean;
  firstPaymentDate: string;
}

export async function calculateLoan(params: LoanCalculateParams) {
  const result = await api.post<Record<string, unknown>>("/api/loans/calculate", params);
  if (!result.success) throw new Error(result.error?.message ?? "Calculation failed");
  return result.data!;
}

function mapToLoan(l: any): Loan {
  return {
    id: l.id || String(l.loanId),
    loanNumber: l.loanNumber,
    customerId: l.customerId || String(l.customerId),
    customerName: l.customerName || l.customer?.customerName || "Unknown Customer",
    principal: Number(l.loanAmount),
    interestRate: Number(l.interestRate),
    term: l.numberOfInstalments,
    frequency: "Monthly",
    category: "Business",
    startDate: l.disbursementDate,
    disbursementDate: l.disbursementDate,
    maturityDate: l.maturityDate,
    totalPayable: Number(l.totalPayment),
    totalPaid: Number(l.totalPaid),
    daysOverdue: l.daysOverdue,
    status: l.loanStatus.toLowerCase() as any,
    nextPaymentDate: l.firstPaymentDate,
  };
}

export async function getLoans(filters?: Record<string, unknown>): Promise<Loan[]> {
  const qs = filters ? "?" + new URLSearchParams(filters as Record<string, string>).toString() : "";
  const result = await api.get<{ loans: any[]; aggregates: any }>(`/api/loans${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch loans");
  
  return result.data!.loans.map(mapToLoan);
}

export async function getLoanById(id: string): Promise<Loan> {
  const result = await api.get<{ loan: any }>(`/api/loans/${id}`);
  if (!result.success) throw new Error(result.error?.message ?? "Loan not found");
  return mapToLoan(result.data!.loan);
}

export async function createLoan(data: Record<string, unknown>) {
  const payload = { ...data };
  const result = await api.post<{ loan: unknown; approvalId: string; previewSchedule: unknown[] }>("/api/loans", payload);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to create loan");
  return result.data!;
}

export async function getLoanSchedule(loanId: string) {
  const result = await api.get<{ instalments: unknown[] }>(`/api/loans/${loanId}/schedule`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch schedule");
  return result.data!.instalments;
}

export async function writeOffLoan(loanId: string, payload: { reason: string; writeOffDate: string }) {
  const result = await api.patch<{ loan: unknown }>(`/api/loans/${loanId}/write-off`, payload);
  if (!result.success) throw new Error(result.error?.message ?? "Write-off failed");
  return result.data!.loan;
}
