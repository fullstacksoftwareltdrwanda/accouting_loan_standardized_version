import { Customer } from "@/types/customer";
import { MOCK_CUSTOMERS } from "@/data/mock/customers";

/**
 * Service to manage Borrower/Customer data.
 * Simulated async backend calls.
 */
export async function getCustomers(): Promise<Customer[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return [...MOCK_CUSTOMERS].sort((a, b) => 
    new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
  );
}

export async function createCustomer(data: Partial<Customer>): Promise<Customer> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const newCustomer: Customer = {
    id: `cust_${Math.random().toString(36).substr(2, 9)}`,
    firstName: data.firstName || "New",
    lastName: data.lastName || "Customer",
    email: data.email || "",
    phone: data.phone || "",
    nin: data.nin || "",
    status: "active",
    address: data.address,
    joinedDate: new Date().toISOString().split('T')[0],
    financials: {
      totalLoans: 0,
      activeBalance: 0,
      totalPaid: 0,
      onTimeRepaymentRate: 0
    }
  };
  
  return newCustomer;
}
