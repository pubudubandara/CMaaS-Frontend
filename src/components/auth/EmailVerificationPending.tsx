import { Mail, AlertCircle } from 'lucide-react';
import ResendVerificationEmail from './ResendVerificationEmail';

interface EmailVerificationPendingProps {
  email: string;
  onBackToLogin?: () => void;
}

export default function EmailVerificationPending({
  email,
  onBackToLogin
}: EmailVerificationPendingProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-md border border-border max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light rounded-full mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-dark mb-2">Verify Your Email</h1>
          <p className="text-dark-muted text-sm">
            We've sent a verification link to your email address
          </p>
        </div>

        {/* Email Display */}
        <div className="p-4 bg-primary-light border border-primary rounded-lg mb-6">
          <p className="text-sm text-dark-muted mb-1">Verification email sent to:</p>
          <p className="text-sm font-mono text-dark break-all font-semibold">{email}</p>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800">
              Please check your email inbox (and spam folder) for the verification link.
            </p>
          </div>
        </div>

        {/* Resend Component */}
        <ResendVerificationEmail
          email={email}
          onSuccess={() => {
            // Optional: Show toast notification
          }}
          onError={() => {
            // Optional: Handle error
          }}
        />

        {/* Back to Login */}
        <button
          onClick={onBackToLogin}
          className="w-full mt-6 px-4 py-2 border border-border text-dark-muted font-medium rounded-lg hover:bg-background transition"
        >
          Back to Login
        </button>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-xs text-dark-muted mb-2">
            The verification link will expire in 24 hours
          </p>
          <p className="text-xs text-dark-muted">
            Need help? <a href="#" className="text-primary hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
