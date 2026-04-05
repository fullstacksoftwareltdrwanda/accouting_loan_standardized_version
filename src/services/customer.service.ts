/**
 * Customer Service — real API implementation.
 * Replaces src/services/mock/customer.service.ts
 */
import { api } from "@/lib/api-client";
import { Customer } from "@/types/customer";

export async function getCustomers(filters?: Record<string, unknown>): Promise<{ customers: Customer[], meta: any }> {
  const qs = filters ? "?" + new URLSearchParams(filters as Record<string, string>).toString() : "";
  const result = await api.get<{ customers: any[] }>(`/api/customers${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch customers");
  
  const customers = result.data!.customers.map(mapToCustomer);
  return { customers, meta: result.meta };
}

function mapToCustomer(c: any): Customer {
  return {
    id: String(c.id || c.customerId),
    memberNumber: c.customerNumber || c.customerCode || "",
    code: c.customerNumber || c.customerCode || "",
    name: c.fullName || c.customerName || "",
    phone: c.phone || "",
    email: c.email || "",
    idNumber: c.idNumber || "",
    status: c.status as any,
    gender: (c.gender || "Male").toLowerCase(),
    dateOfBirth: c.dateOfBirth || "",
    recordDate: c.createdAt || "",
    occupation: c.occupation || "",
    accountNumber: c.accountNumber || "",
    province: c.province || "",
    district: c.district || "",
    sector: c.sector || "",
    cell: c.cell || "",
    streetAddress: c.address || "",
    fatherName: c.fatherName || "",
    motherName: c.motherName || "",
    maritalStatus: (c.marriageType || "Single").toLowerCase(),
    hasGuarantor: c.hasGuarantor === "Yes",
    financials: {
      totalLoans: Number(c.totalLoans || 0),
      activeBalance: Number(c.totalOutstanding || 0),
      totalPaid: Number(c.totalPaid || 0),
      onTimeRepaymentRate: 100,
    }
  };
}

export async function getCustomerById(id: string): Promise<Customer> {
  const result = await api.get<{ customer: any }>(`/api/customers/${id}`);
  if (!result.success) throw new Error(result.error?.message ?? "Customer not found");
  
  return mapToCustomer(result.data!.customer);
}

export async function createCustomer(data: Record<string, unknown>) {
  const payload = {
    ...data,
    customerName: data.name,
    address: data.streetAddress,
    marriageType: (data.maritalStatus as string)?.charAt(0).toUpperCase() + (data.maritalStatus as string)?.slice(1) || "Single",
  };
  const result = await api.post<{ customer: unknown }>("/api/customers", payload);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to create customer");
  return result.data!.customer;
}

export async function updateCustomer(id: string, data: Record<string, unknown>) {
  const payload = {
    ...data,
    customerName: data.name,
    address: data.streetAddress,
    marriageType: data.maritalStatus ? (data.maritalStatus as string).charAt(0).toUpperCase() + (data.maritalStatus as string).slice(1) : undefined,
  };
  const result = await api.put<{ customer: unknown; approvalId?: string }>(`/api/customers/${id}`, payload);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to update customer");
  return result.data!;
}

export async function getCustomerLoans(id: string) {
  const result = await api.get<{ loans: unknown[] }>(`/api/customers/${id}/loans`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch customer loans");
  return result.data!.loans;
}

export async function getCustomerStatement(id: string, params?: { from?: string; to?: string }) {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  const result = await api.get<unknown>(`/api/customers/${id}/statements${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch statement");
  return result.data;
}

export async function blacklistCustomer(id: string, payload: { blacklisted: boolean; reason: string }) {
  const result = await api.patch<{ customer: unknown }>(`/api/customers/${id}/blacklist`, payload);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to update blacklist status");
  return result.data!.customer;
}
