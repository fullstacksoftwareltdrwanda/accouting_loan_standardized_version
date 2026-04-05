# Loan Calculation Formulas and Methodology

## Overview

This document explains the mathematical formulas and calculation methodology used in the MoneyTap loan management system for calculating monthly payments, interest, principal, and balance tracking for each loan installment. All implementations are in JavaScript/TypeScript.

## Key Concepts

### Loan Terms

- **Principal (P)**: The initial loan amount disbursed to the customer
- **Interest Rate (r)**: Monthly interest rate (annual rate divided by 12)
- **Term (n)**: Number of installments/periods
- **Management Fee Rate**: Fixed percentage (5.5%) charged on the loan amount
- **Total Disbursed**: Principal + Management Fee (if not deducted upfront)

---

## Core Financial Formulas

### 1. Monthly Payment Calculation (PMT)

The fixed monthly payment amount is calculated using the standard annuity formula:

```
PMT = P × [r(1+r)^n] / [(1+r)^n - 1]
```

Where:
- **P**: Principal amount (`totalDisbursed`)
- **r**: Monthly interest rate (`interestRate / 100`)
- **n**: Number of installments

**Implementation in JavaScript:**

```javascript
/**
 * Calculates the fixed monthly payment (PMT) for a loan.
 * @param {number} rate  - Monthly interest rate as a decimal (e.g., 0.03 for 3%)
 * @param {number} nper  - Total number of installment periods
 * @param {number} pv    - Present value / principal amount
 * @returns {number} Fixed monthly payment amount (positive)
 */
function PMT(rate, nper, pv) {
  if (rate === 0) {
    return pv / nper;
  }
  const factor = Math.pow(1 + rate, nper);
  return (pv * (rate * factor)) / (factor - 1);
}
```

---

### 2. Interest Payment per Period (IPMT)

The interest portion of each payment is calculated as:

```
IPMT = Opening Balance × r
```

Where:
- **Opening Balance**: Remaining principal balance at the start of the period
- **r**: Monthly interest rate

**Implementation in JavaScript:**

```javascript
/**
 * Calculates the interest portion of a specific installment payment (IPMT).
 * @param {number} rate   - Monthly interest rate as a decimal
 * @param {number} period - The installment period number (1-based)
 * @param {number} nper   - Total number of installment periods
 * @param {number} pv     - Present value / principal amount
 * @returns {number} Interest amount for the given period (positive)
 */
function IPMT(rate, period, nper, pv) {
  if (period === 1) {
    return pv * rate;
  }

  const pmt = PMT(rate, nper, pv);
  let remainingBalance = pv;

  for (let i = 1; i < period; i++) {
    const interest = remainingBalance * rate;
    const principal = pmt - interest;
    remainingBalance -= principal;
  }

  return remainingBalance * rate;
}
```

---

### 3. Principal Payment per Period (PPMT)

The principal portion of each payment is calculated as:

```
PPMT = PMT - IPMT
```

Or equivalently:

```
PPMT = Opening Balance - Closing Balance
```

**Implementation in JavaScript:**

```javascript
/**
 * Calculates the principal portion of a specific installment payment (PPMT).
 * @param {number} rate   - Monthly interest rate as a decimal
 * @param {number} period - The installment period number (1-based)
 * @param {number} nper   - Total number of installment periods
 * @param {number} pv     - Present value / principal amount
 * @returns {number} Principal amount for the given period (positive)
 */
function PPMT(rate, period, nper, pv) {
  if (rate === 0) {
    return pv / nper;
  }
  const pmt = PMT(rate, nper, pv);
  const ipmt = IPMT(rate, period, nper, pv);
  return pmt - ipmt;
}
```

---

## Installment Schedule Generation

### Rounding Helper

All monetary amounts are rounded to the nearest 10 units (₦10) for consistency:

```javascript
/**
 * Rounds a monetary amount to the nearest 10 units.
 * @param {number} amount - Raw calculated amount
 * @returns {number} Amount rounded to the nearest 10
 */
function roundToNearest10(amount) {
  return Math.round(amount / 10) * 10;
}
```

