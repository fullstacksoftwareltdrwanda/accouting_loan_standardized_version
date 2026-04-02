import { Customer } from "@/types/customer";
import { MOCK_CUSTOMERS } from "@/data/mock/customers";

/**
 * Service to manage Borrower/Customer data.
 * Simulated async backend calls.
 */
export async function getCustomers(): Promise<Customer[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return [...MOCK_CUSTOMERS].sort((a, b) => 
    new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
  );
}

export async function createCustomer(data: Partial<Customer>): Promise<Customer> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const newCustomer: Customer = {
    id: `cust_${Math.random().toString(36).substr(2, 9)}`,
    memberNumber: `GLS-${Math.floor(100 + Math.random() * 900)}`,
    code: `CUST-${new Date().getTime()}`,
    name: data.name || "New Customer",
    email: data.email || "",
    phone: data.phone || "",
    idNumber: data.idNumber || "",
    status: "PENDING",
    gender: data.gender || "Not Specified",
    dateOfBirth: data.dateOfBirth || "",
    recordDate: new Date().toISOString().split('T')[0],
    occupation: data.occupation || "",
    accountNumber: `100${Math.floor(1000000 + Math.random() * 9000000)}`,
    province: data.province || "",
    district: data.district || "",
    sector: data.sector || "",
    cell: data.cell || "",
    streetAddress: data.streetAddress || "",
    fatherName: data.fatherName || "",
    motherName: data.motherName || "",
    maritalStatus: data.maritalStatus || "Single",
    hasGuarantor: data.hasGuarantor || false,
    financials: {
      totalLoans: 0,
      activeBalance: 0,
      totalPaid: 0,
      onTimeRepaymentRate: 0
    }
  };
  
  return newCustomer;
}
