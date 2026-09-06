import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientRegister() {
  const { registerPatient } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', age: '', gender: '', bloodGroup: '', address: '', emergencyContact: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.phone || !form.password) { setError('Name, phone and password are required'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.phone.length < 10) { setError('Please enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = registerPatient(form);
      if (result.success) { toast.success('Registration successful!'); navigate('/patient/dashboard'); }
      else setError(result.error);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium transition"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg"><UserPlus className="w-8 h-8 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Registration</h1>
              <p className="text-sm text-gray-500">Create your account to book appointments & manage health</p>
            </div>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className="label-field">Full Name *</label><input type="text" name="name" value={form.name} onChange={update} placeholder="John Doe" className="input-field" /></div>
              <div><label className="label-field">Mobile Number *</label><input type="tel" name="phone" value={form.phone} onChange={update} placeholder="10-digit mobile" className="input-field" /></div>
              <div><label className="label-field">Email</label><input type="email" name="email" value={form.email} onChange={update} placeholder="you@email.com" className="input-field" /></div>
              <div><label className="label-field">Age</label><input type="number" name="age" value={form.age} onChange={update} placeholder="Age" className="input-field" /></div>
              <div><label className="label-field">Gender</label>
                <select name="gender" value={form.gender} onChange={update} className="input-field">
                  <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div><label className="label-field">Blood Group</label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={update} className="input-field">
                  <option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                </select>
              </div>
              <div className="md:col-span-2"><label className="label-field">Address</label><input type="text" name="address" value={form.address} onChange={update} placeholder="Street, City, State" className="input-field" /></div>
              <div><label className="label-field">Emergency Contact</label><input type="tel" name="emergencyContact" value={form.emergencyContact} onChange={update} placeholder="Emergency contact" className="input-field" /></div>
              <div><label className="label-field">Password *</label><input type="password" name="password" value={form.password} onChange={update} placeholder="Create a password" className="input-field" /></div>
              <div><label className="label-field">Confirm Password *</label><input type="password" name="confirmPassword" value={form.confirmPassword} onChange={update} placeholder="Confirm password" className="input-field" /></div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50">
              <UserPlus className="w-5 h-5" /> {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">Already have an account?</p>
            <Link to="/patient/login" className="text-red-600 font-semibold hover:text-red-700 transition text-sm">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}