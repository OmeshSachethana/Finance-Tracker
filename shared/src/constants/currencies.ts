export const CURRENCIES = ['USD', 'EUR', 'GBP', 'LKR', 'INR', 'AUD', 'CAD', 'JPY', 'SGD'] as const;

export type CurrencyCode = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: CurrencyCode = 'USD';

/** Number of minor units (e.g. cents) per currency. */
export const CURRENCY_DECIMALS: Record<CurrencyCode, number> = {
  USD: 2,
  EUR: 2,
  GBP: 2,
  LKR: 2,
  INR: 2,
  AUD: 2,
  CAD: 2,
  JPY: 0,
  SGD: 2,
};
