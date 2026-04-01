import { Expense, ExpenseCategory } from "@/types/expense";
import { MOCK_EXPENSES } from "@/data/mock/expenses";

/**
 * Service to manage Business Expenses.
 * Simulated async backend calls.
 */
export async function getExpenses(): Promise<Expense[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [...MOCK_EXPENSES].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function createExpense(data: Partial<Expense>): Promise<Expense> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  
  const newExpense: Expense = {
    id: `exp_${Math.random().toString(36).substr(2, 9)}`,
    date: data.date || new Date().toISOString().split('T')[0],
    description: data.description || "Uncategorized Expense",
    category: data.category || "Administrative",
    amount: data.amount || 0,
    accountCode: data.accountCode || "5000",
    status: data.status || "active",
    reference: data.reference,
  };
  
  return newExpense;
}
