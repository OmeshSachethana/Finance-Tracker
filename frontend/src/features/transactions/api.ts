import type {
  CreateTransactionInput,
  Paginated,
  Transaction,
  TransactionFilters,
  TransactionSort,
  UpdateTransactionInput,
} from '@finance-tracker/shared';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/queryKeys';

export type TransactionQuery = TransactionFilters &
  Partial<TransactionSort> & { page?: number; pageSize?: number };

export function useTransactions(query: TransactionQuery) {
  return useQuery({
    queryKey: [...queryKeys.transactions, query],
    queryFn: () => api<Paginated<Transaction>>('/transactions', { query }),
    placeholderData: keepPreviousData,
  });
}

/** Transactions change balances, stats and budgets, so refresh all of them. */
function useInvalidateMoneyData() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all(
      [queryKeys.transactions, queryKeys.accounts, queryKeys.stats, queryKeys.budgets].map((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      ),
    );
}

export function useCreateTransaction() {
  const invalidate = useInvalidateMoneyData();
  return useMutation({
    mutationFn: (input: CreateTransactionInput) =>
      api<Transaction>('/transactions', { method: 'POST', body: input }),
    onSuccess: invalidate,
  });
}

export function useUpdateTransaction() {
  const invalidate = useInvalidateMoneyData();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateTransactionInput & { id: string }) =>
      api<Transaction>(`/transactions/${id}`, { method: 'PATCH', body: input }),
    onSuccess: invalidate,
  });
}

export function useDeleteTransaction() {
  const invalidate = useInvalidateMoneyData();
  return useMutation({
    mutationFn: (id: string) => api(`/transactions/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  });
}

export function useBulkDeleteTransactions() {
  const invalidate = useInvalidateMoneyData();
  return useMutation({
    mutationFn: (ids: string[]) =>
      api<{ deleted: number }>('/transactions/bulk-delete', { method: 'POST', body: { ids } }),
    onSuccess: invalidate,
  });
}
