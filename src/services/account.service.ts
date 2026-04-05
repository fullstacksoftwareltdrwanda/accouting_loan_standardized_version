/**
 * Account (GL) Service — real API implementation.
 * Replaces src/services/mock/account.service.ts
 */
import { api } from "@/lib/api-client";
import { GLAccount } from "@/types/account";

export async function getAccounts(filters?: { class?: string; accountType?: string; active?: boolean }): Promise<GLAccount[]> {
  const qs = filters ? "?" + new URLSearchParams(Object.fromEntries(
    Object.entries(filters).map(([k, v]) => [k, String(v)])
  )).toString() : "";
  const result = await api.get<{ accounts: any[] }>(`/api/accounts${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch accounts");
  
  return result.data!.accounts.map((a: any) => ({
    id: String(a.accountId),
    code: a.accountCode,
    name: a.accountName,
    category: a.class as any,
    accountType: a.accountType,
    subType: a.accountType, // Defaulting subtype to accountType
    normalBalance: (a.class === "Asset" || a.class === "Expense") ? "Debit" : "Credit",
    description: a.description || "",
    balance: Number(a.currentBalance),
    isActive: !!a.isActive,
    status: a.isActive ? "active" : "inactive",
    lastModified: a.updatedAt
  }));
}

function mapToGLAccount(a: any): GLAccount {
  return {
    id: String(a.accountId),
    code: a.accountCode,
    name: a.accountName,
    category: a.class as any,
    accountType: a.accountType,
    subType: a.accountType,
    normalBalance: (a.class === "Asset" || a.class === "Expense") ? "Debit" : "Credit",
    description: a.description || "",
    balance: Number(a.currentBalance),
    isActive: !!a.isActive,
    status: a.isActive ? "active" : "inactive",
    lastModified: a.updatedAt
  };
}

export async function createAccount(data: Record<string, unknown>): Promise<GLAccount> {
  const payload = {
    ...data,
    accountCode: data.code,
    accountName: data.name,
    class: data.category,
  };
  const result = await api.post<{ account: any }>("/api/accounts", payload);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to create account");
  return mapToGLAccount(result.data!.account);
}

export async function updateAccount(id: string, data: Record<string, unknown>): Promise<GLAccount> {
  const payload = {
    ...data,
    accountCode: data.code,
    accountName: data.name,
    class: data.category,
  };
  const result = await api.put<{ account: any }>(`/api/accounts/${id}`, payload);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to update account");
  return mapToGLAccount(result.data!.account);
}
