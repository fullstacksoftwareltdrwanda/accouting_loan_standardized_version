# Frontend API Structure Documentation

This document outlines the structure of the frontend application, including all pages and their interactions with backend APIs. Each page is documented with the API calls it makes and the expected response structures.

## Authentication

### Login Page (`/login`)
- **API Calls:**
  - `loginAction` (Server Action)
    - **Input:** `{ identifier: string, password: string }`
    - **Response:** 
      ```typescript
      {
        success: boolean;
        message?: string;
        user?: {
          id: string;
          username: string;
          email: string;
          role: UserRole; // "Director" | "MD" | "Accountant" | "Secretary" | "Developer" | "Admin"
          fullName: string;
        };
      }
      ```
    - **Notes:** Currently uses demo fallback; real implementation pending.

## Dashboard Pages

### Dashboard (`/dashboard`)
- **API Calls:**
  - `getDashboardStats()`
    - **Response:** `DashboardStats`
      ```typescript
      {
        totalDistributed: number;
        activePrincipal: number;
        activeInterest: number;
        portfolioValue: number;
        totalOverdue: number;
        activeCustomers: number;
        totalAssets: number;
        totalRevenue: number;
        todayPayments: number;
        expenses: number;
        pendingApplications: number;
        equity: number;
        recentLoans: RecentLoan[];
      }
      ```
      Where `RecentLoan` is:
      ```typescript
      {
        id: string;
        loanNumber: string;
        customerName: string;
        amount: number;
        date: string;
        status: LoanStatus; // "Active" | "Pending" | "Rejected" | "Settled" | "Overdue"
      }
      ```

### Accounts (`/dashboard/accounts`)
- **API Calls:**
  - `getAccounts()`
    - **Response:** `GLAccount[]`
      ```typescript
      GLAccount {
        id: string;
        code: string;
        name: string;
        category: AccountCategory; // "Asset" | "Liability" | "Equity" | "Revenue" | "Expense" | "Balance Sheet" | "Income Statement"
        accountType: string;
        subType: string;
        normalBalance: NormalBalance; // "Debit" | "Credit"
        description?: string;
        balance: number;
        status: StatusType; // Assuming from common types
        lastModified: string;
      }
      ```
  - `createAccount(data: Partial<GLAccount>)`
    - **Input:** `Partial<GLAccount>`
    - **Response:** `GLAccount`

### Approvals (`/dashboard/approvals`)
- **API Calls:**
  - `getPendingRequests()`
    - **Response:** `ApprovalRequest[]`
      (Type definition needed from types/approval.ts)
  - `processRequest(id: string, action: "approve" | "reject")`
    - **Response:** `boolean`

### Assets (`/dashboard/assets`)
- **API Calls:**
  - `getAssets()`
    - **Response:** Asset[] (Type from types/asset.ts)
  - `createAsset(data: Partial<Asset>)`
    - **Response:** Asset

### Customers (`/dashboard/customers`)
- **API Calls:**
  - `getCustomers()`
    - **Response:** Customer[] (Type from types/customer.ts)

### Add Customer (`/dashboard/customers/add`)
- **API Calls:**
  - `createCustomer(data: Partial<Customer>)`
    - **Response:** Customer

### Expenses (`/dashboard/expenses`)
- **API Calls:**
  - `getExpenses()`
    - **Response:** Expense[] (Type from types/expense.ts)
  - `createExpense(data: Partial<Expense>)`
    - **Response:** Expense
  - `getAccounts()` (for account selection)
    - **Response:** GLAccount[]

### General Ledger (`/dashboard/general-ledger`)
- **Status:** Unfinished - Uses mock data directly, no API calls implemented.

### Loans (`/dashboard/loans`)
- **API Calls:**
  - `getLoans()` (filtered by status in components)
    - **Response:** Loan[] (Type from types/loan.ts)

### Loan Detail (`/dashboard/loans/[id]`)
- **API Calls:**
  - `getLoanById(id: string)`
    - **Response:** Loan | undefined

### Edit Loan (`/dashboard/loans/edit/[id]`)
- **API Calls:**
  - `getLoanById(id: string)`
    - **Response:** Loan | undefined

### Requested Loans (`/dashboard/loans/requested`)
- **API Calls:**
  - `getLoans()` (filtered for requested)
    - **Response:** Loan[]

### Rejected Loans (`/dashboard/loans/rejected`)
- **API Calls:**
  - `getLoans()` (filtered for rejected)
    - **Response:** Loan[]

### Overdue Loans (`/dashboard/loans/overdue`)
- **API Calls:**
  - `getLoans()` (filtered for overdue)
    - **Response:** Loan[]

### Loan Notifications (`/dashboard/loans/notifications`)
- **API Calls:**
  - `getLoans()` (for notifications)
    - **Response:** Loan[]

### Add Loan (in components)
- **API Calls:**
  - `getCustomers()` (for customer selection)
    - **Response:** Customer[]
  - `createLoan(data: any)`
    - **Response:** Loan

### Profile (`/dashboard/profile`)
- **Status:** Unfinished - Uses mock data, no API calls.

### Reports (`/dashboard/reports`)
- **API Calls:**
  - `getReports()`
    - **Response:** Report[] (Type from types/report.ts)
  - `generateReport(id: string)`
    - **Response:** Report
  - `downloadReport(id: string)`
    - **Response:** (file download)

### Financial Reports (`/dashboard/reports/financial`)
- **API Calls:**
  - `getTrialBalance()`
    - **Response:** TrialBalanceReport
  - `getBalanceSheet()`
    - **Response:** BalanceSheetReport
  - `getIncomeStatement()`
    - **Response:** IncomeStatementReport
  - `getIncomeAnalysis()`
    - **Response:** IncomeAnalysisReport

## Shared Components

### Notifications Dropdown
- **API Calls:**
  - `getNotifications()`
    - **Response:** Notification[] (Type from types/notification.ts)
  - `markAsRead(id: string)`
    - **Response:** boolean

## Notes
- All services are currently implemented as mock services with simulated delays.
- Real backend integration is pending, with TODO comments indicating where API calls should be implemented.
- Types are defined in the respective `types/*.ts` files.
- Server actions are used for authentication.
- Most pages use client-side components that fetch data on mount.</content>
<parameter name="filePath">/Users/apple/Desktop/dev/accouting_loan_standardized_version/frontend-api-structure.md