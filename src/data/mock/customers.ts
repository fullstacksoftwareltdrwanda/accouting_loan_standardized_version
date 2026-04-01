import { Customer } from "@/types/customer";

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust_1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "+250 788 123 456",
    nin: "1199080012345678",
    status: "active",
    address: "Kigali, Rwanda - KG 123 St",
    joinedDate: "2025-01-15",
    financials: {
      totalLoans: 3,
      activeBalance: 4500.00,
      totalPaid: 12500.00,
      onTimeRepaymentRate: 98
    }
  },
  {
    id: "cust_2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@testmail.com",
    phone: "+250 788 654 321",
    nin: "2199570087654321",
    status: "active",
    address: "Musanze, Northern Province",
    joinedDate: "2024-11-20",
    financials: {
      totalLoans: 1,
      activeBalance: 12000.00,
      totalPaid: 0.00,
      onTimeRepaymentRate: 100
    }
  },
  {
    id: "cust_3",
    firstName: "David",
    lastName: "Mugisha",
    email: "d.mugisha@finance.rw",
    phone: "+250 788 999 888",
    nin: "1198880099988877",
    status: "overdue",
    address: "Huye, Southern Province",
    joinedDate: "2025-02-10",
    financials: {
      totalLoans: 2,
      activeBalance: 2500.00,
      totalPaid: 5000.00,
      onTimeRepaymentRate: 65
    }
  },
  {
    id: "cust_4",
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma.w@global.com",
    phone: "+250 789 111 222",
    nin: "1200010011122233",
    status: "active",
    joinedDate: "2025-03-05",
    financials: {
      totalLoans: 4,
      activeBalance: 0.00,
      totalPaid: 45000.00,
      onTimeRepaymentRate: 100
    }
  },
  {
    id: "cust_5",
    firstName: "Michael",
    lastName: "Twagiramungu",
    email: "michael.t@rwanda.biz",
    phone: "+250 788 333 444",
    nin: "1198570033344455",
    status: "inactive",
    joinedDate: "2024-05-12",
    financials: {
      totalLoans: 0,
      activeBalance: 0.00,
      totalPaid: 0.00,
      onTimeRepaymentRate: 0
    }
  },
  {
    id: "cust_6",
    firstName: "Alice",
    lastName: "Umuhoza",
    email: "alice.u@kigalihub.rw",
    phone: "+250 788 555 666",
    nin: "2199270055566677",
    status: "active",
    joinedDate: "2025-01-20",
    financials: {
      totalLoans: 2,
      activeBalance: 7200.00,
      totalPaid: 15000.00,
      onTimeRepaymentRate: 92
    }
  },
  {
    id: "cust_7",
    firstName: "Robert",
    lastName: "Davis",
    email: "r.davis@outlook.com",
    phone: "+250 789 777 888",
    nin: "1197810077788899",
    status: "active",
    joinedDate: "2024-09-30",
    financials: {
      totalLoans: 5,
      activeBalance: 1250.00,
      totalPaid: 65000.00,
      onTimeRepaymentRate: 99
    }
  }
];
