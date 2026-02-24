import { useState } from 'react';
import { Mail, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import axios from '../../lib/axios';

interface ResendVerificationEmailProps {
  email: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function ResendVerificationEmail({
  email,
  onSuccess,
  onError
}: ResendVerificationEmailProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [cooldown, setCooldown] = useState(0);

  // Handle cooldown timer
  const startCooldown = () => {
    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    console.log('🔄 ResendVerificationEmail: Resend clicked for email:', email);
    setStatus('loading');
    setMessage('');

    try {
      console.log('📤 Sending resend request to /api/Auth/resend-verification-email');
      const response = await axios.post('/api/Auth/resend-verification-email', {
        email
      });

      console.log('✅ Resend successful:', response.data);
      setStatus('success');
      setMessage('Verification email sent! Please check your inbox.');
      startCooldown();
      onSuccess?.();

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (err: any) {
      console.error('❌ Resend failed:', err);
      setStatus('error');
      
      // Extract error message from response or use default
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to resend verification email. Please try again.';
      
      console.error('📋 Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: errorMessage
      });
      
      setMessage(errorMessage);
      onError?.(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg flex gap-3 items-start ${
            status === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {status === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className={status === 'success' ? 'text-green-700 text-sm' : 'text-red-700 text-sm'}>
              {message}
            </p>
          </div>
        </div>
      )}

      {/* Email Display */}
      <div className="p-4 bg-background rounded-lg">
        <p className="text-sm text-dark-muted mb-1">Sending to:</p>
        <p className="text-sm font-mono text-dark break-all">{email}</p>
      </div>

      {/* Resend Button */}
      <button
        onClick={handleResend}
        disabled={status === 'loading' || cooldown > 0}
        className={`w-full py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
          cooldown > 0 || status === 'loading'
            ? 'bg-background text-dark-muted cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary-hover active:bg-primary-hover'
        }`}
      >
        {status === 'loading' && <Loader className="w-4 h-4 animate-spin" />}
        {status === 'loading' && 'Sending...'}
        {status !== 'loading' && <Mail className="w-4 h-4" />}
        {status !== 'loading' && (
          cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'
        )}
      </button>
    </div>
  );
}