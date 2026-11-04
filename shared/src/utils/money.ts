import { CURRENCY_DECIMALS, type CurrencyCode } from '../constants/currencies';

/** Converts a decimal amount (e.g. 12.34) to integer minor units (e.g. 1234). */
export function toMinorUnits(amount: number, currency: CurrencyCode): number {
  const factor = 10 ** CURRENCY_DECIMALS[currency];
  return Math.round(amount * factor);
}
