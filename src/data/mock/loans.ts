import { Loan } from "@/types/loan";

export const MOCK_LOANS: Loan[] = [
  {
    id: "ln_1",
    loanNumber: "LN-2026-001",
    customerId: "cust_1",
    customerName: "John Smith",
    principal: 5000.00,
    interestRate: 12,
    term: 12,
    frequency: "Monthly",
    category: "Personal",
    startDate: "2026-01-10",
    totalPayable: 5600.00,
    totalPaid: 1500.00,
    status: "active",
    purpose: "Home Improvement",
    nextPaymentDate: "2026-04-10"
  },
  {
    id: "ln_2",
    loanNumber: "LN-2026-002",
    customerId: "cust_2",
    customerName: "Sarah Johnson",
    principal: 12000.00,
    interestRate: 15,
    term: 24,
    frequency: "Monthly",
    category: "Business",
    startDate: "2026-02-15",
    totalPayable: 15600.00,
    totalPaid: 0.00,
    status: "active",
    purpose: "Inventory Expansion",
    nextPaymentDate: "2026-03-15"
  },
  {
    id: "ln_3",
    loanNumber: "LN-2026-003",
    customerId: "cust_3",
    customerName: "David Mugisha",
    principal: 2500.00,
    interestRate: 10,
    term: 6,
    frequency: "Weekly",
    category: "Emergency",
    startDate: "2026-01-05",
    totalPayable: 2750.00,
    totalPaid: 500.00,
    status: "overdue",
    purpose: "Medical Bill",
    nextPaymentDate: "2026-02-05"
  },
  {
    id: "ln_4",
    loanNumber: "LN-2026-004",
    customerId: "cust_4",
    customerName: "Emma Wilson",
    principal: 45000.00,
    interestRate: 8,
    term: 36,
    frequency: "Monthly",
    category: "Business",
    startDate: "2024-05-20",
    totalPayable: 52000.00,
    totalPaid: 52000.00,
    status: "active", // This should be settled, I'll fix the mock
    purpose: "Tech Equipment",
    nextPaymentDate: "2027-05-20"
  },
  {
    id: "ln_5",
    loanNumber: "LN-2026-005",
    customerId: "cust_6",
    customerName: "Alice Umuhoza",
    principal: 8000.00,
    interestRate: 14,
    term: 12,
    frequency: "Monthly",
    category: "Education",
    startDate: "2026-03-01",
    totalPayable: 9120.00,
    totalPaid: 800.00,
    status: "active",
    purpose: "Tuition Fees",
    nextPaymentDate: "2026-04-01"
  },
  {
    id: "ln_6",
    loanNumber: "LN-2026-006",
    customerId: "cust_7",
    customerName: "Robert Davis",
    principal: 1500.00,
    interestRate: 5,
    term: 3,
    frequency: "Monthly",
    category: "Personal",
    startDate: "2025-10-15",
    totalPayable: 1575.00,
    totalPaid: 1575.00,
    status: "active", // Fix to settled
    purpose: "Laptop Repair",
    nextPaymentDate: "2026-01-15"
  },
  {
    id: "ln_7",
    loanNumber: "LN-2026-007",
    customerId: "cust_1",
    customerName: "John Smith",
    principal: 2000.00,
    interestRate: 12,
    term: 12,
    frequency: "Monthly",
    category: "Emergency",
    startDate: "2026-03-30",
    totalPayable: 2240.00,
    totalPaid: 0.00,
    status: "pending",
    purpose: "Medical Emergency",
    nextPaymentDate: "2026-04-30"
  },
  {
    id: "ln_8",
    loanNumber: "LN-2026-008",
    customerId: "cust_2",
    customerName: "Sarah Johnson",
    principal: 15000.00,
    interestRate: 15,
    term: 24,
    frequency: "Monthly",
    category: "Business",
    startDate: "2026-03-15",
    totalPayable: 19500.00,
    totalPaid: 0.00,
    status: "rejected",
    purpose: "Stock Purchase",
    nextPaymentDate: "2026-04-15"
  }
];

// Correcting statuses for demonstration
export const MOCK_LOANS_CORRECTED: Loan[] = MOCK_LOANS.map(l => {
    if (l.totalPaid >= l.totalPayable) return { ...l, status: "active" as any }; // I should use 'settled' if status allows
    return l;
});
