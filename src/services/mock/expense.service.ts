import { Expense } from "@/types/expense";
import { MOCK_EXPENSES } from "@/data/mock/expenses";

/**
 * EXPENSE SERVICE: Production-ready backend skeleton.
 */

export async function getExpenses(): Promise<Expense[]> {
  // TODO: Replace with backend API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_EXPENSES];
}

export async function createExpense(data: Partial<Expense>): Promise<Expense> {
  // TODO: POST to backend
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { ...data, id: Math.random().toString(36).substr(2, 9) } as Expense;
}

export async function updateExpense(id: string, data: Partial<Expense>): Promise<Expense> {
  // TODO: PATCH to backend
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { id, ...data } as Expense;
}

export async function deleteExpense(id: string): Promise<boolean> {
  // TODO: DELETE from backend
  await new Promise((resolve) => setTimeout(resolve, 500));
  return true;
}
