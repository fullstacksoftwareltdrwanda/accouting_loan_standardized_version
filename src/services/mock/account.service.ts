import { GLAccount, AccountCategory } from "@/types/account";
import { MOCK_ACCOUNTS } from "@/data/mock/accounts";

/**
 * Service to manage Chart of Accounts.
 * Simulated async backend calls.
 */
export async function getAccounts(): Promise<GLAccount[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_ACCOUNTS].sort((a, b) => a.code.localeCompare(b.code));
}

export async function getAccountsByCategory(category: AccountCategory): Promise<GLAccount[]> {
  const accounts = await getAccounts();
  return accounts.filter((acc) => acc.category === category);
}

export async function createAccount(data: Partial<GLAccount>): Promise<GLAccount> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const newAccount: GLAccount = {
    id: `acc_${Math.random().toString(36).substr(2, 9)}`,
    code: data.code || "0000",
    name: data.name || "Unnamed Account",
    category: data.category || "Asset",
    accountType: data.accountType || "Other",
    subType: data.subType || "Other",
    normalBalance: data.normalBalance || "Debit",
    balance: data.balance || 0,
    status: data.status || "active",
    lastModified: new Date().toISOString().split('T')[0],
    description: data.description,
  };
  
  // In a real app, we would push to DB. Here we just return the object.
  return newAccount;
}
