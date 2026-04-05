/**
 * Expense Service — real API implementation.
 * Replaces src/services/mock/expense.service.ts
 */
import { api } from "@/lib/api-client";
import { Expense } from "@/types/expense";

function mapToExpense(e: any): Expense {
  return {
    id: String(e.expenseId),
    date: (e.expenseDate || e.transactionDate || "").split("T")[0],
    description: e.description,
    category: e.category as any,
    amount: Number(e.expenseAmount || e.amount || 0),
    accountCode: e.accountCode,
    status: (e.status?.toLowerCase() || "paid") as any,
    reference: e.reference || `EXP-${e.expenseId}`
  };
}

export async function getExpenses(filters?: Record<string, unknown>): Promise<Expense[]> {
  const qs = filters ? "?" + new URLSearchParams(filters as Record<string, string>).toString() : "";
  const result = await api.get<{ expenses: any[] }>(`/api/expenses${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch expenses");
  return result.data!.expenses.map(mapToExpense);
}

export async function createExpense(data: Record<string, unknown>): Promise<Expense> {
  // Map frontend field names to backend API expectations
  const payload = {
    ...data,
    expenseDate:   data.expenseDate || data.date,
    expenseAmount: data.expenseAmount || data.amount,
  };

  const result = await api.post<{ expense: any }>("/api/expenses", payload);
  if (!result.success) {
    const detailMsg = result.error?.details?.map(d => `${d.field}: ${d.issue}`).join(", ");
    throw new Error(detailMsg ? `Validation failed: ${detailMsg}` : (result.error?.message ?? "Failed to create expense"));
  }
  return mapToExpense(result.data!.expense);
}

export async function updateExpense(id: string, data: Record<string, unknown>): Promise<Expense> {
  const result = await api.put<{ expense: any }>(`/api/expenses/${id}`, data);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to update expense");
  return mapToExpense(result.data!.expense);
}

export async function deleteExpense(id: string): Promise<boolean> {
  const result = await api.delete<{ success: boolean }>(`/api/expenses/${id}`);
  return result.data?.success ?? false;
}
