import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/services/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, setLoading, setUser } = useAuthStore();
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
        const result = await api.auth.validate();
        if (result?.user) {
          setUser(result.user);
          useAuthStore.getState().login(result.user, token);
          
          if (location.pathname === '/login' || location.pathname === '/register') {
            navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
          }
        } else {
          setUser(null);
          useAuthStore.getState().logout();
          if (location.pathname !== '/login' && location.pathname !== '/register') {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setUser(null);
        useAuthStore.getState().logout();
        if (location.pathname !== '/login' && location.pathname !== '/register') {
          navigate('/login');
        }
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token, navigate, location.pathname]);

  return <>{children}</>;
} 