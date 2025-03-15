import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { KeyRound, Loader } from 'lucide-react';
import axios from 'axios';

export const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        token,
        password
      });
      
      if (response.data.status === 'success') {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">
            Reset Your Password
          </h1>
          
          {success ? (
            <div className="text-center">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Password has been reset successfully!
              </div>
              <p className="mb-4">
                You will be redirected to the login page in a few seconds.
              </p>
              <Link 
                to="/login" 
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-4">
                Please enter your new password below.
              </p>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Resetting...
                    </span>
                  ) : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 