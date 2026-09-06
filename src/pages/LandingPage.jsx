import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Heart, Stethoscope, Users, BarChart3, Siren, Clock, FileCheck, Phone } from 'lucide-react';

const features = [
  { icon: Clock, title: 'Smart Queue', desc: 'Real-time wait time estimates', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: FileCheck, title: 'Digital Reports', desc: 'Store & access all reports', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Siren, title: 'Ambulance Service', desc: 'Quick emergency response', color: 'text-red-600', bg: 'bg-red-50' },
  { icon: Stethoscope, title: 'Expert Doctors', desc: 'Consult with specialists', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Shield, title: 'Secure Access', desc: 'Role-based locked sections', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: BarChart3, title: 'Analytics', desc: 'Track clinic performance', color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

const roles = [
  { title: 'Patient', desc: 'Book appointments, view reports', link: '/patient/login', icon: Heart, color: 'from-red-500 to-red-600', hover: 'hover:from-red-600 hover:to-red-700', open: true },
  { title: 'Doctor', desc: 'Access patient data, triage', link: '/staff/login/doctor', icon: Stethoscope, color: 'from-blue-500 to-blue-600', hover: 'hover:from-blue-600 hover:to-blue-700', open: false },
  { title: 'Receptionist', desc: 'Manage appointments & queue', link: '/staff/login/receptionist', icon: Users, color: 'from-emerald-500 to-emerald-600', hover: 'hover:from-emerald-600 hover:to-emerald-700', open: false },
  { title: 'Nurse', desc: 'Triage assistance, vitals', link: '/staff/login/nurse', icon: Heart, color: 'from-purple-500 to-purple-600', hover: 'hover:from-purple-600 hover:to-purple-700', open: false },
  { title: 'Admin', desc: 'Analytics & management', link: '/staff/login/admin', icon: BarChart3, color: 'from-amber-500 to-amber-600', hover: 'hover:from-amber-600 hover:to-amber-700', open: false },
];

export default function LandingPage() {
  const { currentUser, userRole, logout } = useApp();
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    if (currentUser && userRole === role.title.toLowerCase()) {
      navigate('/' + role.title.toLowerCase() + '/dashboard');
    } else {
      navigate(role.link);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
          <div className="absolute top-40 right-20 w-48 h-48 border border-white rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-red-600 font-black text-xl">R+</span>
              </div>
              <span className="text-white font-bold text-2xl">RAKSHAK</span>
            </div>
            {currentUser ? (
              <div className="flex items-center gap-4">
                <span className="text-white/80 text-sm">Welcome, {currentUser.name}</span>
                <button onClick={logout} className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/patient/login" className="text-white/80 hover:text-white text-sm font-medium transition">Login</Link>
                <Link to="/patient/register" className="bg-white text-red-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 transition shadow">Get Started</Link>
              </div>
            )}
          </nav>
          <div className="text-center max-w-3xl mx-auto pb-20">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white/90 px-4 py-2 rounded-full text-sm mb-6">
              <Shield className="w-4 h-4" /> Smart Healthcare Management
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
              Your Health, <br /><span className="text-red-200">Protected & Managed</span>
            </h1>
            <p className="text-xl text-white/80 mb-10">Book appointments instantly, skip the wait, access all reports, and get emergency help.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/patient/register" className="bg-white text-red-700 font-bold py-4 px-8 rounded-xl hover:bg-red-50 transition shadow-xl text-lg">Register as Patient</Link>
              <button onClick={() => document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white/10 backdrop-blur text-white font-bold py-4 px-8 rounded-xl border border-white/20 hover:bg-white/20 transition text-lg">Staff Access</button>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">One complete platform for patients, doctors, and healthcare management</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className={`w-14 h-14 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="access" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Secure Access Portal</h2>
            <p className="text-gray-500 text-lg">Select your role. Staff sections require access codes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {roles.map((role, i) => (
              <button key={i} onClick={() => handleRoleClick(role)}
                className={`bg-gradient-to-br ${role.color} ${role.hover} text-white p-6 rounded-2xl text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group`}>
                <role.icon className="w-10 h-10 mb-4 opacity-90 group-hover:opacity-100 transition" />
                <h3 className="font-bold text-lg mb-1">{role.title}</h3>
                <p className="text-white/70 text-sm mb-4">{role.desc}</p>
                <div className="flex items-center gap-1 text-xs font-medium text-white/60">
                  {role.open ? <span className="flex items-center gap-1 text-white/80"><span className="w-2 h-2 bg-green-400 rounded-full" /> Open Access</span>
                    : <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Code Protected</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-red-600 to-red-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Siren className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Medical Emergency?</h3>
              <p className="text-white/80">Call ambulance instantly — Basic, Advanced, ICU, or Air</p>
            </div>
          </div>
          <Link to="/patient/login" className="bg-white text-red-700 font-bold py-3 px-8 rounded-xl hover:bg-red-50 transition shadow-lg flex items-center gap-2">
            <Phone className="w-5 h-5" /> Call Ambulance
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">R+</span>
              </div>
              <span className="text-white font-bold text-lg">RAKSHAK</span>
            </div>
            <p className="text-sm">© 2026 RAKSHAK Healthcare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
