import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import { SAMPLE_DOCTORS, COMMON_SYMPTOMS } from '../../data/mockData';

export default function BookAppointment({ onBack }) {
  const { currentUser, addToQueue, patients, savePatients } = useApp();
  const [doctorId, setDoctorId] = useState(SAMPLE_DOCTORS[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);

  const doctor = SAMPLE_DOCTORS.find(d => d.id === doctorId);
  const toggleSymptom = (s) => setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleBook = () => {
    if (!doctorId) { toast.error('Please select a doctor'); return; }
    setLoading(true);
    setTimeout(() => {
      addToQueue({ patientId: currentUser.id, patientName: currentUser.name, doctorId, doctorName: doctor?.name, symptoms });
      const updatedPatients = patients.map(p => p.id === currentUser.id
        ? { ...p, appointments: [...(p.appointments || []), { id: Date.now().toString(), patientId: p.id, doctorId, doctorName: doctor?.name, specialty: doctor?.specialty, date, time, status: 'scheduled', reason, createdAt: new Date().toISOString() }] }
        : p);
      savePatients(updatedPatients);
      toast.success('Appointment booked! You are added to the queue.');
      onBack();
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">Book an Appointment</h2>
        <button onClick={onBack} className="text-gray-500 text-sm hover:text-gray-700 font-medium">← Back</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
          <label className="label-field">Select Doctor</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAMPLE_DOCTORS.map(d => (
              <button key={d.id} onClick={() => setDoctorId(d.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${doctorId === d.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-200'} ${!d.available ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Stethoscope className="w-5 h-5 text-blue-600" /></div>
                  <div><p className="font-semibold text-gray-900 text-sm">{d.name}</p><p className="text-xs text-gray-500">{d.specialty}</p></div>
                </div>
                <div className="mt-2">{d.available ? <span className="badge-green"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1" /> Available</span> : <span className="badge-gray">Not Available</span>}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div><label className="label-field">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" /></div>
          <div><label className="label-field">Time Slot</label>
            <select value={time} onChange={e => setTime(e.target.value)} className="input-field">
              {['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div><label className="label-field">Reason for Visit</label><textarea value={reason} onChange={e => setReason(e.target.value)} rows="3" placeholder="Describe your symptoms or reason" className="input-field resize-none" /></div>
        <div>
          <label className="label-field">Select Symptoms</label>
          <div className="flex flex-wrap gap-2">
            {COMMON_SYMPTOMS.map(s => (
              <button key={s} onClick={() => toggleSymptom(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${symptoms.includes(s) ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
            ))}
          </div>
        </div>
        <button onClick={handleBook} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
          <Calendar className="w-5 h-5" /> {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>
    </div>
  );
}