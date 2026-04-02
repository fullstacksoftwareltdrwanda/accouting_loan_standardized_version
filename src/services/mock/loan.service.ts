import { Loan } from "@/types/loan";
import { MOCK_LOANS } from "@/data/mock/loans";

/**
 * LOAN SERVICE: Production-Ready Frontend Skeleton
 * All methods are asynchronous and ready for API integration.
 */

export async function getLoans(): Promise<Loan[]> {
  // TODO: Replace with backend API call (e.g., fetch('/api/loans'))
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_LOANS];
}

export async function getLoanById(id: string): Promise<Loan | undefined> {
  // TODO: Replace with backend API call (e.g., fetch(`/api/loans/${id}`))
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_LOANS.find((l) => l.id === id);
}

export async function createLoan(data: any): Promise<Loan> {
  // TODO: POST to backend API (NestJS/Prisma)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Creating loan in backend...", data);
  const newLoan = { 
    ...data, 
    id: Math.random().toString(36).substr(2, 9),
    status: "pending" 
  } as Loan;
  return newLoan;
}

export async function updateLoan(id: string, data: any): Promise<Loan> {
  // TODO: PATCH to backend API
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log(`Updating loan ${id}...`, data);
  return { id, ...data } as Loan;
}

export async function deleteLoan(id: string): Promise<boolean> {
  // TODO: DELETE to backend API
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Deleting loan ${id} from database...`);
  return true;
}
