import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DashboardLayout from '../components/DashboardLayout';
import { Users, Calendar, Search, UserPlus, PhoneCall, CheckCircle2, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { TRIAGE_CATEGORIES } from '../data/mockData';

export default function ReceptionistDashboard() {
  const { currentUser, userRole, queue, updateQueueEntry, removeFromQueue, patients } = useApp();
  const [view, setView] = useState('queue');

  if (!currentUser || userRole !== 'receptionist') return <Navigate to="/staff/login/receptionist" replace />;

  const handleCheckIn = (id) => updateQueueEntry(id, { status: 'in_progress' });
  const handleComplete = (id) => { updateQueueEntry(id, { status: 'completed' }); toast.success('Patient completed'); };

  return (
    <DashboardLayout title="Receptionist Dashboard" subtitle="Manage patients, queue, and appointments" user={currentUser} roleName="Receptionist" gradient="from-emerald-600 to-emerald-700">
      <div className="flex flex-wrap gap-2 mb-6">
        <TabBtn active={view === 'queue'} onClick={() => setView('queue')} icon={<Users className="w-4 h-4" />} label="Queue Management" />
        <TabBtn active={view === 'appointments'} onClick={() => setView('appointments')} icon={<Calendar className="w-4 h-4" />} label="Appointments" />
        <TabBtn active={view === 'register'} onClick={() => setView('register')} icon={<UserPlus className="w-4 h-4" />} label="Register Patient" />
      </div>
      {view === 'queue' && <QueueManagement queue={queue} onCheckIn={handleCheckIn} onComplete={handleComplete} onRemove={removeFromQueue} />}
      {view === 'appointments' && <AppointmentsView patients={patients} />}
      {view === 'register' && <RegisterPatient onDone={() => setView('queue')} />}
    </DashboardLayout>
  );
}

function TabBtn({ active, onClick, icon, label }) {
  return <button onClick={onClick} className={`nav-link ${active ? 'nav-link-active' : 'nav-link-inactive'}`}>{icon}{label}</button>;
}

function QueueManagement({ queue, onCheckIn, onComplete, onRemove }) {
  const waiting = queue.filter(q => q.status === 'waiting');
  const inProgress = queue.filter(q => q.status === 'in_progress');
  const completed = queue.filter(q => q.status === 'completed');
  return (
    <div className="space-y-6">
      <h2 className="section-title">Queue Management</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-amber-50 rounded-2xl p-4 text-center"><p className="text-3xl font-bold text-amber-600">{waiting.length}</p><p className="text-xs text-gray-500 font-medium mt-1">Waiting</p></div>
        <div className="bg-blue-50 rounded-2xl p-4 text-center"><p className="text-3xl font-bold text-blue-600">{inProgress.length}</p><p className="text-xs text-gray-500 font-medium mt-1">In Progress</p></div>
        <div className="bg-emerald-50 rounded-2xl p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{completed.length}</p><p className="text-xs text-gray-500 font-medium mt-1">Completed</p></div>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Waiting Room</h3>
        {waiting.length > 0 ? waiting.map(q => (
          <div key={q.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-400">#{q.position}</span>
              <div><p className="font-semibold text-gray-900">{q.patientName}</p><p className="text-xs text-gray-500">{q.doctorName}</p></div>
            </div>
            <div className="flex gap-2">
              <TriageSelect id={q.id} />
              <button onClick={() => onCheckIn(q.id)} className="btn-blue text-xs py-2 px-3">Start</button>
              <button onClick={() => onRemove(q.id)} className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-semibold">×</button>
            </div>
          </div>
        )) : <div className="bg-gray-50 rounded-2xl p-6 text-center text-gray-400">No patients waiting</div>}
      </div>
      {inProgress.length > 0 && <div><h3 className="font-bold text-gray-900 mb-3">In Consultation</h3>
        {inProgress.map(q => (
          <div key={q.id} className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-900">#{q.position} {q.patientName}</p>
            <button onClick={() => onComplete(q.id)} className="btn-green text-xs py-2 px-3">Complete</button>
          </div>
        ))}
      </div>}
    </div>
  );
}

function TriageSelect({ id }) {
  const { updateQueueEntry } = useApp();
  return (
    <select onChange={e => { updateQueueEntry(id, { triageLevel: Number(e.target.value) }); toast.success('Triage updated'); }}
      defaultValue="" className="input-field text-xs py-2">
      <option value="">Triage</option>
      {TRIAGE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
    </select>
  );
}

function AppointmentsView({ patients }) {
  const allApts = patients.flatMap(p => (p.appointments || []).map(a => ({ ...a, patientName: p.name })));
  return (
    <div>
      <h2 className="section-title mb-4">Today's Appointments</h2>
      {allApts.length > 0 ? (
        <div className="space-y-3">
          {allApts.map(a => (
            <div key={a.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><Calendar className="w-5 h-5 text-emerald-600" /></div>
                <div><p className="font-semibold text-gray-900">{a.patientName}</p><p className="text-xs text-gray-500">{a.doctorName} • {a.specialty}</p></div>
              </div>
              <div className="text-right"><p className="text-sm font-semibold text-gray-700">{a.time}</p><span className={`badge ${a.status === 'scheduled' ? 'badge-blue' : 'badge-green'}`}>{a.status}</span></div>
            </div>
          ))}
        </div>
      ) : <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 text-gray-400">No appointments scheduled</div>}
    </div>
  );
}


function RegisterPatient({ onDone }) {
  const { registerPatient } = useApp();
  const [form, setForm] = useState({ name: '', phone: '', email: '', age: '', gender: 'Male', bloodGroup: 'O+', address: '', emergencyContact: '', password: 'patient123' });
  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async () => {
    if (!form.name || !form.phone) { toast.error('Name and phone required'); return; }
    const result = await registerPatient(form);
    if (result && result.success) { toast.success('Patient registered!'); onDone(); }
    else toast.error(result?.error || 'Registration failed');
  };
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="section-title mb-4">Register New Patient</h2>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="label-field">Full Name *</label><input name="name" value={form.name} onChange={update} className="input-field" /></div>
          <div><label className="label-field">Phone *</label><input name="phone" value={form.phone} onChange={update} className="input-field" /></div>
          <div><label className="label-field">Email</label><input name="email" value={form.email} onChange={update} className="input-field" /></div>
          <div><label className="label-field">Age</label><input type="number" name="age" value={form.age} onChange={update} className="input-field" /></div>
          <div><label className="label-field">Gender</label>
            <select name="gender" value={form.gender} onChange={update} className="input-field"><option>Male</option><option>Female</option><option>Other</option></select>
          </div>
          <div><label className="label-field">Blood Group</label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={update} className="input-field"><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select>
          </div>
          <div className="sm:col-span-2"><label className="label-field">Address</label><input name="address" value={form.address} onChange={update} className="input-field" /></div>
          <div><label className="label-field">Emergency Contact</label><input name="emergencyContact" value={form.emergencyContact} onChange={update} className="input-field" /></div>
        </div>
        <button onClick={handleSubmit} className="btn-primary w-full flex items-center justify-center gap-2"><UserPlus className="w-5 h-5" /> Register Patient</button>
      </div>
    </div>
  );
}

