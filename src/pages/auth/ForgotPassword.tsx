import React, { useState } from 'react';
import { forgotPassword } from '../../lib/auth';
import { CheckCircle, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setError('Failed to send reset email. Please check the email address and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-surface p-8 rounded shadow-md border border-border w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <a href="/">
            <div className="bg-primary p-3 rounded-lg">
              <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            </div>
          </a>
        </div>

        {/* ── Sent confirmation ── */}
        {sent ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-dark mb-2">Check Your Email</h1>
            <p className="text-sm text-dark-muted mb-1">We sent a password reset link to</p>
            <p className="text-sm font-semibold text-dark mb-4">{email}</p>
            <p className="text-xs text-dark-muted mb-6">
              Click the link in the email to reset your password. If you don't see it, check your spam folder.
            </p>
            <a href="/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="w-3 h-3" /> Back to Sign In
            </a>
          </div>
        ) : (
          <>
            {/* ── Email form ── */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-dark">Forgot Password?</h1>
              <p className="text-sm text-dark-muted mt-1">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-border rounded focus:ring-primary focus:border-primary text-sm p-2"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 rounded transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-center text-sm text-dark-muted mt-6">
              <a href="/login" className="text-primary hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Back to Sign In
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
