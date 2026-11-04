import type { CreateGoalInput, Goal, UpdateGoalInput } from '@finance-tracker/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/queryKeys';

export type GoalWithProgress = Goal & { percent: number; completed: boolean };

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals,
    queryFn: () => api<{ items: GoalWithProgress[] }>('/goals'),
    select: (data) => data.items,
  });
}

function useInvalidateGoals() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.goals });
}

export function useCreateGoal() {
  const invalidate = useInvalidateGoals();
  return useMutation({
    mutationFn: (input: CreateGoalInput) =>
      api<GoalWithProgress>('/goals', { method: 'POST', body: input }),
    onSuccess: invalidate,
  });
}

export function useUpdateGoal() {
  const invalidate = useInvalidateGoals();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateGoalInput & { id: string }) =>
      api<GoalWithProgress>(`/goals/${id}`, { method: 'PATCH', body: input }),
    onSuccess: invalidate,
  });
}

export function useDeleteGoal() {
  const invalidate = useInvalidateGoals();
  return useMutation({
    mutationFn: (id: string) => api(`/goals/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  });
}

export function useContributeToGoal() {
  const invalidate = useInvalidateGoals();
  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      api<GoalWithProgress>(`/goals/${id}/contributions`, { method: 'POST', body: { amount } }),
    onSuccess: invalidate,
  });
}
