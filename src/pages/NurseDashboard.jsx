import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DashboardLayout from '../components/DashboardLayout';
import { ShieldAlert, Activity, Users, ClipboardList, CheckCircle } from 'lucide-react';
import { TRIAGE_CATEGORIES, TRIAGE_QUESTIONS } from '../data/mockData';
import toast from 'react-hot-toast';

export default function NurseDashboard() {
  const { currentUser, userRole, patients, queue } = useApp();
  const [view, setView] = useState('triage');

  if (!currentUser || userRole !== 'nurse') return <Navigate to="/staff/login/nurse" replace />;

  return (
    <DashboardLayout title="Nurse Dashboard" subtitle="Triage assistance and patient intake" user={currentUser} roleName="Nurse" gradient="from-purple-600 to-purple-700">
      <div className="flex flex-wrap gap-2 mb-6">
        <TabBtn active={view === 'triage'} onClick={() => setView('triage')} icon={<ShieldAlert className="w-4 h-4" />} label="Triage Station" />
        <TabBtn active={view === 'patients'} onClick={() => setView('patients')} icon={<Users className="w-4 h-4" />} label="Patients" />
      </div>
      {view === 'triage' && <TriageStation patients={patients} queue={queue} />}
      {view === 'patients' && <PatientList patients={patients} />}
    </DashboardLayout>
  );
}

function TabBtn({ active, onClick, icon, label }) {
  return <button onClick={onClick} className={`nav-link ${active ? 'nav-link-active' : 'nav-link-inactive'}`}>{icon}{label}</button>;
}

function TriageStation({ patients, queue }) {
  const { updateQueueEntry } = useApp();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const waitingPatients = queue.filter(q => q.status === 'waiting');

  const calculateScore = () => {
    let total = 0;
    Object.values(answers).forEach(v => total += Number(v));
    let category;
    if (total <= 3) category = TRIAGE_CATEGORIES.find(c => c.id === 5);
    else if (total <= 6) category = TRIAGE_CATEGORIES.find(c => c.id === 4);
    else if (total <= 9) category = TRIAGE_CATEGORIES.find(c => c.id === 3);
    else if (total <= 12) category = TRIAGE_CATEGORIES.find(c => c.id === 2);
    else category = TRIAGE_CATEGORIES.find(c => c.id === 1);
    setScore({ total, category });
  };

  const submitTriage = () => {
    if (!score || !selectedPatient) return;
    updateQueueEntry(selectedPatient.id, { triageLevel: score.category.id });
    toast.success(`Triage level ${score.category.id} (${score.category.name}) saved for ${selectedPatient.patientName}`);
    setSubmitted(true);
    setTimeout(() => {
      setSelectedPatient(null); setAnswers({}); setScore(null); setSubmitted(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 className="section-title">Triage Assessment</h2>
        <p className="section-subtitle mb-4">Select a patient to begin triage</p>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2 max-h-64 overflow-y-auto">
          {waitingPatients.map(q => (
            <button key={q.id} onClick={() => { setSelectedPatient(q); setAnswers({}); setScore(null); }}
              className={`w-full text-left p-3 rounded-xl transition ${selectedPatient?.id === q.id ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <p className="font-semibold text-gray-900 text-sm">{q.patientName}</p>
              <p className="text-xs text-gray-500">{q.symptoms?.join(', ')}</p>
            </button>
          ))}
          {waitingPatients.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No patients waiting</p>}
        </div>
      </div>
      <div>
        {selectedPatient ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Triage Questions: {selectedPatient.patientName}</h3>
            <div className="space-y-4">
              {TRIAGE_QUESTIONS.map(q => (
                <div key={q.id} className="bg-gray-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-800 text-sm mb-2">{q.question}</p>
                  {q.type === 'scale' ? (
                    <div className="flex items-center gap-2">
                      <input type="range" min="0" max="10" value={answers[q.id] || 0}
                        onChange={e => {
                          const val = Number(e.target.value);
                          const range = q.ranges.find(r => val >= r.min && val <= r.max);
                          setAnswers({ ...answers, [q.id]: range ? range.weight : 0 });
                        }}
                        className="flex-1 accent-purple-600" />
                      <span className="text-sm font-bold text-purple-700 w-8 text-center">{answers[q.id] || 0}</span>
                    </div>
                  ) : q.options.map((opt, idx) => (
                    <label key={opt} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${answers[q.id] === q.weights[idx] ? 'bg-purple-100 border border-purple-300' : 'hover:bg-white border border-transparent'}`}>
                      <input type="radio" name={`q-${q.id}`} checked={answers[q.id] === q.weights[idx]} onChange={() => setAnswers({ ...answers, [q.id]: q.weights[idx] })} className="accent-purple-600" />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
            <button onClick={calculateScore} className="btn-primary w-full mt-4 flex items-center justify-center gap-2"><ShieldAlert className="w-5 h-5" /> Calculate Triage Level</button>
            {score && (
              <div className={`mt-4 ${score.category.bgColor} rounded-2xl p-5 border ${score.category.borderColor}`}>
                <div className="flex items-center gap-2 mb-2"><span className="text-2xl">{score.category.icon}</span><span className={`font-bold ${score.category.textColor} text-lg`}>{score.category.name}</span></div>
                <p className="text-sm text-gray-600">Score: {score.total} / 15</p>
                <p className="text-sm text-gray-500">{score.category.description}</p>
                <p className="text-xs text-gray-500 mt-1">Target: {score.category.timeFrame}</p>
                {submitted ? (
                  <div className="mt-3 bg-emerald-100 text-emerald-700 rounded-xl p-3 text-sm font-semibold flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Triage Saved Successfully</div>
                ) : (
                  <button onClick={submitTriage} className="btn-green w-full mt-3 flex items-center justify-center gap-2"><CheckCircle className="w-5 h-5" /> Submit Triage Assessment</button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <ShieldAlert className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Select a patient to begin triage</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PatientList({ patients }) {
  return (
    <div>
      <h2 className="section-title mb-4">Registered Patients</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map(p => (
          <div key={p.id} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700">{p.name?.[0]}</div>
              <div><p className="font-semibold text-gray-900">{p.name}</p><p className="text-xs text-gray-500">{p.phone}</p></div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Age: {p.age} • Gender: {p.gender} • Blood: {p.bloodGroup}</p>
              <p>Reports: {p.reports?.length || 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

