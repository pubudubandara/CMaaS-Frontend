import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../lib/auth';
import { CheckCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);

  // Get the intended destination from state, or default to dashboard
  const from = location.state?.from?.pathname || '/app/dashboard';
  const emailVerified = location.state?.emailVerified;

  // Show verified message if coming from email verification
  useEffect(() => {
    if (emailVerified) {
      setShowVerifiedMessage(true);
      // Hide message after 5 seconds
      const timer = setTimeout(() => setShowVerifiedMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [emailVerified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (error) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-surface p-8 rounded shadow-md border border-border w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-lg">
              <a href="/">
                <img src="/logo.png" alt="Logo" className="w-8 h-8" />
              </a>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-dark">Sign In</h1>
          <p className="text-sm text-dark-muted">Welcome back to SchemaFlow</p>
        </div>

        {/* Email Verified Success Message */}
        {showVerifiedMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Email verified successfully!</p>
              <p className="text-xs text-green-700">You can now log in to your account.</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full border-border rounded focus:ring-primary focus:border-primary text-sm p-2 border"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full border-border rounded focus:ring-primary focus:border-primary text-sm p-2 border"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-dark-muted">
            <a href="/forgot-password" className="text-primary hover:underline">Forgot your password?</a>
          </p>
          <p className="text-sm text-dark-muted">
            Don't have an account? <a href="/register" className="text-primary hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}