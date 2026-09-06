import React from 'react';
import { Calendar, Stethoscope, Clock, ChevronLeft } from 'lucide-react';
import { SAMPLE_DOCTORS } from '../../data/mockData';

export default function AppointmentsTab({ appointments = [], onBack }) {
  const sorted = [...appointments].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcoming = sorted.filter(a => a.status === 'scheduled');
  const past = sorted.filter(a => a.status === 'completed' || a.status === 'cancelled');
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">My Appointments</h2>
        <button onClick={onBack} className="text-gray-500 text-sm hover:text-gray-700 font-medium flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Back</button>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Calendar className="w-5 h-5 text-red-600" /> Upcoming</h3>
          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.map(a => {
                const doctor = SAMPLE_DOCTORS.find(d => d.id === a.doctorId);
                return (
                  <div key={a.id} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"><Stethoscope className="w-6 h-6 text-red-600" /></div>
                      <div>
                        <p className="font-semibold text-gray-900">{a.doctorName}</p>
                        <p className="text-xs text-gray-500">{a.specialty}</p>
                        <p className="text-xs text-gray-400 mt-1">{a.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{new Date(a.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500 flex items-center justify-end gap-1"><Clock className="w-3 h-3" /> {a.time}</p>
                      <span className="badge-blue mt-1">{a.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 text-gray-400">No upcoming appointments</div>}
        </div>
        {past.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Past Appointments</h3>
            <div className="space-y-3">
              {past.map(a => (
                <div key={a.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                  <div><p className="font-semibold text-gray-700 text-sm">{a.doctorName}</p><p className="text-xs text-gray-500">{new Date(a.date).toLocaleDateString()} • {a.time}</p></div>
                  <span className="badge-gray">{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}