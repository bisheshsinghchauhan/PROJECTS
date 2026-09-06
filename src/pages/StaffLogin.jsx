import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Shield, Stethoscope, Users, Heart, BarChart3, Lock, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

const roleConfig = {
  doctor: { title: 'Doctor', icon: Stethoscope, gradient: 'from-blue-500 to-blue-700', code: 'DOC123', desc: 'Access patient data, triage, manage queue' },
  receptionist: { title: 'Receptionist', icon: Users, gradient: 'from-emerald-500 to-emerald-700', code: 'REC123', desc: 'Manage appointments, patient registration, queue' },
  nurse: { title: 'Nurse', icon: Heart, gradient: 'from-purple-500 to-purple-700', code: 'NRS123', desc: 'Triage assistance, patient vitals' },
  admin: { title: 'Admin', icon: BarChart3, gradient: 'from-amber-500 to-amber-700', code: 'ADM123', desc: 'Analytics, management, full overview' },
};

export default function StaffLogin() {
  const { role } = useParams();
  const { loginStaff } = useApp();
  const navigate = useNavigate();
  const config = roleConfig[role] || roleConfig.doctor;

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!code) { setError('Please enter the access code'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = loginStaff(code, role);
      if (result.success) {
        toast.success(`Welcome ${config.title}!`);
        navigate(`/${role}/dashboard`);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 600);
  };

  const Icon = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5`} />
      <div className="w-full max-w-md relative">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium transition"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{config.title} Access</h1>
                <p className="text-sm text-gray-500">{config.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" /> Secured
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"><Shield className="w-4 h-4" /> {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 relative">
              <div className="absolute -top-3 left-6 bg-white px-2 py-0.5 rounded-full shadow-sm">
                <div className="flex items-center gap-1 text-gray-500 text-xs font-semibold"><Lock className="w-3 h-3" /> LOCKED SECTION</div>
              </div>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <KeyRound className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Enter Access Code</label>
              <input
                type="password"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter 6-digit access code"
                className="input-field text-center text-xl tracking-widest font-mono"
                autoFocus
              />
              <div className="mt-3 text-center">
                <button type="button" onClick={() => setShowHint(!showHint)} className="text-xs text-gray-400 hover:text-gray-600 transition">
                  {showHint ? `Demo code: ${config.code}` : 'Need the code? Click here'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className={`bg-gradient-to-r ${config.gradient} text-white font-semibold py-3.5 px-6 rounded-xl w-full transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}>
              <Lock className="w-5 h-5" /> {loading ? 'Verifying...' : 'Unlock Access'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}