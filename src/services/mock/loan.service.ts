import { Loan } from "@/types/loan";
import { MOCK_LOANS } from "@/data/mock/loans";

/**
 * Service to manage Loan Portfolio data.
 * Simulated async backend calls.
 */
export async function getLoans(): Promise<Loan[]> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return [...MOCK_LOANS].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

export async function createLoan(data: Partial<Loan>): Promise<Loan> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  
  const principal = data.principal || 0;
  const interest = principal * ((data.interestRate || 0) / 100);
  const totalPayable = principal + interest;

  const newLoan: Loan = {
    id: `ln_${Math.random().toString(36).substr(2, 9)}`,
    loanNumber: `LN-2026-${Math.floor(100 + Math.random() * 900)}`,
    customerId: data.customerId || "unknown",
    customerName: data.customerName || "Unknown Borrower",
    principal: principal,
    interestRate: data.interestRate || 10,
    term: data.term || 12,
    frequency: data.frequency || "Monthly",
    category: data.category || "Personal",
    startDate: new Date().toISOString().split('T')[0],
    totalPayable: totalPayable,
    totalPaid: 0,
    status: "active",
    purpose: data.purpose,
    nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };
  
  return newLoan;
}
