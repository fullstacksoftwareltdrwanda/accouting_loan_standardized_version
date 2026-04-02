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
      { title: "Dashboard", href: "/dashboard", icon: Layout },
      { title: "General Ledger", href: "/general-ledger", icon: BookOpen },
      { title: "Chart of Accounts", href: "/accounts", icon: Table },
      { title: "Expenditures", href: "/expenses", icon: Receipt },
      { title: "Fixed Assets", href: "/assets", icon: Wallet },
    ],
  },
  {
    title: "Business Reports",
    items: [
      { title: "Financial Reports", href: "/reports/financial", icon: BarChart },
    ],
  },
  {
    title: "Loan Management",
    items: [
      { title: "Customers", href: "/customers", icon: Users },
      { title: "Loans", href: "/loans", icon: CreditCard },
      { title: "Requested Loans", href: "/loans/requested", icon: HelpCircle },
      { title: "Rejected Loans", href: "/loans/rejected", icon: FileMinus },
      { title: "Overdue Instalments", href: "/loans/overdue", icon: AlertCircle },
      { title: "Payment Notifications", href: "/loans/notifications", icon: Bell },
    ],
  },
  {
    title: "Operations & Analytics",
    items: [
      { title: "Approval Center", href: "/approvals", icon: CheckCircle },
      { title: "General Reports", href: "/reports", icon: Download },
    ],
  },
];
