import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export const RegistrationSuccess = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Get email from location state
  const email = location.state?.email;
  const requiresVerification = location.state?.requiresVerification;
  
  // If no email was passed or user is already authenticated, redirect to dashboard
  if (!email || (isAuthenticated && !requiresVerification)) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="container mx-auto max-w-md mt-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          {requiresVerification ? (
            <>
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Verify Your Email</h1>
              
              <p className="text-gray-600">
                Thanks for signing up! We've sent a verification email to <strong>{email}</strong>.
              </p>
              
              <p className="text-gray-600 mt-2">
                Please check your inbox and click the verification link to activate your account.
              </p>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> If you don't see the email, check your spam folder or 
                  <Link to="/resend-verification" className="text-primary hover:underline ml-1">
                    request a new verification link
                  </Link>.
                </p>
              </div>
              
              <div className="mt-6">
                <Link 
                  to="/login" 
                  className="text-primary hover:underline"
                >
                  Return to login
                </Link>
              </div>
            </>
          ) : (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h1 className="text-2xl font-bold">Registration Successful!</h1>
              
              <p className="text-gray-600">
                Your account has been created successfully.
              </p>
              
              <div className="mt-6">
                <Link 
                  to="/dashboard" 
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 