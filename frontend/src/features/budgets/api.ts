import type {
  Budget,
  BudgetProgress,
  CreateBudgetInput,
  UpdateBudgetInput,
} from '@finance-tracker/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/queryKeys';

export type BudgetWithProgress = Budget & BudgetProgress;

export function useBudgets(month: string) {
  return useQuery({
    queryKey: [...queryKeys.budgets, month],
    queryFn: () => api<{ items: BudgetWithProgress[] }>('/budgets', { query: { month } }),
    select: (data) => data.items,
  });
}

function useInvalidateBudgets() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
}

export function useCreateBudget() {
  const invalidate = useInvalidateBudgets();
  return useMutation({
    mutationFn: (input: CreateBudgetInput) =>
      api<BudgetWithProgress>('/budgets', { method: 'POST', body: input }),
    onSuccess: invalidate,
  });
}

export function useUpdateBudget() {
  const invalidate = useInvalidateBudgets();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateBudgetInput & { id: string }) =>
      api<BudgetWithProgress>(`/budgets/${id}`, { method: 'PATCH', body: input }),
    onSuccess: invalidate,
  });
}

export function useDeleteBudget() {
  const invalidate = useInvalidateBudgets();
  return useMutation({
    mutationFn: (id: string) => api(`/budgets/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  });
}

export function useCopyBudgets() {
  const invalidate = useInvalidateBudgets();
  return useMutation({
    mutationFn: (month: string) =>
      api<{ copied: number }>('/budgets/copy-previous', { method: 'POST', body: { month } }),
    onSuccess: invalidate,
  });
}
