import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from '../../lib/axios';
import { isAxiosError } from 'axios';

type VerificationStatus = 'idle' | 'loading' | 'success' | 'error' | 'resending';

interface VerificationError {
  message: string;
  code?: string;
}

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [error, setError] = useState<VerificationError | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  // Auto-verify on component mount if params are present
  useEffect(() => {
    if (!email || !token) {
      setError({ message: 'Invalid verification link. Missing email or token.' });
      setStatus('error');
      return;
    }

    const verify = async () => {
      if (!email || !token) {
        setError({ message: 'Email or token is missing' });
        setStatus('error');
        return;
      }

      setStatus('loading');
      setError(null);

      try {
        await axios.post('/Auth/verify-email', {
          email,
          token
        });

        setStatus('success');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { state: { emailVerified: true } });
        }, 3000);
      } catch (err) {
        setStatus('error');
        if (isAxiosError(err)) {
          setError({
            message: err.response?.data?.message || 'Email verification failed. Please try again.',
            code: err.response?.data?.code
          });
        } else {
          setError({ message: 'An unexpected error occurred. Please try again.' });
        }
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (!email) {
      setError({ message: 'Email is missing' });
      return;
    }

    setStatus('resending');
    setResendMessage(null);
    setError(null);

    try {
      await axios.post('/Auth/resend-verification-email', {
        email
      });

      setResendMessage('Verification email has been sent. Please check your inbox.');
      setResendCooldown(60); // 60 seconds cooldown
      setStatus('idle');
    } catch (err) {
      setStatus('idle');
      if (isAxiosError(err)) {
        setError({
          message: err.response?.data?.message || 'Failed to resend verification email.',
          code: err.response?.data?.code
        });
      } else {
        setError({ message: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-md border border-border max-w-md w-full p-8 text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light rounded-full mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-dark mb-2">Email Verification</h1>
          <p className="text-dark-muted">Verifying your email address</p>
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-light rounded-full mb-4 animate-spin">
              <Loader className="w-6 h-6 text-primary" />
            </div>
            <p className="text-dark-muted mb-2">Verifying your email...</p>
            <p className="text-sm text-dark-muted">{email}</p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-green-600 font-semibold mb-2">Email Verified Successfully!</p>
            <p className="text-dark-muted text-sm mb-4">Your email has been verified. Redirecting to login...</p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-red-600 font-semibold mb-2">Verification Failed</p>
            <p className="text-dark-muted text-sm mb-6">{error?.message}</p>
          </div>
        )}

        {/* Resend Message */}
        {resendMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{resendMessage}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 mt-8">
          {(status === 'error' || status === 'resending' || (status === 'idle' && !email)) && (
            <>
              <button
                onClick={handleResendVerification}
                disabled={resendCooldown > 0 || status === 'resending'}
                className="w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'resending' ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Email'}
                  </>
                )}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-2 border border-border text-dark-muted font-medium rounded-lg hover:bg-background transition"
              >
                Back to Login
              </button>
            </>
          )}

          {status === 'success' && (
            <button
              onClick={() => navigate('/login')}
              className="w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition"
            >
              Go to Login
            </button>
          )}
        </div>

        {/* Footer */}
        {email && (
          <p className="text-xs text-dark-muted mt-6">
            Verifying: <span className="font-mono text-dark">{email}</span>
          </p>
        )}
      </div>
    </div>
  );
}