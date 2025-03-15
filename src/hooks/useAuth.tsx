import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Set up axios interceptor only once
let interceptorSetup = false;
const setupInterceptor = () => {
  if (!interceptorSetup) {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    interceptorSetup = true;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set up interceptor when provider is initialized
  setupInterceptor();

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/validate`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.data.user);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
    const { user, token } = response.data.data;
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, email, password });
    const { user, token } = response.data.data;
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 