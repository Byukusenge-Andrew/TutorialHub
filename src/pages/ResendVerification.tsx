import React, { useState } from 'react';
import { Mail, Loader } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-verification`, { email });
      
      if (response.data.status === 'success') {
        setSuccess(true);
      }
    } catch (error: any) {
      console.error('Error resending verification:', error);
      setError(error.response?.data?.message || 'Failed to send verification email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">
            Resend Verification Email
          </h1>
          
          {success ? (
            <div className="text-center">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Verification email sent! Please check your inbox.
              </div>
              <p className="mb-4">
                If you don't see the email, please check your spam folder.
              </p>
              <Link 
                to="/login" 
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full">
              <p className="mb-4">
                Enter your email address below and we'll send you a new verification link.
              </p>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
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
                ) : 'Send Verification Email'}
              </button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Remember your password? <Link to="/login" className="text-primary hover:underline">Log in</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}; 