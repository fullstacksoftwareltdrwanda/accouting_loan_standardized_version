/**
 * Standard currency formatter for ALMS.
 * Currently defaults to USD, but can be easily expanded for multiple currencies.
 */
export const formatCurrency = (amount: number, currency: string = "USD", locale: string = "en-US"): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format large numbers for better readability (e.g. 1.2M).
 */
export const formatCompactNumber = (number: number, locale: string = "en-US"): string => {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
  }).format(number);
};
