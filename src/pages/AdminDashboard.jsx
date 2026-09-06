import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DashboardLayout from '../components/DashboardLayout';
import { BarChart3, Users, Calendar, Activity, TrendingUp, FileText, Stethoscope, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, userRole, patients, queue, ambulanceCalls } = useApp();
  const [view, setView] = useState('overview');

  if (!currentUser || userRole !== 'admin') return <Navigate to="/staff/login/admin" replace />;

  const completedCount = queue.filter(q => q.status === 'completed').length;
  const waitingCount = queue.filter(q => q.status === 'waiting').length;
  const totalDoctors = [...new Set(queue.map(q => q.doctorName))].length;
  const urgentCount = queue.filter(q => q.triageLevel <= 2).length;

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Analytics and clinic overview" user={currentUser} roleName="Admin" gradient="from-rose-600 to-rose-700">
      <div className="flex flex-wrap gap-2 mb-6">
        <TabBtn active={view === 'overview'} onClick={() => setView('overview')} icon={<BarChart3 className="w-4 h-4" />} label="Overview" />
        <TabBtn active={view === 'patients'} onClick={() => setView('patients')} icon={<Users className="w-4 h-4" />} label="Patients" />
        <TabBtn active={view === 'performance'} onClick={() => setView('performance')} icon={<TrendingUp className="w-4 h-4" />} label="Performance" />
      </div>
      {view === 'overview' && <OverviewView patients={patients} queue={queue} ambulanceCalls={ambulanceCalls} completedCount={completedCount} waitingCount={waitingCount} totalDoctors={totalDoctors} urgentCount={urgentCount} />}
      {view === 'patients' && <PatientsView patients={patients} />}
      {view === 'performance' && <PerformanceView queue={queue} patients={patients} ambulanceCalls={ambulanceCalls} completedCount={completedCount} />}
    </DashboardLayout>
  );
}

function OverviewView({ patients, queue, ambulanceCalls, completedCount, waitingCount, totalDoctors, urgentCount }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Users className="w-6 h-6 text-blue-600" />} label="Total Patients" value={patients.length} bg="bg-blue-50" />
        <StatCard icon={<Clock className="w-6 h-6 text-amber-600" />} label="Waiting Now" value={waitingCount} bg="bg-amber-50" />
        <StatCard icon={<Activity className="w-6 h-6 text-emerald-600" />} label="Completed" value={completedCount} bg="bg-emerald-50" />
        <StatCard icon={<Stethoscope className="w-6 h-6 text-purple-600" />} label="Active Doctors" value={totalDoctors} bg="bg-purple-50" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Queue Activity</h3>
          <div className="space-y-3">
            {[
              { label: 'Waiting', count: waitingCount, color: 'bg-amber-500' },
              { label: 'Completed', count: completedCount, color: 'bg-emerald-500' },
              { label: 'Urgent Cases', count: urgentCount, color: 'bg-red-500' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.count / (queue.length || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-6 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Ambulance Calls</h3>
          <div className="space-y-2">
            {ambulanceCalls.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div><p className="font-semibold text-gray-900 text-sm">{c.patientName}</p><p className="text-xs text-gray-500">{c.type} • {c.location}</p></div>
                <span className={`badge ${c.status === 'dispatched' ? 'badge-amber' : 'badge-green'}`}>{c.status}</span>
              </div>
            ))}
            {ambulanceCalls.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No ambulance calls</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function PatientsView({ patients }) {
  return (
    <div>
      <h2 className="section-title mb-4">All Registered Patients</h2>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100">
            <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Patient</th>
            <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Phone</th>
            <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Age/Gender</th>
            <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Reports</th>
          </tr></thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center font-bold text-rose-700 text-xs">{p.name?.[0]}</div><span className="font-semibold text-gray-900 text-sm">{p.name}</span></div></td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.age}/{p.gender}</td>
                <td className="px-6 py-4"><span className="badge-blue">{p.reports?.length || 0}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }) {
  return <button onClick={onClick} className={`nav-link ${active ? 'nav-link-active' : 'nav-link-inactive'}`}>{icon}{label}</button>;
}

function StatCard({ icon, label, value, bg }) {
  return <div className={`${bg} rounded-2xl p-5`}><div className="flex items-center justify-between mb-3">{icon}</div><p className="text-2xl font-bold text-gray-900">{value}</p><p className="text-sm text-gray-600 mt-1">{label}</p></div>;
}
function PerformanceView({ queue, patients, ambulanceCalls, completedCount }) {
  const totalReports = patients.reduce((acc, p) => acc + (p.reports?.length || 0), 0);
  const totalQueue = queue.length;
  const completionRate = totalQueue > 0 ? Math.round((completedCount / totalQueue) * 100) : 0;
  const doctors = [...new Set(queue.map(q => q.doctorName))];
  return (
    <div>
      <h2 className="section-title mb-4">Clinic Performance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Calendar className="w-6 h-6 text-blue-600" />} label="Total Queue" value={totalQueue} bg="bg-blue-50" />
        <StatCard icon={<Activity className="w-6 h-6 text-emerald-600" />} label="Completion Rate" value={`${completionRate}%`} bg="bg-emerald-50" />
        <StatCard icon={<FileText className="w-6 h-6 text-purple-600" />} label="Total Reports" value={totalReports} bg="bg-purple-50" />
        <StatCard icon={<TrendingUp className="w-6 h-6 text-rose-600" />} label="Ambulance Calls" value={ambulanceCalls.length} bg="bg-rose-50" />
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Patients per Doctor</h3>
        <div className="space-y-3">
          {doctors.map(doc => {
            const count = queue.filter(q => q.doctorName === doc).length;
            return (
              <div key={doc} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">{doc}</span>
                <div className="flex items-center gap-2">
                  <div className="w-40 bg-gray-100 rounded-full h-2"><div className="bg-rose-500 h-2 rounded-full" style={{ width: `${(count / (totalQueue || 1)) * 100}%` }} /></div>
                  <span className="text-sm font-bold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
