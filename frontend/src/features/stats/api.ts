import type {
  CategoryBreakdownItem,
  DateRange,
  MonthlyTrendItem,
  TransactionType,
} from '@finance-tracker/shared';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/queryKeys';

export interface Summary {
  income: number;
  expense: number;
  balance: number;
  savingsRate: number;
  count: number;
}

export function useSummary(range: DateRange) {
  return useQuery({
    queryKey: [...queryKeys.stats, 'summary', range],
    queryFn: () => api<Summary>('/stats/summary', { query: { ...range } }),
  });
}

export function useCategoryBreakdown(range: DateRange, type: TransactionType = 'expense') {
  return useQuery({
    queryKey: [...queryKeys.stats, 'by-category', range, type],
    queryFn: () =>
      api<{ items: CategoryBreakdownItem[] }>('/stats/by-category', { query: { ...range, type } }),
    select: (data) => data.items,
  });
}

export function useMonthlyTrend(months = 6) {
  return useQuery({
    queryKey: [...queryKeys.stats, 'monthly', months],
    queryFn: () => api<{ items: MonthlyTrendItem[] }>('/stats/monthly', { query: { months } }),
    select: (data) => data.items,
  });
}
