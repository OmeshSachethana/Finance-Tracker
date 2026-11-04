import type { LoginInput, RegisterInput, User } from '@finance-tracker/shared';
import { api, setAccessToken } from '@/lib/api/client';

interface AuthResponse {
  user: User;
  accessToken: string;
}

export async function login(input: LoginInput): Promise<User> {
  const res = await api<AuthResponse>('/auth/login', { method: 'POST', body: input });
  setAccessToken(res.accessToken);
  return res.user;
}

export async function register(input: RegisterInput): Promise<User> {
  const res = await api<AuthResponse>('/auth/register', { method: 'POST', body: input });
  setAccessToken(res.accessToken);
  return res.user;
}

export async function logout(): Promise<void> {
  await api('/auth/logout', { method: 'POST' }).catch(() => undefined);
  setAccessToken(null);
}

/** Restores a session from the refresh cookie, or returns null if there is none. */
export async function restoreSession(): Promise<User | null> {
  try {
    const res = await api<AuthResponse>('/auth/refresh', { method: 'POST' });
    setAccessToken(res.accessToken);
    return res.user;
  } catch {
    return null;
  }
}
