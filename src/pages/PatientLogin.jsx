import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Heart, ArrowLeft, LogIn, Phone, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientLogin() {
  const { loginPatient } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!phone || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const result = await loginPatient(phone, password);
      if (result && result.success) {
        toast.success('Welcome back!');
        navigate('/patient/dashboard');
      } else {
        setError(result?.error || 'Invalid phone number or password');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium transition">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Login</h1>
              <p className="text-sm text-gray-500">Access your health records</p>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter mobile number" className="input-field pl-12" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="input-field pl-12" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50">
              <LogIn className="w-5 h-5" /> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">New to RAKSHAK?</p>
            <Link to="/patient/register" className="text-red-600 font-semibold hover:text-red-700 transition text-sm">Create an account</Link>
          </div>

          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2 font-semibold uppercase">Demo Credentials</p>
            <p className="text-xs text-gray-600">Phone: 9876543210</p>
            <p className="text-xs text-gray-600">Password: patient123</p>
          </div>
        </div>
      </div>
    </div>
  );
}