---

### Step-by-Step Calculation Process

For each installment period (`i = 1` to `n`):

1. **Opening Balance**
   - Period 1: Total disbursed amount
   - Subsequent periods: Closing balance from the previous period

2. **Interest Calculation**
   ```
   Interest = Opening Balance × (interestRate / 100)
   ```

3. **Principal Calculation**
   ```
   Principal = PPMT(monthlyRate, i, term, totalDisbursed)
   ```

4. **Management Fee**
   - First installment: `0` (when `deductFeeUpfront = true`)
   - Subsequent installments: `totalDisbursed × (managementFeeRate / 100)`

5. **Total Payment**
   ```
   Total Payment = Principal + Interest + Management Fee
   ```

6. **Closing Balance**
   ```
   Closing Balance = Opening Balance - Principal
   ```

---

### Full Schedule Generator

```javascript
/**
 * Generates a complete loan amortization schedule.
 *
 * @param {object} params
 * @param {number}  params.loanAmount        - Original principal amount
 * @param {number}  params.interestRate      - Monthly interest rate as a percentage (e.g., 3 for 3%)
 * @param {number}  params.numberOfInstalments - Total repayment periods
 * @param {number}  params.managementFeeRate - Management fee as a percentage (default 5.5)
 * @param {boolean} params.deductFeeUpfront  - If true, fee is deducted from disbursement
 * @param {string}  params.firstPaymentDate  - ISO date string for first installment due date
 *
 * @returns {object} Schedule object containing summary and instalments array
 */
function generateLoanSchedule({
  loanAmount,
  interestRate,
  numberOfInstalments,
  managementFeeRate = 5.5,
  deductFeeUpfront = true,
  firstPaymentDate,
}) {
  const monthlyRate = interestRate / 100;
  const managementFeeAmount = roundToNearest10(loanAmount * (managementFeeRate / 100));

  // Determine the actual amount disbursed to the customer
  const totalDisbursed = deductFeeUpfront
    ? loanAmount - managementFeeAmount
    : loanAmount;

  const monthlyPayment = roundToNearest10(PMT(monthlyRate, numberOfInstalments, totalDisbursed));

  const instalments = [];
  let openingBalance = totalDisbursed;
  let totalInterestSum = 0;
  let totalFeeSum = 0;

  for (let i = 1; i <= numberOfInstalments; i++) {
    const interest = roundToNearest10(IPMT(monthlyRate, i, numberOfInstalments, totalDisbursed));
    const principal = roundToNearest10(PPMT(monthlyRate, i, numberOfInstalments, totalDisbursed));

    // Management fee: zero on first installment when deducted upfront; applied from installment 2 onward
    const managementFee =
      deductFeeUpfront && i === 1
        ? 0
        : roundToNearest10(totalDisbursed * (managementFeeRate / 100));

    const totalPayment = principal + interest + managementFee;
    const closingBalance = openingBalance - principal;

    // Calculate due date based on first payment date
    const dueDate = new Date(firstPaymentDate);
    dueDate.setMonth(dueDate.getMonth() + (i - 1));

    instalments.push({
      instalmentNumber:  i,
      dueDate:           dueDate.toISOString().split('T')[0],
      openingBalance,
      principal,
      interest,
      managementFee,
      totalPayment,
      closingBalance,
    });

    totalInterestSum += interest;
    totalFeeSum      += managementFee;
    openingBalance    = closingBalance;
  }

  return {
    summary: {
      loanAmount,
      totalDisbursed,
      monthlyPayment,
      managementFeeAmount,
      totalInterest:       totalInterestSum,
      totalManagementFees: totalFeeSum,
      totalPayment:        monthlyPayment * numberOfInstalments,
    },
    instalments,
  };
}
```

---

## Database Schema

### Loan Portfolio Table (`loan_portfolio`)

