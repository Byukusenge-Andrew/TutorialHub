import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
} 