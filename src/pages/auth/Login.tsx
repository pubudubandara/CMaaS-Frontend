import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Get the intended destination from state, or default to dashboard
  const from = location.state?.from?.pathname || '/app/dashboard';

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
              <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-dark">Sign In</h1>
          <p className="text-sm text-dark-muted">Welcome back to SchemaFlow</p>
        </div>
        
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
        
        <div className="mt-4 text-center">
          <p className="text-sm text-dark-muted">
            Don't have an account? <a href="/register" className="text-primary hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}