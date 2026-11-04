export const CURRENCIES = ['USD', 'EUR', 'GBP', 'LKR', 'INR', 'AUD', 'CAD', 'JPY', 'SGD'] as const;

export type CurrencyCode = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: CurrencyCode = 'USD';
