import { fromMinorUnits, toMinorUnits, type CurrencyCode } from '@finance-tracker/shared';

/** Parses user input like "1,234.50" into minor units, or null if it is not a valid amount. */
export function parseAmountInput(value: string, currency: CurrencyCode): number | null {
  const cleaned = value.replace(/[,\s]/g, '');
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null;
  return toMinorUnits(Number(cleaned), currency);
}

/** Formats minor units for an input field without currency symbols or grouping. */
export function formatAmountInput(minor: number, currency: CurrencyCode): string {
  return String(fromMinorUnits(minor, currency));
}
