/** Core PMT / IPMT / PPMT amortization engine — implements loan_calc.md exactly */

/** Round to nearest ₦10 unit (or nearest 10 in any currency unit) */
export function roundToNearest10(amount: number): number {
  return Math.round(amount / 10) * 10;
}

/** Fixed monthly payment (annuity formula) */
export function PMT(rate: number, nper: number, pv: number): number {
  if (rate === 0) return pv / nper;
  const factor = Math.pow(1 + rate, nper);
  return (pv * (rate * factor)) / (factor - 1);
}

/** Interest component for a given period */
export function IPMT(rate: number, period: number, nper: number, pv: number): number {
  if (rate === 0) return 0;
  if (period === 1) return pv * rate;
  const pmt = PMT(rate, nper, pv);
  let balance = pv;
  for (let i = 1; i < period; i++) {
    const interest = balance * rate;
    balance -= pmt - interest;
  }
  return balance * rate;
}

/** Principal component for a given period */
export function PPMT(rate: number, period: number, nper: number, pv: number): number {
  if (rate === 0) return pv / nper;
  return PMT(rate, nper, pv) - IPMT(rate, period, nper, pv);
}

export interface InstalmentRow {
  instalmentNumber: number;
  dueDate: string;
  openingBalance: number;
  principalAmount: number;
  interestAmount: number;
  managementFee: number;
  totalPayment: number;
  closingBalance: number;
}

export interface LoanScheduleSummary {
  loanAmount: number;
  totalDisbursed: number;
  managementFeeAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalManagementFees: number;
  totalPayment: number;
}

export interface LoanSchedule {
  summary: LoanScheduleSummary;
  instalments: InstalmentRow[];
}

/**
 * Generates a complete amortization schedule.
 * Implements logic from loan_calc.md — single source of truth.
 */
export function generateLoanSchedule(params: {
  loanAmount: number;
  interestRate: number;          // Monthly % e.g. 3 means 3%
  numberOfInstalments: number;
  managementFeeRate?: number;    // Default 5.5
  deductFeeUpfront?: boolean;    // Default true
  firstPaymentDate: string;      // ISO date
}): LoanSchedule {
  const {
    loanAmount,
    interestRate,
    numberOfInstalments,
    managementFeeRate = 5.5,
    deductFeeUpfront = true,
    firstPaymentDate,
  } = params;

  const monthlyRate = interestRate / 100;
  const managementFeeAmount = roundToNearest10(loanAmount * (managementFeeRate / 100));
  const totalDisbursed = deductFeeUpfront ? loanAmount - managementFeeAmount : loanAmount;
  const monthlyPayment = roundToNearest10(PMT(monthlyRate, numberOfInstalments, totalDisbursed));

  const instalments: InstalmentRow[] = [];
  let openingBalance = totalDisbursed;
  let totalInterestSum = 0;
  let totalFeeSum = 0;

  for (let i = 1; i <= numberOfInstalments; i++) {
    const interest = roundToNearest10(IPMT(monthlyRate, i, numberOfInstalments, totalDisbursed));
    const principal = roundToNearest10(PPMT(monthlyRate, i, numberOfInstalments, totalDisbursed));

    // Installment 1 fee = 0 when deducted upfront; from installment 2 onward fee applies
    const managementFee =
      deductFeeUpfront && i === 1
        ? 0
        : roundToNearest10(totalDisbursed * (managementFeeRate / 100));

    const totalPayment = principal + interest + managementFee;
    const closingBalance = openingBalance - principal;

    const dueDate = new Date(firstPaymentDate);
    dueDate.setMonth(dueDate.getMonth() + (i - 1));

    instalments.push({
      instalmentNumber: i,
      dueDate: dueDate.toISOString().split("T")[0],
      openingBalance,
      principalAmount: principal,
      interestAmount: interest,
      managementFee,
      totalPayment,
      closingBalance,
    });

    totalInterestSum += interest;
    totalFeeSum += managementFee;
    openingBalance = closingBalance;
  }

  return {
    summary: {
      loanAmount,
      totalDisbursed,
      managementFeeAmount,
      monthlyPayment,
      totalInterest: totalInterestSum,
      totalManagementFees: totalFeeSum,
      totalPayment: monthlyPayment * numberOfInstalments,
    },
    instalments,
  };
}

/** Days overdue for an unpaid instalment */
export function calculateDaysOverdue(dueDate: string, asOfDate?: string): number {
  const due = new Date(dueDate);
  const asOf = new Date(asOfDate ?? new Date().toISOString());
  const diffMs = asOf.getTime() - due.getTime();
  return diffMs > 0 ? Math.floor(diffMs / (1000 * 60 * 60 * 24)) : 0;
}

/** Penalty for an overdue instalment */
export function calculatePenalty(
  outstandingAmount: number,
  daysOverdue: number,
  penaltyRatePerDay = 0.001
): number {
  if (daysOverdue <= 0) return 0;
  return roundToNearest10(outstandingAmount * penaltyRatePerDay * daysOverdue);
}

/** Validate schedule internal consistency */
export function validateSchedule(schedule: LoanSchedule): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const { instalments, summary } = schedule;

  // Balance continuity
  for (let i = 1; i < instalments.length; i++) {
    if (instalments[i].openingBalance !== instalments[i - 1].closingBalance) {
      errors.push(`Balance discontinuity between periods ${i} and ${i + 1}`);
    }
  }

  // Principal sum ≈ totalDisbursed (≤ ₦10 rounding residual)
  const principalSum = instalments.reduce((s, r) => s + r.principalAmount, 0);
  if (Math.abs(principalSum - summary.totalDisbursed) > 10) {
    errors.push(`Principal sum (${principalSum}) ≠ totalDisbursed (${summary.totalDisbursed})`);
  }

  // Final closing balance ≈ 0
  const last = instalments[instalments.length - 1];
  if (Math.abs(last.closingBalance) > 10) {
    errors.push(`Final closing balance is not zero: ${last.closingBalance}`);
  }

  return { valid: errors.length === 0, errors };
}

/** Compute maturity date: first payment date + (n-1) months */
export function computeMaturityDate(firstPaymentDate: string, numberOfInstalments: number): string {
  const d = new Date(firstPaymentDate);
  d.setMonth(d.getMonth() + numberOfInstalments - 1);
  return d.toISOString().split("T")[0];
}
