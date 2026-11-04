import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@finance-tracker/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/queryKeys';
import { sortCategories } from './sortCategories';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => api<{ items: Category[] }>('/categories'),
    select: (data) => sortCategories(data.items),
    staleTime: 5 * 60_000,
  });
}

function useInvalidateCategories() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.categories });
}

export function useCreateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      api<Category>('/categories', { method: 'POST', body: input }),
    onSuccess: invalidate,
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateCategoryInput & { id: string }) =>
      api<Category>(`/categories/${id}`, { method: 'PATCH', body: input }),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reassignTo }: { id: string; reassignTo?: string }) =>
      api(`/categories/${id}`, { method: 'DELETE', query: { reassignTo } }),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
