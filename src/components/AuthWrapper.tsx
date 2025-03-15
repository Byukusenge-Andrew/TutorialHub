import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Loader } from 'lucide-react';

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}; 