import { GLAccount } from "@/types/account";
import { MOCK_ACCOUNTS } from "@/data/mock/accounts";

/**
 * ACCOUNT SERVICE: Production-ready backend skeleton.
 */

export async function getAccounts(): Promise<GLAccount[]> {
  // TODO: Replace with backend API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_ACCOUNTS];
}

export async function createAccount(data: Partial<GLAccount>): Promise<GLAccount> {
  // TODO: POST to backend
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { ...data, id: Math.random().toString(36).substr(2, 9) } as GLAccount;
}

export async function updateAccount(id: string, data: Partial<GLAccount>): Promise<GLAccount> {
  // TODO: PATCH to backend
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { id, ...data } as GLAccount;
}

export async function deleteAccount(id: string): Promise<boolean> {
  // TODO: DELETE from backend
  await new Promise((resolve) => setTimeout(resolve, 500));
  return true;
}
