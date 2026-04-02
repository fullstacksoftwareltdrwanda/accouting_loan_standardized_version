import { Customer } from "@/types/customer";
import { MOCK_CUSTOMERS } from "@/data/mock/customers";

/**
 * CUSTOMER SERVICE: Production-Ready Frontend Skeleton
 * Ready for NestJS/Prisma integration.
 */

export async function getCustomers(): Promise<Customer[]> {
  // TODO: Replace with backend API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_CUSTOMERS];
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  // TODO: Replace with backend API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_CUSTOMERS.find((c) => c.id === id);
}

export async function createCustomer(data: any): Promise<Customer> {
  // TODO: POST to backend
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const newCustomer = { 
    ...data, 
    id: Math.random().toString(36).substr(2, 9),
    financials: { 
      totalLoans: 0, 
      activeBalance: 0, 
      totalPaid: 0, 
      onTimeRepaymentRate: 0 
    }
  } as Customer;
  return newCustomer;
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  // TODO: PATCH to backend
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { id, ...data } as Customer;
}

export async function deleteCustomer(id: string): Promise<boolean> {
  // TODO: DELETE from backend
  await new Promise((resolve) => setTimeout(resolve, 500));
  return true;
}
