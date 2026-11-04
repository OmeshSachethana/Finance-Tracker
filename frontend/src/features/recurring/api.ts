import type {
  CreateRecurringRuleInput,
  RecurringRule,
  UpdateRecurringRuleInput,
} from '@finance-tracker/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/queryKeys';

export function useRecurringRules() {
  return useQuery({
    queryKey: queryKeys.recurring,
    queryFn: () => api<{ items: RecurringRule[] }>('/recurring'),
    select: (data) => data.items,
  });
}

function useInvalidateRecurring() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.recurring });
}

export function useCreateRecurringRule() {
  const invalidate = useInvalidateRecurring();
  return useMutation({
    mutationFn: (input: CreateRecurringRuleInput) =>
      api<RecurringRule>('/recurring', { method: 'POST', body: input }),
    onSuccess: invalidate,
  });
}

export function useUpdateRecurringRule() {
  const invalidate = useInvalidateRecurring();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateRecurringRuleInput & { id: string }) =>
      api<RecurringRule>(`/recurring/${id}`, { method: 'PATCH', body: input }),
    onSuccess: invalidate,
  });
}

export function useDeleteRecurringRule() {
  const invalidate = useInvalidateRecurring();
  return useMutation({
    mutationFn: (id: string) => api(`/recurring/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  });
}

/** Creates any transactions that are due now; refreshes everything money-related. */
export function useRunRecurringRules() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api<{ created: number }>('/recurring/run', { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
