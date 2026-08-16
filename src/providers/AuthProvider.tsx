import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/auth';

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
//   isVerified: boolean;
//   avatar?: string;  // Make avatar optional since not all users will have one
// }

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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set up interceptor when provider is initialized
  setupInterceptor();

  // Clean up legacy unencrypted user object from localStorage if present
  useEffect(() => {
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
    }
  }, []);

  // Validate the token and fetch user profile dynamically into state
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await axios.get(`${API_URL}/auth/validate`, {
            headers: { Authorization: `Bearer ${storedToken}` },
            timeout: 5000
          });
          
          const { user: userData } = response.data.data;
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
            // Network error during validation - keep stored token state
          } else {
            // Invalid or expired token
            logout();
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { user: userData, token: newToken } = response.data.data;
      
      setUser(userData);
      setToken(newToken);
      
      localStorage.setItem('token', newToken);
      
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    const { user: userData, token: newToken } = response.data.data;
    
    // Update in-memory state
    setUser(userData);
    setToken(newToken);
    
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
  const navigate = useNavigate();
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  if (context.user?.isVerified === false) {
    navigate("/verify-email");
  }
  
  return context;
}; 