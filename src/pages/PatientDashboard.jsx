import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DashboardLayout from '../components/DashboardLayout';
import BookAppointment from './patient/BookAppointment';
import ReportsTab from './patient/ReportsTab';
import AmbulanceTab from './patient/AmbulanceTab';
import AppointmentsTab from './patient/AppointmentsTab';
import CameraCapture from '../components/CameraCapture';
import { Calendar, FileText, Siren, Clock, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientDashboard() {
  const { currentUser, userRole, queue, updatePatientReports } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [showCamera, setShowCamera] = useState(false);

  if (!currentUser || userRole !== 'patient') return <Navigate to="/patient/login" replace />;

  const myQueue = queue.filter(q => q.patientId === currentUser.id && q.status === 'waiting');
  const myPosition = myQueue.length > 0 ? myQueue[0].position : null;
  const waitTime = myPosition ? `${myPosition * 15} min` : null;
  const myReports = currentUser.reports || [];

  const handleReportUpload = (imageData) => {
    updatePatientReports(currentUser.id, { type: 'Patient Upload', title: 'Patient Uploaded Report', notes: 'Uploaded by patient', imageData, doctor: 'Self' });
    toast.success('Report uploaded successfully!');
    setShowCamera(false);
    setActiveTab('reports');
  };

  return (
    <DashboardLayout title="Patient Dashboard" subtitle="Manage your health with RAKSHAK" user={currentUser} roleName="Patient" gradient="from-red-600 to-red-700">
      <ProfileCard user={currentUser} myPosition={myPosition} myReports={myReports} />
      {activeTab === 'home' && <HomeTab setActiveTab={setActiveTab} myPosition={myPosition} waitTime={waitTime} myReports={myReports} />}
      {activeTab === 'book' && <BookAppointment onBack={() => setActiveTab('home')} />}
      {activeTab === 'appointments' && <AppointmentsTab appointments={currentUser.appointments || []} onBack={() => setActiveTab('home')} />}
      {activeTab === 'reports' && <ReportsTab reports={myReports} onUpload={() => setShowCamera(true)} onBack={() => setActiveTab('home')} />}
      {activeTab === 'ambulance' && <AmbulanceTab patient={currentUser} onBack={() => setActiveTab('home')} />}
      {showCamera && (
        <CameraCapture onClose={() => setShowCamera(false)} onCapture={handleReportUpload} title="Upload Health Report" />
      )}
    </DashboardLayout>
  );
}

function ProfileCard({ user, myPosition, myReports }) {
  const myAppointments = user.appointments || [];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.phone} {user.bloodGroup && <span className="badge-red ml-2">Blood: {user.bloodGroup}</span>}</p>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="text-center"><p className="text-2xl font-bold text-red-600">{myReports.length}</p><p className="text-xs text-gray-500">Reports</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-emerald-600">{myAppointments.length}</p><p className="text-xs text-gray-500">Appointments</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-blue-600">{myPosition || '-'}</p><p className="text-xs text-gray-500">Queue Position</p></div>
        </div>
      </div>
    </div>
  );
}

function HomeTab({ setActiveTab, myPosition, waitTime, myReports }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickAction icon="calendar" title="Book Appointment" desc="Schedule a consultation" onClick={() => setActiveTab('book')} />
        <QuickAction icon="calendar2" title="My Appointments" desc="View upcoming visits" onClick={() => setActiveTab('appointments')} />
        <QuickAction icon="reports" title="My Reports" desc="View & upload reports" onClick={() => setActiveTab('reports')} />
        <QuickAction icon="ambulance" title="Call Ambulance" desc="Emergency transport" onClick={() => setActiveTab('ambulance')} />
      </div>
      {myPosition ? (
        <QueueStatus position={myPosition} waitTime={waitTime} />
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-emerald-600" />
            </div>
            <div><h3 className="font-bold text-gray-900">You're Not in Queue</h3><p className="text-sm text-gray-500">Book an appointment to see live queue status</p></div>
          </div>
          <button onClick={() => setActiveTab('book')} className="btn-primary text-sm">Book Now</button>
        </div>
      )}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Recent Health Reports</h3>
          <button onClick={() => setActiveTab('reports')} className="text-red-600 text-sm font-semibold">View All →</button>
        </div>
        {myReports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myReports.slice(0, 3).map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3"><span className="badge-blue">{r.type}</span><FileText className="w-4 h-4 text-gray-300" /></div>
                <h4 className="font-semibold text-gray-900 mb-1">{r.title}</h4>
                <p className="text-xs text-gray-500 mb-2">{new Date(r.date).toLocaleDateString()}</p>
                {r.imageData && <img src={r.imageData} alt={r.title} className="w-full h-24 object-cover rounded-lg mb-2" />}
                {r.notes && <p className="text-xs text-gray-500 line-clamp-2">{r.notes}</p>}
              </div>
            ))}
          </div>
        ) : <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400">No reports yet</div>}
      </div>
    </div>
  );
}

function QuickAction({ icon, title, desc, onClick }) {
  const icons = {
    calendar: <Calendar className="w-6 h-6 text-red-600" />,
    calendar2: <Calendar className="w-6 h-6 text-amber-600" />,
    reports: <FileText className="w-6 h-6 text-blue-600" />,
    ambulance: <Siren className="w-6 h-6 text-emerald-600" />,
  };
  const colors = { calendar: 'bg-red-100', calendar2: 'bg-amber-100', reports: 'bg-blue-100', ambulance: 'bg-emerald-100' };
  return (
    <button onClick={onClick} className="stat-card text-left hover:-translate-y-0.5 transition">
      <div className={`w-12 h-12 ${colors[icon]} rounded-xl flex items-center justify-center mb-3`}>{icons[icon]}</div>
      <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </button>
  );
}

function QueueStatus({ position, waitTime }) {
  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center"><Clock className="w-7 h-7" /></div>
          <div><h3 className="font-bold text-lg">You're in the Queue</h3><p className="text-white/80 text-sm">Position #{position} • Est. wait: {waitTime}</p></div>
        </div>
        <div className="flex gap-8">
          <div className="text-center"><p className="text-3xl font-black">#{position}</p><p className="text-xs text-white/70">Your Turn</p></div>
          <div className="text-center"><p className="text-3xl font-black">{waitTime?.replace(' min','')}</p><p className="text-xs text-white/70">Min Wait</p></div>
        </div>
      </div>
    </div>
  );
}

