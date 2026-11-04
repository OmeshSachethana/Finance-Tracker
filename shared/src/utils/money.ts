import { CURRENCY_DECIMALS, type CurrencyCode } from '../constants/currencies.ts';

/** Converts a decimal amount (e.g. 12.34) to integer minor units (e.g. 1234). */
export function toMinorUnits(amount: number, currency: CurrencyCode): number {
  const factor = 10 ** CURRENCY_DECIMALS[currency];
  return Math.round(amount * factor);
}

/** Converts integer minor units (e.g. 1234) back to a decimal amount (e.g. 12.34). */
export function fromMinorUnits(minor: number, currency: CurrencyCode): number {
  const factor = 10 ** CURRENCY_DECIMALS[currency];
  return minor / factor;
}

/** Formats integer minor units as a localized currency string. */
export function formatMoney(minor: number, currency: CurrencyCode, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: CURRENCY_DECIMALS[currency],
    maximumFractionDigits: CURRENCY_DECIMALS[currency],
  }).format(fromMinorUnits(minor, currency));
}
