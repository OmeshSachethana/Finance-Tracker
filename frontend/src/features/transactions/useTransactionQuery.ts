import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { TransactionQuery } from './api';

const KEYS = [
  'type',
  'categoryId',
  'accountId',
  'from',
  'to',
  'search',
  'tag',
  'sortBy',
  'order',
] as const;

/** Keeps transaction filters, sorting and page in the URL so views can be shared and bookmarked. */
export function useTransactionQuery() {
  const [params, setParams] = useSearchParams();

  const query = useMemo<TransactionQuery>(() => {
    const result: Record<string, string | number> = { page: Number(params.get('page')) || 1 };
    for (const key of KEYS) {
      const value = params.get(key);
      if (value) result[key] = value;
    }
    return result as TransactionQuery;
  }, [params]);

  const update = useCallback(
    (changes: Partial<Record<(typeof KEYS)[number] | 'page', string | number | undefined>>) => {
      setParams((current) => {
        const next = new URLSearchParams(current);
        for (const [key, value] of Object.entries(changes)) {
          if (value === undefined || value === '') next.delete(key);
          else next.set(key, String(value));
        }
        // Changing a filter should start from the first page again.
        if (!('page' in changes)) next.delete('page');
        return next;
      });
    },
    [setParams],
  );

  const reset = useCallback(() => setParams(new URLSearchParams()), [setParams]);

  const activeFilterCount = KEYS.filter(
    (k) => k !== 'sortBy' && k !== 'order' && params.get(k),
  ).length;

  return { query, update, reset, activeFilterCount };
}
