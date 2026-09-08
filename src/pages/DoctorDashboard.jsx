import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DashboardLayout from '../components/DashboardLayout';
import CameraCapture from '../components/CameraCapture';
import { Phone, Search, FileText, Camera, Stethoscope, Activity, Clock, User, PhoneCall, ShieldAlert, Users, FileImage, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { TRIAGE_CATEGORIES, REPORT_TYPES } from '../data/mockData';

export default function DoctorDashboard() {
  const { currentUser, userRole, getPatientByPhone, queue, updatePatientReports, patients, updateQueueEntry, removeFromQueue } = useApp();
  const [view, setView] = useState('queue');
  const [showCamera, setShowCamera] = useState(false);
  const [activePatient, setActivePatient] = useState(null);
  const [reportData, setReportData] = useState({ type: '', title: '', notes: '' });

  if (!currentUser || userRole !== 'doctor') return <Navigate to="/staff/login/doctor" replace />;

  const openPatient = (phone) => {
    const p = getPatientByPhone(phone);
    if (p) { setActivePatient(p); setView('patient'); }
    else toast.error('Patient not found');
  };

  const handleReportUpload = (imageData) => {
    if (!activePatient) return;
    updatePatientReports(activePatient.id, {
      type: reportData.type || 'Blood Report',
      title: reportData.title || `${reportData.type || 'Report'} - ${new Date().toLocaleDateString()}`,
      notes: reportData.notes || 'Added after consultation',
      imageData,
      doctor: currentUser.name,
    });
    // Refresh active patient from updated context
    const updated = getPatientByPhone(activePatient.phone);
    if (updated) setActivePatient(updated);
    toast.success('Report added to patient records');
    setShowCamera(false);
    setReportData({ type: '', title: '', notes: '' });
  };

  return (
    <DashboardLayout title="Doctor Dashboard" subtitle="Manage patients, triage, and reports" user={currentUser} roleName="Doctor" gradient="from-blue-600 to-blue-700">
      <div className="flex flex-wrap gap-2 mb-6">
        <TabBtn active={view === 'queue'} onClick={() => setView('queue')} icon={<Users className="w-4 h-4" />} label="Live Queue" />
        <TabBtn active={view === 'search'} onClick={() => setView('search')} icon={<Search className="w-4 h-4" />} label="Find Patient" />
        <TabBtn active={view === 'triage'} onClick={() => setView('triage')} icon={<ShieldAlert className="w-4 h-4" />} label="Triage" />
        <TabBtn active={view === 'patient'} onClick={() => setView('patient')} icon={<User className="w-4 h-4" />} label="Patient View" />
      </div>

      {view === 'queue' && <QueueView queue={queue} onCall={openPatient} onComplete={id => { updateQueueEntry(id, { status: 'completed' }); toast.success('Consultation completed'); }} onRemove={id => { removeFromQueue(id); toast.success('Patient removed from queue'); }} />}
      {view === 'search' && <SearchPatient onFound={openPatient} patients={patients} />}
      {view === 'triage' && <TriageView patients={patients} queue={queue} onSelect={openPatient} />}
      {view === 'patient' && activePatient && (
        <PatientView patient={activePatient} onUpload={() => setShowCamera(true)} reportData={reportData} setReportData={setReportData} onBack={() => setView('queue')} />
      )}
      {view === 'patient' && !activePatient && <div className="text-center py-12 text-gray-400">Select a patient first</div>}

      {showCamera && activePatient && (
        <CameraCapture onClose={() => setShowCamera(false)} onCapture={handleReportUpload} title="Capture Report for Patient" />
      )}
    </DashboardLayout>
  );
}

function TabBtn({ active, onClick, icon, label }) {
  return <button onClick={onClick} className={`nav-link ${active ? 'nav-link-active' : 'nav-link-inactive'}`}>{icon}{label}</button>;
}

function QueueView({ queue, onCall, onComplete, onRemove }) {
  const waiting = queue.filter(q => q.status === 'waiting');
  if (waiting.length === 0) return <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 text-gray-400">No patients in queue</div>;
  return (
    <div className="space-y-4">
      <h2 className="section-title">Live Patient Queue</h2>
      <p className="section-subtitle">Patients waiting to be seen</p>
      {waiting.map(q => (
        <div key={q.id} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-700 text-lg">#{q.position}</div>
            <div>
              <p className="font-semibold text-gray-900">{q.patientName}</p>
              <p className="text-sm text-gray-500">{q.doctorName}</p>
              <div className="flex gap-2 mt-1">{q.symptoms?.map(s => <span key={s} className="badge-gray">{s}</span>)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TriageBadge level={q.triageLevel} />
            <button onClick={() => onCall(q.patientId)} className="btn-blue text-sm flex items-center gap-2 py-2 px-4"><PhoneCall className="w-4 h-4" /> View Patient</button>
            <button title="Mark complete" onClick={() => onComplete(q.id)} className="btn-green text-sm py-2 px-3"><CheckCircle2 className="w-4 h-4" /> Complete</button>
            <button title="Remove from queue" onClick={() => onRemove(q.id)} className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold">×</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TriageBadge({ level }) {
  const cat = TRIAGE_CATEGORIES.find(c => c.id === level);
  if (!cat) return null;
  return <span className={`badge ${cat.bgColor} ${cat.textColor}`}>{cat.icon} {cat.name}</span>;
}

function SearchPatient({ onFound, patients }) {
  const [phone, setPhone] = useState('');
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="section-title mb-4">Find Patient by Phone</h2>
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex gap-3">
          <div className="relative flex-1"><Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" /><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter patient mobile number" className="input-field pl-12" /></div>
          <button onClick={() => onFound(phone)} className="btn-primary">Search</button>
        </div>
        <div className="border-t border-gray-100 my-6" />
        <p className="text-sm text-gray-500 mb-4 font-semibold">Registered Patients</p>
        <div className="space-y-2">
          {patients.map(p => (
            <button key={p.id} onClick={() => onFound(p.phone)} className="w-full bg-gray-50 hover:bg-gray-100 rounded-xl p-3 text-left transition flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">{p.name?.[0]}</div>
                <div><p className="font-semibold text-gray-900 text-sm">{p.name}</p><p className="text-xs text-gray-500">{p.phone}</p></div>
              </div>
              <span className="text-xs text-gray-400">{p.reports?.length || 0} reports</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TriageView({ patients, queue, onSelect }) {
  const { updateQueueEntry } = useApp();
  const getQueueEntry = (patientId) => queue.find(q => q.patientId === patientId && q.status !== 'completed');
  return (
    <div>
      <h2 className="section-title mb-1">Triage Assistant</h2>
      <p className="section-subtitle">Patient conditions and urgency levels</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {TRIAGE_CATEGORIES.map(cat => (
          <div key={cat.id} className={`${cat.bgColor} rounded-2xl p-4 border ${cat.borderColor}`}>
            <div className="flex items-center gap-2 mb-2"><span className="text-xl">{cat.icon}</span><span className={`font-bold ${cat.textColor} text-sm`}>{cat.name}</span></div>
            <p className="text-xs text-gray-600 mb-2">{cat.timeFrame}</p>
            <p className="text-xs text-gray-500 line-clamp-2">{cat.description}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Assign Triage Level</h3>
        <div className="space-y-2">
          {patients.map(p => {
            const entry = getQueueEntry(p.id);
            return (
              <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div><p className="font-semibold text-gray-900 text-sm">{p.name}</p><p className="text-xs text-gray-500">{p.phone}</p></div>
                <div className="flex items-center gap-2">
                  {entry ? (
                    <select
                      className="input-field text-xs py-2"
                      value={entry.triageLevel || ''}
                      onChange={e => { updateQueueEntry(entry.id, { triageLevel: Number(e.target.value) }); toast.success(`Triage level updated for ${p.name}`); }}
                    >
                      <option value="">Select Level</option>
                      {TRIAGE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                  ) : <span className="text-xs text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2">Not in queue</span>}
                  <button onClick={() => onSelect(p.phone)} className="btn-secondary text-xs py-2">View</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


function PatientView({ patient, onUpload, reportData, setReportData, onBack }) {
  const reports = patient.reports || [];
  const [selectedReport, setSelectedReport] = useState(null);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title">{patient.name}</h2>
          <p className="text-sm text-gray-500">{patient.phone} • {patient.age} yrs • {patient.gender} {patient.bloodGroup && <span className="badge-red ml-2">Blood: {patient.bloodGroup}</span>}</p>
        </div>
        <button onClick={onBack} className="btn-secondary text-sm py-2.5 px-4">← Back</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Medical Reports</h3>
            {reports.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reports.map(r => (
                  <button key={r.id} onClick={() => setSelectedReport(r)} className="bg-gray-50 rounded-xl p-4 text-left hover:bg-gray-100 transition">
                    <div className="flex items-center justify-between mb-2"><span className="badge-blue">{r.type}</span></div>
                    <p className="font-semibold text-gray-900 text-sm">{r.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(r.date).toLocaleDateString()} • {r.doctor}</p>
                    {r.imageData && <img src={r.imageData} alt={r.title} className="w-full h-20 object-cover rounded-lg mt-2" />}
                    {r.notes && <p className="text-xs text-gray-500 mt-1">{r.notes}</p>}
                  </button>
                ))}
              </div>
            ) : <p className="text-gray-400 text-sm">No reports yet</p>}
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Add New Report</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div><label className="label-field">Report Type</label>
                <select value={reportData.type} onChange={e => setReportData({ ...reportData, type: e.target.value })} className="input-field">
                  <option value="">Select type</option>
                  {REPORT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="label-field">Report Title</label><input type="text" value={reportData.title} onChange={e => setReportData({ ...reportData, title: e.target.value })} placeholder="e.g., Complete Blood Count" className="input-field" /></div>
            </div>
            <div className="mb-4"><label className="label-field">Notes / Findings</label><textarea value={reportData.notes} onChange={e => setReportData({ ...reportData, notes: e.target.value })} rows="3" placeholder="Add clinical notes" className="input-field resize-none" /></div>
            <button onClick={onUpload} className="btn-primary flex items-center gap-2"><Camera className="w-5 h-5" /> Capture Report Image</button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-600" /> Patient Info</h3>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500">Email:</span> <span className="text-gray-900 font-medium">{patient.email || '-'}</span></div>
              <div><span className="text-gray-500">Address:</span> <span className="text-gray-900 font-medium">{patient.address || '-'}</span></div>
              <div><span className="text-gray-500">Emergency:</span> <span className="text-gray-900 font-medium">{patient.emergencyContact || '-'}</span></div>
            </div>
            <div className="mt-4"><button className="btn-green w-full text-sm flex items-center justify-center gap-2"><Phone className="w-4 h-4" /> Call: {patient.phone}</button></div>
          </div>
          {selectedReport && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">Report Preview</h3>
              {selectedReport.imageData && <img src={selectedReport.imageData} alt={selectedReport.title} className="w-full rounded-lg mb-3" />}
              <p className="font-semibold text-gray-900 text-sm">{selectedReport.title}</p>
              <p className="text-xs text-gray-500">{selectedReport.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