| Column | Description |
|---|---|
| `loan_amount` | Original principal amount |
| `total_disbursed` | Amount actually given to customer |
| `interest_rate` | Monthly interest rate percentage |
| `number_of_instalments` | Total number of payments |
| `monthly_payment` | Fixed payment amount (calculated) |
| `management_fee_rate` | Fee rate percentage |
| `management_fee_amount` | Computed fee amount |
| `total_management_fees` | Cumulative fees over the term |
| `total_interest` | Total interest over the term |
| `total_payment` | Grand total repayment amount |
| `principal_outstanding` | Remaining principal balance |
| `interest_outstanding` | Outstanding interest |
| `total_outstanding` | Total amount still owed |
| `total_paid` | Cumulative amount received |
| `loan_status` | Pending \| Active \| Overdue \| Settled |
| `disbursement_date` | Date loan was disbursed |
| `maturity_date` | Date of final installment |
| `days_overdue` | Days oldest unpaid installment is overdue |

### Loan Installments Table (`loan_instalments`)

| Column | Description |
|---|---|
| `instalment_number` | Payment period (1, 2, 3, …) |
| `opening_balance` | Principal balance at start of period |
| `closing_balance` | Principal balance at end of period |
| `principal_amount` | Principal portion of scheduled payment |
| `interest_amount` | Interest portion of scheduled payment |
| `management_fee` | Management fee for this period |
| `total_payment` | Total amount due for this period |
| `paid_amount` | Actual total amount paid |
| `principal_paid` | Principal portion of actual payments |
| `interest_paid` | Interest portion of actual payments |
| `management_fee_paid` | Fee portion of actual payments |
| `balance_remaining` | Outstanding for this installment |
| `status` | Pending \| Paid \| PartiallyPaid \| Overdue \| Waived |
| `payment_date` | Date payment was received |
| `days_overdue` | Days past due date |
| `penalty_amount` | Penalty charged for overdue |
| `penalty_paid` | Penalty amount collected |

---

## Example Calculation

**Loan Details:**
- Principal: ₦100,000
- Interest Rate: 3% per month (36% annual)
- Term: 12 months
- Management Fee: 5.5% of principal
- Fee deducted upfront: `true`

**Monthly Payment Calculation:**

```
r = 0.03
n = 12
P = 100,000

PMT = 100,000 × [0.03(1+0.03)^12] / [(1+0.03)^12 - 1]
    = 100,000 × [0.03 × 1.4258] / [1.4258 - 1]
    = 100,000 × 0.04277 / 0.4258
    ≈ ₦10,050
```

**First Installment Breakdown:**

| Component | Calculation | Amount |
|---|---|---|
| Opening Balance | — | ₦100,000 |
| Interest | 100,000 × 0.03 | ₦3,000 |
| Principal | PPMT(0.03, 1, 12, 100000) | ₦7,050 |
| Management Fee | ₦0 (first installment) | ₦0 |
| **Total Payment** | 7,050 + 3,000 + 0 | **₦10,050** |
| Closing Balance | 100,000 − 7,050 | ₦92,950 |

**Second Installment Breakdown:**

| Component | Calculation | Amount |
|---|---|---|
| Opening Balance | — | ₦92,950 |
| Interest | 92,950 × 0.03 | ₦2,789 |
| Principal | PPMT(0.03, 2, 12, 100000) | ₦7,261 |
| Management Fee | 100,000 × 0.055 | ₦5,500 |
| **Total Payment** | 7,261 + 2,789 + 5,500 | **₦15,550** |
| Closing Balance | 92,950 − 7,261 | ₦85,689 |

---

## Special Cases

### Zero Interest Rate

When `interestRate = 0`, equal principal payments are made each period:

```javascript
// PMT with zero rate
function PMT(rate, nper, pv) {
  if (rate === 0) {
    return pv / nper;        // Equal principal split
  }
  // ... standard formula
}

// PPMT with zero rate
function PPMT(rate, period, nper, pv) {
  if (rate === 0) {
    return pv / nper;        // Same as PMT — no interest component
  }
  // ... standard formula
}

// IPMT with zero rate always returns 0
// Interest = openingBalance × 0 = 0
```

