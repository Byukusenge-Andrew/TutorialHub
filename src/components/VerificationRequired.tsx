import React, { useState } from 'react';
import { Mail, Loader } from 'lucide-react';
import axios from 'axios';

interface VerificationRequiredProps {
  email: string;
}

export const VerificationRequired: React.FC<VerificationRequiredProps> = ({ email }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResendVerification = async () => {
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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
      <div className="bg-primary/10 p-3 rounded-full mx-auto w-fit mb-4">
        <Mail className="h-8 w-8 text-primary" />
      </div>
      
      <h2 className="text-2xl font-bold mb-4">
        Email Verification Required
      </h2>
      
      <p className="mb-4">
        We've sent a verification email to <strong>{email}</strong>.
        Please check your inbox and click the verification link to activate your account.
      </p>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Verification email sent! Please check your inbox.
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <p className="text-sm text-gray-600 mb-4">
        Didn't receive the email? Check your spam folder or click below to resend.
      </p>
      
      <button 
        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleResendVerification}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <Loader className="animate-spin h-5 w-5 mr-2" />
            Sending...
          </span>
        ) : 'Resend Verification Email'}
      </button>
    </div>
  );
}; 