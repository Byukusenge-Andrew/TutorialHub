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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set up interceptor when provider is initialized
  setupInterceptor();

  // Try to restore user from localStorage immediately
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Then validate the token
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/validate`, {
            headers: { Authorization: `Bearer ${storedToken}` },
            timeout: 5000 // Add timeout to prevent long waiting
          });
          
          const { user: userData } = response.data.data;
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error('Token validation failed:', error);
          // Don't log out user immediately on network errors
          if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
            console.warn('Network error during validation - keeping user session');
            // Try to use stored user data
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              try {
                setUser(JSON.parse(storedUser));
                // Keep token valid
              } catch (e) {
                // If stored user is invalid, log out
                logout();
              }
            }
          } else {
            // For other errors like 401, log out
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      const { user: userData, token: newToken } = response.data.data;
      
      setUser(userData);
      setToken(newToken);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, email, password });
    const { user: userData, token: newToken } = response.data.data;
    
    // Update state
    setUser(userData);
    setToken(newToken);
    
    // Store in localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
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