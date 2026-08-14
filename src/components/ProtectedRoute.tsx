import { Navigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
} 