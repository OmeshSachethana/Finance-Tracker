import type {
  ChangePasswordInput,
  DeleteAccountInput,
  UpdateProfileInput,
  User,
} from '@finance-tracker/shared';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      api<{ user: User }>('/users/me', { method: 'PATCH', body: input }).then((r) => r.user),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      api('/users/me/password', { method: 'POST', body: input }),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (input: DeleteAccountInput) => api('/users/me', { method: 'DELETE', body: input }),
  });
}
