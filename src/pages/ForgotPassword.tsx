import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Loader } from 'lucide-react';
import axios from 'axios';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
      
      if (response.data.status === 'success') {
        setSuccess(true);
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.response?.data?.message || 'Failed to send password reset email. Please try again later.');
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
            Reset Password
          </h1>
          
          {success ? (
            <div className="text-center">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                If your email is registered, you will receive a password reset link shortly.
              </div>
              <p className="mb-4">
                Please check your email inbox and follow the instructions to reset your password.
              </p>
              <Link 
                to="/login" 
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
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
                      Sending...
                    </span>
                  ) : 'Send Reset Link'}
                </button>
                
                <div className="text-center mt-4">
                  <Link to="/login" className="text-primary hover:underline text-sm">
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 