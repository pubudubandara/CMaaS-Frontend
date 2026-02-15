import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCompany } from '../../lib/auth';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ organizationName: '', adminName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      await registerCompany(formData);
      // After successful registration, redirect to login
      navigate('/login');
    } catch (error) {
      alert("Registration failed");
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
          <h1 className="text-2xl font-bold text-dark">Create Account</h1>
          <p className="text-sm text-dark-muted">Start building with SchemaFlow today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Organization Name</label>
            <input 
              type="text" 
              required
              className="w-full border-border rounded focus:ring-primary focus:border-primary text-sm p-2 border"
              placeholder="e.g. Acme Corp"
              onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Admin Name</label>
            <input 
              type="text" 
              required
              className="w-full border-border rounded focus:ring-primary focus:border-primary text-sm p-2 border"
              placeholder="e.g. John Doe"
              onChange={(e) => setFormData({...formData, adminName: e.target.value})}
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Confirm Password</label>
            <input 
              type="password" 
              required
              className="w-full border-border rounded focus:ring-primary focus:border-primary text-sm p-2 border"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Get Started'}
          </button>
        </form>
      </div>
    </div>
  );
}