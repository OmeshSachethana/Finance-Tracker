import { Navigate, Outlet } from 'react-router';
import { FullPageSpinner } from '@/components/layout/FullPageSpinner';
import { useAuth } from './useAuth';

/** Keeps signed-in users away from login and register pages. */
export function RedirectIfAuthenticated() {
  const { status } = useAuth();
  if (status === 'loading') return <FullPageSpinner />;
  if (status === 'authenticated') return <Navigate to="/" replace />;
  return <Outlet />;
}
