import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import PatientLogin from './pages/PatientLogin';
import PatientRegister from './pages/PatientRegister';
import PatientDashboard from './pages/PatientDashboard';
import StaffLogin from './pages/StaffLogin';
import DoctorDashboard from './pages/DoctorDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import NurseDashboard from './pages/NurseDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-slate-50">
          <Toaster position="top-center" toastOptions={{ duration: 3000, style: { borderRadius: '12px', padding: '16px', fontSize: '14px' } }} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/patient/login" element={<PatientLogin />} />
            <Route path="/patient/register" element={<PatientRegister />} />
            <Route path="/patient/dashboard/*" element={<PatientDashboard />} />
            <Route path="/staff/login/:role" element={<StaffLogin />} />
            <Route path="/doctor/dashboard/*" element={<DoctorDashboard />} />
            <Route path="/receptionist/dashboard/*" element={<ReceptionistDashboard />} />
            <Route path="/nurse/dashboard/*" element={<NurseDashboard />} />
            <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}