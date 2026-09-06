import React, { useState } from 'react';
import { FileText, Camera, Upload } from 'lucide-react';

export default function ReportsTab({ reports, onUpload, onBack }) {
  const [selectedReport, setSelectedReport] = useState(null);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">My Health Reports</h2>
        <div className="flex gap-2">
          <button onClick={onUpload} className="btn-primary text-sm flex items-center gap-2 py-2.5 px-4"><Camera className="w-4 h-4" /> Upload Report</button>
          <button onClick={onBack} className="btn-secondary text-sm py-2.5 px-4">← Back</button>
        </div>
      </div>
      {selectedReport ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div><h3 className="font-bold text-gray-900">{selectedReport.title}</h3><p className="text-sm text-gray-500">{selectedReport.type} • {new Date(selectedReport.date).toLocaleDateString()}</p></div>
            </div>
            <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          {selectedReport.imageData && <img src={selectedReport.imageData} alt={selectedReport.title} className="w-full rounded-xl mb-6 max-h-96 object-contain bg-gray-50" />}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-1">Doctor: {selectedReport.doctor || 'N/A'}</p>
            {selectedReport.notes && <p className="text-sm text-gray-600">{selectedReport.notes}</p>}
          </div>
        </div>
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map(r => (
            <button key={r.id} onClick={() => setSelectedReport(r)} className="bg-white rounded-2xl p-5 border border-gray-100 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between mb-3"><span className="badge-blue">{r.type}</span><FileText className="w-4 h-4 text-gray-300" /></div>
              {r.imageData && <img src={r.imageData} alt={r.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
              <h4 className="font-semibold text-gray-900 mb-1">{r.title}</h4>
              <p className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()}</p>
              {r.notes && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{r.notes}</p>}
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-10 h-10 text-blue-500" /></div>
          <h3 className="font-bold text-gray-900 mb-2">No Reports Yet</h3>
          <p className="text-gray-500 text-sm mb-6">Upload your medical reports to keep them safe and accessible</p>
          <button onClick={onUpload} className="btn-primary inline-flex items-center gap-2 text-sm"><Upload className="w-4 h-4" /> Upload First Report</button>
        </div>
      )}
    </div>
  );
}