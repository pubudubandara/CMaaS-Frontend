import React, { useState } from 'react';
import { getUser, resetPassword } from '../../lib/auth';
import { CheckCircle, ShieldCheck } from 'lucide-react';

export default function ProfilePanel() {
  const user = getUser();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Pull token from URL if we landed here via the reset link
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get('token') || '';
  const resetEmail = urlParams.get('email') || user?.email || '';

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(resetEmail, resetToken, newPassword, confirmPassword);
      setResetSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setResetError('Failed to reset password. The link may have expired.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold text-dark mb-1">Organization Profile</h2>
      <p className="text-sm text-dark-muted mb-6">Update your organization details and contact info.</p>

      <form className="space-y-5 max-w-lg">
        <div>
          <label className="block text-sm font-bold text-dark mb-1">Full Name</label>
          <input
            type="text"
            value={user?.fullName || ''}
            disabled
            className="w-full border-border rounded bg-gray-100 text-gray-700 text-sm p-2 border cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-dark mb-1">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full border-border rounded bg-gray-100 text-gray-700 text-sm p-2 border cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Contact support to change your email.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-dark mb-1">Organization Name</label>
          <input
            type="text"
            value={user?.tenantName || ''}
            disabled
            className="w-full border-border rounded bg-gray-100 text-gray-700 text-sm p-2 border cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Contact support to change your organization name.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-dark mb-1">Role</label>
          <input
            type="text"
            value={user?.role || ''}
            disabled
            className="w-full border-border rounded bg-gray-100 text-gray-700 text-sm p-2 border cursor-not-allowed"
          />
        </div>
      </form>

      {/* ── Security Section ── */}
      <div className="mt-10 pt-8 border-t border-border max-w-lg">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-dark">Security</h2>
        </div>
        <p className="text-sm text-dark-muted mb-6">Update your account password.</p>

        {resetSuccess ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Password updated successfully!</p>
              <p className="text-xs text-green-700">Your new password is active.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {!resetToken && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
                To change your password, use the{' '}
                <a href="/forgot-password" className="font-medium underline hover:text-amber-900">Forgot Password</a>
                {' '}link. A secure reset link will be sent to your email.
              </div>
            )}

            {resetToken && (
              <>
                {resetError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {resetError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-dark mb-1">New Password</label>
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
                  <label className="block text-sm font-bold text-dark mb-1">Confirm Password</label>
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
                  disabled={resetLoading}
                  className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-5 py-2 rounded transition-colors disabled:opacity-50"
                >
                  {resetLoading ? 'Saving...' : 'Update Password'}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}