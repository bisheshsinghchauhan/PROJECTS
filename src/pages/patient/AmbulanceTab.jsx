import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Siren, Clock, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { AMBULANCE_TYPES } from '../../data/mockData';

export default function AmbulanceTab({ patient, onBack }) {
  const { callAmbulance } = useApp();
  const [selectedType, setSelectedType] = useState(null);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [confirming, setConfirming] = useState(false);

  const handleCall = () => {
    if (!selectedType || !location) { toast.error('Please select type and enter location'); return; }
    setConfirming(true);
  };

  const confirmCall = () => {
    const type = AMBULANCE_TYPES.find(t => t.id === selectedType);
    callAmbulance({ patientName: patient.name, patientPhone: patient.phone, type: selectedType, typeName: type.name, icon: type.icon, location, notes });
    toast.success('Ambulance called! Your emergency vehicle is on its way.');
    setConfirming(false); setSelectedType(null); setLocation(''); setNotes(''); onBack();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">Call Ambulance</h2>
        <button onClick={onBack} className="btn-secondary text-sm py-2.5 px-4">← Back</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <label className="label-field">Select Ambulance Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AMBULANCE_TYPES.map(t => (
              <button key={t.id} onClick={() => setSelectedType(t.id)}
                className={`p-5 rounded-xl border-2 text-left transition-all ${selectedType === t.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${selectedType === t.id ? 'bg-red-600' : 'bg-gray-100'} rounded-xl flex items-center justify-center text-2xl transition`}>{t.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between"><h4 className="font-bold text-gray-900">{t.name}</h4><span className="text-sm font-bold text-red-600">{t.price}</span></div>
                    <p className="text-xs text-gray-500 mt-1">{t.description}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> ETA: {t.estimatedTime}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div><label className="label-field">Pickup Location</label><div className="relative"><MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" /><input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter your location" className="input-field pl-12" /></div></div>
          <div><label className="label-field">Notes for EMS Team</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows="3" placeholder="Patient status, symptoms..." className="input-field resize-none" /></div>
          <button onClick={handleCall} className={`btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg ${selectedType ? 'siren-pulse' : ''}`}>
            <Siren className="w-6 h-6" /> {selectedType ? 'Call Ambulance Now' : 'Select Type to Continue'}
          </button>
        </div>
      </div>
      {confirming && selectedType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto bg-red-600 rounded-full flex items-center justify-center mb-4 siren-pulse"><Siren className="w-12 h-12 text-white" /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Ambulance Call</h3>
              <p className="text-sm text-gray-500">Emergency vehicle will be dispatched immediately</p>
            </div>
            <div className="space-y-3 bg-gray-50 rounded-xl p-4 mb-6 text-sm">
              <div><span className="text-gray-500">Patient:</span> <span className="font-semibold text-gray-900">{patient.name}</span></div>
              <div><span className="text-gray-500">Ambulance:</span> <span className="font-semibold text-gray-900">{AMBULANCE_TYPES.find(t => t.id === selectedType)?.name}</span></div>
              <div><span className="text-gray-500">Location:</span> <span className="font-semibold text-gray-900">{location}</span></div>
              <div><span className="text-gray-500">Phone:</span> <span className="font-semibold text-gray-900">{patient.phone}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirming(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
              <button onClick={confirmCall} className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"><Phone className="w-4 h-4" /> Confirm Call</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}