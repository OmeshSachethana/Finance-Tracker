import type { Paginated, User, UserRole } from '@finance-tracker/shared';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/queryKeys';

export interface PlatformStats {
  users: number;
  newUsers: number;
  activeUsers: number;
  transactions: number;
}

export type AdminUser = User & { lastLoginAt: string | null; transactionCount: number };

export function usePlatformStats() {
  return useQuery({
    queryKey: [...queryKeys.admin, 'stats'],
    queryFn: () => api<PlatformStats>('/admin/stats'),
  });
}

export function useAdminUsers(query: { page: number; search?: string }) {
  return useQuery({
    queryKey: [...queryKeys.admin, 'users', query],
    queryFn: () => api<Paginated<AdminUser>>('/admin/users', { query }),
    placeholderData: keepPreviousData,
  });
}

function useInvalidateAdmin() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.admin });
}

export function useSetUserRole() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      api<{ user: User }>(`/admin/users/${id}/role`, { method: 'PATCH', body: { role } }),
    onSuccess: invalidate,
  });
}

export function useDeleteUser() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (id: string) => api(`/admin/users/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  });
}
