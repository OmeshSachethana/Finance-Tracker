import {
  DEFAULT_CURRENCY,
  formatMoney,
  fromMinorUnits,
  type CurrencyCode,
} from '@finance-tracker/shared';
import { useCallback } from 'react';
import { useAuth } from '@/features/auth/useAuth';

/** Formats minor units in the signed-in user's currency. */
export function useMoney() {
  const { user } = useAuth();
  const currency: CurrencyCode = user?.currency ?? DEFAULT_CURRENCY;
  const format = useCallback((minor: number) => formatMoney(minor, currency), [currency]);

  /** Short form for chart axes, e.g. $4.5K. */
  const formatCompact = useCallback(
    (minor: number) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(fromMinorUnits(minor, currency)),
    [currency],
  );

  return { format, formatCompact, currency };
}
