import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Loader, LogIn } from 'lucide-react';
import { VerificationRequired } from '@/components/VerificationRequired';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {user} = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if(user?.role == "admin"){
        navigate("/admin")
      }else if(user?.role ==  "user"){
        navigate("/dashboard")
      }else{
        console.error("Uknown type of user detected redirected to login");
        navigate("/login")
      }
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.response?.data?.needsVerification) {
        setNeedsVerification(true);
        
      } else {
        setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
      }
      setLoading(false);
    }
  };

  if (needsVerification) {
    return <VerificationRequired email={email} />;
  }

  return (
    <div className="container mx-auto max-w-md mt-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Log In</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Logging in...
                </span>
              ) : 'Log In'}
            </button>
            
            <div className="flex justify-between mt-4">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
              <Link to="/register" className="text-sm text-primary hover:underline">
                Don't have an account? Sign up
              </Link>
            </div>
            
            <div className="text-center mt-4">
              <Link to="/resend-verification" className="text-sm text-primary hover:underline">
                Need a new verification email?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};