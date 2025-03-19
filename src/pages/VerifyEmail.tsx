import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

export const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        // const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`);
        if (import.meta.env.VITE_API_URL === 'http://localhost:3000/api') {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`);
          if (response.data.status === 'success') {
            setVerified(true);
          }
        } else if (import.meta.env.VITE_API_URL === 'https://tutorial-hub-01.vercel.app/api') {
          const response = await axios.get(`${import.meta.env.VITE_API_PROD_URL}/auth/verify-email/${token}`);
          if (response.data.status === 'success') {
            setVerified(true);
          }
        }
        
      } catch (error: any) {
        console.error('Verification error:', error);
        setError(error.response?.data?.message || 'Failed to verify email. The link may be invalid or expired.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="container mx-auto max-w-md mt-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <h2 className="text-xl font-semibold">Verifying your email...</h2>
          </div>
        ) : verified ? (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold">Email Verified Successfully!</h2>
            <p className="text-gray-600">
              Your email has been verified. You can now log in to your account.
            </p>
            <Link 
              to="/login"
              className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Log In
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold">Verification Failed</h2>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
            <p className="mt-4">
              Please try again or request a new verification link.
            </p>
            <Link 
              to="/resend-verification"
              className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Request New Link
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}; 