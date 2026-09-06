import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';

export default function CameraCapture({ onCapture, onClose, title = 'Capture Report' }) {
  const [streaming, setStreaming] = useState(false);
  const [captured, setCaptured] = useState(null);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (err) {
      setError('Camera not available. Please use file upload instead.');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.7);
    setCaptured(imageData);
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStreaming(false);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target.result;
      setCaptured(data);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  React.useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleSave = () => {
    if (captured) onCapture(captured);
    else setError('Please capture or upload an image first');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-gray-900">{title}</h3>
          </div>
          <button onClick={() => { stopCamera(); onClose(); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-5">
          {captured ? (
            <div className="space-y-4">
              <img src={captured} alt="Captured" className="w-full rounded-xl max-h-72 object-contain bg-gray-100" />
              <div className="flex gap-3">
                <button onClick={() => setCaptured(null)} className="btn-secondary flex-1 text-sm">Retake</button>
                <button onClick={handleSave} className="btn-primary flex-1 text-sm">Save Report</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {streaming ? (
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <video ref={videoRef} autoPlay playsInline className="w-full max-h-72 object-cover" />
                  <button onClick={capturePhoto} className="absolute bottom-4 left-1/2 -translate-x-1/2 btn-primary flex items-center gap-2 text-sm">
                    <Camera className="w-4 h-4" /> Capture
                  </button>
                </div>
              ) : (
                <>
                  {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
                  <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                      <Camera className="w-10 h-10 text-red-600" />
                    </div>
                    <p className="text-gray-500 text-sm mb-6 text-center">Capture a photo of your medical report<br />or upload from your device</p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full px-6">
                      <button onClick={startCamera} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-2.5">
                        <Camera className="w-4 h-4" /> Use Camera
                      </button>
                      <label className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm py-2.5 cursor-pointer">
                        <Upload className="w-4 h-4" /> Upload File
                        <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}