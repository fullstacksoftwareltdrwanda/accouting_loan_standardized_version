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
  LucideIcon,
  Package
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

// ═══════════════════════════════════════════
// TOP NAV — Icon-only bar in the header
// Primary module entry points
// ═══════════════════════════════════════════
export const topNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Layout },
  { title: "General Ledger", href: "/general-ledger", icon: BookOpen },
  { title: "Loans", href: "/loans", icon: CreditCard },
  { title: "Customers", href: "/customers", icon: Users },
  { title: "Reports", href: "/reports/financial", icon: BarChart },
];

// Full config (used for search/command palette)
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

// ═══════════════════════════════════════════
// SIDEBAR NAV — Only items NOT in the top nav
// Secondary/contextual navigation
// ═══════════════════════════════════════════
const topNavHrefs = new Set(topNavItems.map(item => item.href));

export const sidebarNavigationConfig: NavSection[] = [
  {
    title: "Accounting",
    items: [
      { title: "Chart of Accounts", href: "/accounts", icon: Table },
      { title: "Expenditures", href: "/expenses", icon: Receipt },
      { title: "Fixed Assets", href: "/assets", icon: Wallet },
    ],
  },
  {
    title: "Loan Operations",
    items: [
      { title: "Requested Loans", href: "/loans/requested", icon: HelpCircle },
      { title: "Rejected Loans", href: "/loans/rejected", icon: FileMinus },
      { title: "Overdue Instalments", href: "/loans/overdue", icon: AlertCircle },
      { title: "Payment Alerts", href: "/loans/notifications", icon: Bell },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Approval Center", href: "/approvals", icon: CheckCircle },
      { title: "General Reports", href: "/reports", icon: Download },
    ],
  },
];
