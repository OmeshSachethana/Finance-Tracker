import type { User } from '@finance-tracker/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue, type AuthStatus } from './AuthContext';
import * as authApi from './authApi';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let cancelled = false;
    void authApi.restoreSession().then((restored) => {
      if (cancelled) return;
      setUser(restored);
      setStatus(restored ? 'authenticated' : 'anonymous');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback((next: User) => {
    setUser(next);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    queryClient.clear();
    setUser(null);
    setStatus('anonymous');
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      login: async (input) => signIn(await authApi.login(input)),
      register: async (input) => signIn(await authApi.register(input)),
      logout,
      setUser,
    }),
    [status, user, signIn, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
