import { Navigate, Outlet, useLocation } from 'react-router';
import { FullPageSpinner } from '@/components/layout/FullPageSpinner';
import { useAuth } from './useAuth';

/** Renders child routes only for signed-in users, otherwise redirects to login. */
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullPageSpinner />;
  if (status === 'anonymous') return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
