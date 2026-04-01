import { Expense } from "@/types/expense";

export const MOCK_EXPENSES: Expense[] = [
  {
    id: "exp_1",
    date: "2026-03-01",
    description: "Monthly Office Rent - Main Hub",
    category: "Fixed Cost",
    amount: 45000.00,
    accountCode: "5101",
    status: "active", // Fix to paid
    reference: "RENT-MAR-2026"
  },
  {
    id: "exp_2",
    date: "2026-03-25",
    description: "Office Internet & Fiber Optic",
    category: "Administrative",
    amount: 1200.00,
    accountCode: "5301",
    status: "active",
    reference: "INTERNET-MAR-2026"
  },
  {
    id: "exp_3",
    date: "2026-03-31",
    description: "Staff Salaries - March 2026",
    category: "Salaries",
    amount: 125000.00,
    accountCode: "5201",
    status: "active",
    reference: "PAYROLL-MAR-2026"
  },
  {
    id: "exp_4",
    date: "2026-03-10",
    description: "Marketing - Facebook Ads Campaign",
    category: "Marketing",
    amount: 5000.00,
    accountCode: "5401",
    status: "active",
    reference: "FB-ADS-KYC"
  },
  {
    id: "exp_5",
    date: "2026-03-15",
    description: "Utilities - Electricity Hub",
    category: "Variable Cost",
    amount: 2200.00,
    accountCode: "5301",
    status: "active",
    reference: "UTIL-ELECT-MAR"
  },
  {
    id: "exp_6",
    date: "2026-03-28",
    description: "Office Supplies - Stationery",
    category: "Administrative",
    amount: 350.00,
    accountCode: "5301",
    status: "active",
    reference: "SUPPLY-MAR"
  },
  {
    id: "exp_7",
    date: "2026-03-20",
    description: "Bank Transaction Fees",
    category: "Financial",
    amount: 150.00,
    accountCode: "5105",
    status: "active",
    reference: "BANK-FEES-MAR"
  }
];