### Management Fee Deduction

```javascript
// deductFeeUpfront = true
const totalDisbursed = loanAmount - managementFeeAmount;
// Customer receives less; installment 1 fee = 0, installments 2–n carry fee

// deductFeeUpfront = false
const totalDisbursed = loanAmount;
// Customer receives full amount; fee spread across installments 2–n
```

### Overdue and Penalties

Days overdue and penalty amounts are computed separately from the amortization schedule:

```javascript
/**
 * Calculates days overdue for an unpaid installment.
 * @param {string} dueDate     - ISO date string of the installment due date
 * @param {string} [asOfDate]  - ISO date to evaluate against (defaults to today)
 * @returns {number} Number of days overdue (0 if not overdue)
 */
function calculateDaysOverdue(dueDate, asOfDate = new Date().toISOString()) {
  const due   = new Date(dueDate);
  const asOf  = new Date(asOfDate);
  const diffMs = asOf - due;
  return diffMs > 0 ? Math.floor(diffMs / (1000 * 60 * 60 * 24)) : 0;
}

/**
 * Calculates the penalty amount for an overdue installment.
 * @param {number} outstandingAmount - Total amount still owed on the installment
 * @param {number} daysOverdue       - Number of days past due
 * @param {number} penaltyRatePerDay - Daily penalty rate as a decimal (e.g., 0.001 for 0.1%/day)
 * @returns {number} Penalty amount rounded to nearest 10
 */
function calculatePenalty(outstandingAmount, daysOverdue, penaltyRatePerDay = 0.001) {
  if (daysOverdue <= 0) return 0;
  return roundToNearest10(outstandingAmount * penaltyRatePerDay * daysOverdue);
}
```

---

## Validation and Accuracy

The system ensures calculation accuracy through:

1. **Rounding Consistency** — All amounts rounded to nearest ₦10 before storage
2. **Balance Reconciliation** — Closing balance of period `n` equals opening balance of period `n+1`
3. **Total Verification** — Sum of all `principal` payments must equal `totalDisbursed`
4. **Payment Schedule Integrity** — Total payments reconcile against calculated PMT

```javascript
/**
 * Validates a generated schedule for internal consistency.
 * @param {object} schedule - Output of generateLoanSchedule()
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateSchedule(schedule) {
  const errors = [];
  const { instalments, summary } = schedule;

  // 1. Balance continuity
  for (let i = 1; i < instalments.length; i++) {
    if (instalments[i].openingBalance !== instalments[i - 1].closingBalance) {
      errors.push(`Balance discontinuity between periods ${i} and ${i + 1}`);
    }
  }

  // 2. Principal sum equals totalDisbursed (allowing ₦10 rounding residual)
  const principalSum = instalments.reduce((sum, row) => sum + row.principal, 0);
  if (Math.abs(principalSum - summary.totalDisbursed) > 10) {
    errors.push(
      `Principal sum (${principalSum}) does not match totalDisbursed (${summary.totalDisbursed})`
    );
  }

  // 3. Final closing balance should be 0
  const lastRow = instalments[instalments.length - 1];
  if (Math.abs(lastRow.closingBalance) > 10) {
    errors.push(`Final closing balance is not zero: ${lastRow.closingBalance}`);
  }

  return { valid: errors.length === 0, errors };
}
```

---

## Backend Architecture and Feature Mapping

### Backend Code Organization

| Path | Role |
|---|---|
| `src/config/database.ts` | Database connection pool using environment-based credentials |
| `src/index.ts` | Express app entry point; mounts routers |
| `src/routes/*.ts` | Route definitions for each feature domain |
| `src/controllers/*.ts` | Request handlers; delegate to services |
| `src/services/*.ts` | Business logic, schedule generation, payment allocation |
| `src/helpers/loanCalculations.ts` | Core PMT / IPMT / PPMT / schedule builder functions |
| `src/helpers/accountingFunctions.ts` | Double-entry ledger posting, journal entry builders |
| `src/helpers/approvalHelper.ts` | Approval workflow execution and payload translation |
| `src/middleware/auth.ts` | JWT verification and role guard middleware |

