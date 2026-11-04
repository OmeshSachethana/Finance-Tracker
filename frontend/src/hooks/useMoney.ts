import { DEFAULT_CURRENCY, formatMoney, type CurrencyCode } from '@finance-tracker/shared';
import { useCallback } from 'react';
import { useAuth } from '@/features/auth/useAuth';

/** Formats minor units in the signed-in user's currency. */
export function useMoney() {
  const { user } = useAuth();
  const currency: CurrencyCode = user?.currency ?? DEFAULT_CURRENCY;
  const format = useCallback((minor: number) => formatMoney(minor, currency), [currency]);
  return { format, currency };
}
