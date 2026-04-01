import { 
  Layout, 
  BookOpen, 
  Table, 
  Receipt, 
  Wallet, 
  BarChart, 
  Users, 
  CreditCard, 
  HelpCircle, 
  FileMinus, 
  AlertCircle, 
  Bell, 
  Download, 
  CheckCircle,
  LucideIcon
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  variant?: "default" | "ghost";
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    title: "Accounting System",
    items: [
      { title: "Dashboard", href: "/", icon: Layout },
      { title: "General Ledger", href: "/general-ledger", icon: BookOpen },
      { title: "Chart of Accounts", href: "/accounts", icon: Table },
      { title: "Expenditures", href: "/expenses", icon: Receipt },
      { title: "Fixed Assets", href: "/assets", icon: Wallet },
    ],
  },
  {
    title: "Borrowers & Loans",
    items: [
      { title: "Customers & KYC", href: "/customers", icon: Users },
      { title: "Loan Portfolio", href: "/loans", icon: CreditCard },
      { title: "Pending Applications", href: "/loans/requested", icon: HelpCircle },
      { title: "Overdue Collections", href: "/loans/overdue", icon: AlertCircle },
      { title: "Rejected History", href: "/loans/rejected", icon: FileMinus },
    ],
  },
  {
    title: "Operations & Analytics",
    items: [
      { title: "Approval Center", href: "/approvals", icon: CheckCircle },
      { title: "Reports & Export", href: "/reports", icon: BarChart },
    ],
  },
];