---

### Functional Areas

#### Loan Origination and Disbursement

Primary files:
- `src/services/loanService.ts`
- `src/helpers/loanCalculations.ts`
- `src/helpers/accountingFunctions.ts`

Responsibilities:
- Input validation for borrower data, loan terms, top-up options, and fee deduction mode
- Loan term calculations: loan amount, management fee, interest schedule, monthly payment
- Persist master loan data into `loan_portfolio`
- Build installment rows in `loan_instalments` with opening/closing balance, principal, interest, fee, and total payment
- Log disbursement in `loan_transactions`
- Post accounting entries for cash movement, loan asset creation, fee income, and VAT

#### Installment Scheduling

Key functions in `src/helpers/loanCalculations.ts`:
- `generateLoanSchedule()` — computes the full amortization table
- `createInstallmentSchedule()` — persists schedule rows to `loan_instalments`

Data produced:
- One row per installment in `loan_instalments`
- `opening_balance` derived from the previous `closing_balance`
- `principal_amount` computed using `PPMT()`
- `interest_amount` computed from `openingBalance × monthlyRate`
- `management_fee` per installment; zero for installment 1 when fees are deducted upfront
- `total_payment` is the sum of principal, interest, and fee

#### Payment Capture and Allocation

Primary files:
- `src/services/paymentService.ts`
- `src/helpers/accountingFunctions.ts`

Responsibilities:
- Record regular payments with explicit breakup into principal, interest, fees, and penalties
- Support prepayments where the current installment receives full payment and future installments may pay principal only
- Store payment history in `loan_payments`
- Update `loan_instalments` states: `paid_amount`, `principal_paid`, `interest_paid`, `management_fee_paid`, `balance_remaining`, `status`, `payment_date`
- Update `loan_portfolio` summary totals and outstanding balances
- Support payment reversal and restore installment plus ledger consistency

#### Loan Approval Workflow

Primary files:
- `src/helpers/approvalHelper.ts`
- `src/services/approvalService.ts`

Responsibilities:
- Capture sensitive create/edit/delete operations in `pending_approvals`
- Allow only authorized roles (Director/MD) to execute them
- Translate JSON approval payloads into database inserts or updates for customers, loans, and related data
- Maintain a central approval execution path for loan and customer changes

#### Accounting and Ledger

Primary files:
- `src/helpers/accountingFunctions.ts`
- `src/services/ledgerService.ts`

Responsibilities:
- Post double-entry ledger transactions for loan and non-loan activity
- Manage journal batches through `journal_entries` and `journal_lines` for loan disbursements and accruals
- Provide a manual ledger interface and reconciliation tools
- Export financial reports and PDF statements from ledger data

#### Overdue and Reporting

Primary files:
- `src/services/reportService.ts`
- `src/jobs/updateOverdue.ts`

Responsibilities:
- Aggregate overdue installments and calculate days overdue
- Present portfolio KPIs and statutory financial summary
- Reconcile loan schedule data with ledger balances for reporting

---

### Loan Operations ↔ Accounting Translation

#### Disbursement

When a loan is created through the approval workflow:

```
DR  1201  Loans to Customers          loanAmount
  CR  1101/1102/1103  Cash/Bank           totalDisbursed
  CR  4202  Upfront Fee Income            managementFeeAmount (if upfront)
  CR  2105  VAT Payable                   VAT on fee (7.5%)
```

#### Regular Payments

When a borrower makes a payment:

```
DR  1101/1102/1103  Cash/Bank           paymentAmount
  CR  1201  Loans to Customers            principalAmount
  CR  4101  Interest Income               interestAmount
  CR  4201  Management Fee Income         monitoringFee
  CR  4205  Penalty Income                penalties (if applicable)
```

