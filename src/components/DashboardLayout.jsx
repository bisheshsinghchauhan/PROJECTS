import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogOut, Home, RotateCcw } from 'lucide-react';

export default function DashboardLayout({ title, subtitle, user, role, roleName, gradient, children, actions }) {
  const { logout } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className={`bg-gradient-to-r ${gradient} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black">R+</div>
              <div>
                <h1 className="font-bold text-lg leading-tight">{title}</h1>
                <p className="text-white/70 text-xs">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <div className="hidden sm:block text-right mr-2">
                <p className="text-sm font-semibold">{user?.name}</p>
                <span className="text-xs text-white/70">{roleName}</span>
              </div>
              <button onClick={() => navigate('/')} title="Home" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                <Home className="w-5 h-5" />
              </button>
              <button onClick={logout} title="Logout" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</div>
    </div>
  );
}