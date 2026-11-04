import { Navigate, Outlet } from 'react-router';
import { useAuth } from './useAuth';

export function RequireAdmin() {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
