import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../lib/auth';
import { CheckCircle, Lock, AlertTriangle } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // If no token/email in URL, show an error immediately
  const invalid = !email || !token;

  // Password Validation Helper
  const validatePassword = (password: string) => {
    if (!password || password.trim() === '') {
      return 'Password cannot be empty or just whitespace.';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one digit.';
    }
    return null; // Null means validation passed
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Check complex password rules
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    // 2. Check if passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, token, newPassword, confirmPassword);
      setSuccess(true);
    } catch {
      setError('Failed to reset password. This link may have expired. Please request a new one.');
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

        {/* Invalid link */}
        {invalid && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-dark mb-2">Invalid Reset Link</h1>
            <p className="text-sm text-dark-muted mb-6">
              This password reset link is missing required parameters. Please request a new one.
            </p>
            <a
              href="/forgot-password"
              className="inline-block bg-primary hover:bg-primary-hover text-white text-sm font-medium px-6 py-2 rounded transition-colors"
            >
              Request New Link
            </a>
          </div>
        )}

        {/* Success */}
        {!invalid && success && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-dark mb-2">Password Updated!</h1>
            <p className="text-sm text-dark-muted mb-6">
              Your password has been reset successfully. You can now sign in.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 rounded transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Sign In
            </button>
          </div>
        )}

        {/* Form */}
        {!invalid && !success && (
          <>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-dark">Set New Password</h1>
              <p className="text-sm text-dark-muted mt-1">
                Choose a strong password for <span className="font-medium text-dark">{email}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full border border-border rounded focus:ring-primary focus:border-primary text-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full border border-border rounded focus:ring-primary focus:border-primary text-sm p-2"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 rounded transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}