#### Accruals (Month-End)

```
DR  1203  Interest Receivable           interestAccrued
DR  1204  Management Fee Receivable     feeAccrued
  CR  4101  Interest Income               interestAccrued
  CR  4202  Management Fee Income         feeAccrued
  CR  2105  VAT Payable                   VAT on fee
```

---

### Key Helper Functions and Their Roles

| Function | File | Role |
|---|---|---|
| `PMT(rate, nper, pv)` | `loanCalculations.ts` | Calculates fixed monthly payment |
| `IPMT(rate, period, nper, pv)` | `loanCalculations.ts` | Calculates interest component per period |
| `PPMT(rate, period, nper, pv)` | `loanCalculations.ts` | Calculates principal component per period |
| `roundToNearest10(amount)` | `loanCalculations.ts` | Rounds to nearest ₦10 unit |
| `generateLoanSchedule(params)` | `loanCalculations.ts` | Builds the full amortization table |
| `validateSchedule(schedule)` | `loanCalculations.ts` | Checks schedule for internal consistency |
| `calculateDaysOverdue(dueDate)` | `loanCalculations.ts` | Computes days past due date |
| `calculatePenalty(amount, days)` | `loanCalculations.ts` | Computes overdue penalty charge |
| `createLedgerEntry(params)` | `accountingFunctions.ts` | Inserts a single ledger row |
| `createJournalEntry(lines)` | `accountingFunctions.ts` | Posts a balanced journal batch |
| `createDisbursementEntries(loan)` | `accountingFunctions.ts` | Posts all entries for a loan disbursement |
| `recalculateRemainingSchedule(loanId)` | `accountingFunctions.ts` | Re-amortizes future installments after prepayment or reversal |
| `syncLoanPortfolio(loanId)` | `accountingFunctions.ts` | Refreshes `loan_portfolio` aggregate totals from installment detail |
| `executeApproval(approvalId)` | `approvalHelper.ts` | Translates approval payload into database mutations |
| `getConnection()` | `database.ts` | Returns a database connection from the pool |

---

### Practical Backend Flow Summary

#### New Loan Creation

```
1.  Validate input and compute loan terms using generateLoanSchedule()
2.  Insert loan_portfolio record (status: Pending)
3.  Create pending_approvals entry with full payload snapshot
4.  On Director/MD approval:
    a.  Execute approval → insert/update loan_portfolio (status: Active)
    b.  Persist installment rows via createInstallmentSchedule()
    c.  Write loan_transactions disbursement event
    d.  Post ledger entries via createDisbursementEntries()
```

#### Recording Payments

```
1.  Validate payment data (amount ≤ balance_remaining)
2.  Post ledger entries: DR cash/bank, CR principal + income accounts
3.  Insert row into loan_payments
4.  Update loan_instalments (paid amounts, status, payment_date)
5.  Call syncLoanPortfolio() to refresh loan_portfolio totals
6.  If prepayment: call recalculateRemainingSchedule() to rebuild future rows
```

#### Payment Reversal

```
1.  Fetch payment and linked loan_instalments row
2.  Reverse paid amounts and balance state in loan_instalments
3.  Delete ledger entries linked to payment reference
4.  Delete loan_payments row
5.  Call syncLoanPortfolio() to restore consistency
```

#### Reporting and Overdue Analytics

```
1.  Query loan_portfolio and loan_instalments for portfolio metrics
2.  Use ledger table for financial analytics and revenue recognition
3.  Run nightly job (updateOverdue.ts) to recalculate days_overdue across all active loans
4.  Export PDFs and Excel files from reportService.ts using server-side rendering
```

---

### What This Means for the System

- Loan business rules are separated from payment history and accounting entries
- Loan transactions are represented in both operational tables (`loan_instalments`, `loan_payments`) and accounting tables (`ledger`, `journal_entries`)
- The system keeps the amortization schedule as the source of truth while actual receipts in payments and accounting are reconciled against it
- Every loan action can be traced from customer approval through loan creation to ledger posting