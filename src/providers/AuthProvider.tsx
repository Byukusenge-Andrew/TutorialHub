import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/services/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, setLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.auth.validate();
        console.log('Token validation response:', response);
        
        if (response.user) {
          useAuthStore.getState().login(response.user, token);
          
          if (location.pathname === '/login' || location.pathname === '/register') {
            navigate(response.user.role === 'admin' ? '/admin' : '/dashboard');
          }
        }
      } catch (error) {
        console.error('Token validation error:', error);
        useAuthStore.getState().logout();
        if (location.pathname !== '/login' && location.pathname !== '/register') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token, navigate, location.pathname]);

  return <>{children}</>;
} 