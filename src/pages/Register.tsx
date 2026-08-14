import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2, UserPlus, Eye, EyeOff, Check, X } from 'lucide-react';
import axios from 'axios';

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs transition-colors ${met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
      {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </div>
  );
}

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const hasMinLength = password.length >= 8;
  const hasMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!hasMinLength) { setError('Password must be at least 8 characters.'); return; }
    if (!hasMatch) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      setError(msg || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-400 to-primary" />
          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <UserPlus className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
              <p className="text-muted-foreground text-sm mt-1">Join TutorialHub and start learning</p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors placeholder:text-muted-foreground"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors placeholder:text-muted-foreground"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors placeholder:text-muted-foreground pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <div className="flex gap-3 mt-2">
                    <PasswordRule met={hasMinLength} label="8+ characters" />
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors placeholder:text-muted-foreground pr-10"
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="flex gap-3 mt-2">
                    <PasswordRule met={hasMatch} label="Passwords match" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};