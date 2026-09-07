import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { initializeMockData, SAMPLE_DOCTORS, TRIAGE_CATEGORIES } from '../data/mockData';
import api from '../utils/api';

const AppContext = createContext(null);
export const useApp = () => {
  const c = useContext(AppContext);
  if (!c) throw new Error('useApp must be used within AppProvider');
  return c;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [patients, setPatients] = useState([]);
  const [queue, setQueue] = useState([]);
  const [ambulanceCalls, setAmbulanceCalls] = useState([]);
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const r = await fetch('/api/health');
        const d = await r.json();
        if (d.success) { setBackendReady(true); await loadAllData(); }
      } catch {
        setBackendReady(false); initializeMockData();
        setPatients(storage.get('patients') || []);
        setQueue(storage.get('queue') || []);
        setAmbulanceCalls(storage.get('ambulance_calls') || []);
      }
      const su = storage.get('current_user');
      const sr = storage.get('user_role');
      if (su) { setCurrentUser(su); setUserRole(sr); }
    };
    check();
  }, []);

  const loadAllData = async () => {
    try {
      const [pd, qd, ad] = await Promise.all([
        api.getPatients().catch(() => []),
        api.getQueue().catch(() => []),
        api.getAmbulanceCalls().catch(() => []),
      ]);
      setPatients(pd || []); setQueue(qd || []); setAmbulanceCalls(ad || []);
    } catch {}
  };

  const savePatients = useCallback((data) => {
    setPatients(data); storage.set('patients', data);
    const u = data.find(p => p.id === currentUser?.id);
    if (u) { setCurrentUser(u); storage.set('current_user', u); }
  }, [currentUser?.id]);

  const loginPatient = async (phone, password) => {
    if (backendReady) {
      try {
        const r = await api.loginPatient(phone, password);
        if (r.success) { setCurrentUser(r.data.patient); setUserRole('patient');
          storage.set('current_user', r.data.patient); storage.set('user_role', 'patient');
          await loadAllData(); return { success: true, patient: r.data.patient }; }
        return { success: false, error: r.message };
      } catch (e) { return { success: false, error: e.message }; }
    }
    const pt = patients.find(p => p.phone === phone && p.password === password);
    if (pt) { setCurrentUser(pt); setUserRole('patient');
      storage.set('current_user', pt); storage.set('user_role', 'patient');
      return { success: true, patient: pt }; }
    return { success: false, error: 'Invalid phone number or password' };
  };

  const registerPatient = async (data) => {
    if (backendReady) {
      try {
        const r = await api.registerPatient(data);
        if (r.success) { setCurrentUser(r.data.patient); setUserRole('patient');
          storage.set('current_user', r.data.patient); storage.set('user_role', 'patient');
          await loadAllData(); return { success: true, patient: r.data.patient }; }
        return { success: false, error: r.message };
      } catch (e) { return { success: false, error: e.message }; }
    }
    if (patients.find(p => p.phone === data.phone))
      return { success: false, error: 'Phone number already registered' };
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    const np = { ...data, id, reports: [], appointments: [], registeredAt: new Date().toISOString() };
    savePatients([...patients, np]);
    setCurrentUser(np); setUserRole('patient');
    storage.set('current_user', np); storage.set('user_role', 'patient');
    return { success: true, patient: np };
  };

  const loginStaff = async (code, role) => {
    if (backendReady) {
      try {
        const r = await api.loginStaff(code, role);
        if (r.success) { setCurrentUser(r.data.user); setUserRole(role);
          storage.set('current_user', r.data.user); storage.set('user_role', role);
          await loadAllData(); return { success: true }; }
        return { success: false, error: r.message };
      } catch (e) { return { success: false, error: e.message }; }
    }
    const cfg = {
      doctor: { code: 'DOC123', user: { ...SAMPLE_DOCTORS[0], role: 'doctor' } },
      receptionist: { code: 'REC123', user: { id: 'rec1', name: 'Receptionist', role: 'receptionist' } },
      nurse: { code: 'NRS123', user: { id: 'nrs1', name: 'Nurse Meena', role: 'nurse' } },
      admin: { code: 'ADM123', user: { id: 'adm1', name: 'Admin', role: 'admin' } },
    };
    const c = cfg[role];
    if (c && code === c.code) { setCurrentUser(c.user); setUserRole(role);
      storage.set('current_user', c.user); storage.set('user_role', role); return { success: true }; }
    return { success: false, error: 'Invalid access code' };
  };

  const logout = () => { setCurrentUser(null); setUserRole(null);
    storage.remove('current_user'); storage.remove('user_role'); api.logout(); };
  const getPatientByPhone = (phone) => patients.find(p => p.phone === phone);
  const getPatientById = (id) => patients.find(p => p.id === id);

  const updatePatientReports = async (patientId, report) => {
    if (backendReady) { try { await api.addReport(patientId, report); await loadAllData(); return; } catch {} }
    const updated = patients.map(pt => {
      if (pt.id === patientId) return { ...pt, reports: [...(pt.reports || []),
        { ...report, id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9), date: new Date().toISOString() }] };
      return pt;
    });
    savePatients(updated);
    if (currentUser?.id === patientId) { const u = updated.find(pt => pt.id === patientId); setCurrentUser(u); storage.set('current_user', u); }
  };

  const addToQueue = async (entry) => {
    if (backendReady) { try { const r = await api.addToQueue(entry); await loadAllData(); return r; } catch {} }
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    const ne = { ...entry, id, position: queue.filter(q => q.status === 'waiting' && q.doctorId === entry.doctorId).length + 1, status: 'waiting', checkInTime: new Date().toISOString() };
    const up = [...queue, ne]; setQueue(up); storage.set('queue', up); return ne;
  };

  const updateQueueEntry = async (id, updates) => {
    if (backendReady) { try { await api.updateQueueEntry(id, updates); await loadAllData(); return; } catch {} }
    setQueue(queue.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeFromQueue = async (id) => {
    if (backendReady) { try { await api.removeFromQueue(id); await loadAllData(); return; } catch {} }
    setQueue(queue.filter(q => q.id !== id));
  };

  const callAmbulance = async (data) => {
    if (backendReady) { try { const r = await api.callAmbulance(data); await loadAllData(); return r; } catch {} }
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    const nc = { ...data, id, status: 'dispatched', calledAt: new Date().toISOString() };
    setAmbulanceCalls([...ambulanceCalls, nc]); return nc;
  };

  const updateAmbulanceCall = async (id, updates) => {
    if (backendReady) { try { await api.updateAmbulanceCall(id, updates); await loadAllData(); return; } catch {} }
    setAmbulanceCalls(ambulanceCalls.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const getAnalytics = () => {
    const totalPatients = patients.length;
    const totalReports = patients.reduce((s, p) => s + (p.reports?.length || 0), 0);
    const todayAppointments = patients.reduce((s, p) => s + (p.appointments?.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length || 0), 0);
    const waitingInQueue = queue.filter(q => q.status === 'waiting').length;
    const ambulanceDispatched = ambulanceCalls.filter(c => c.status === 'dispatched').length;
    const completedToday = queue.filter(q => q.status === 'completed').length;
    const triageCounts = {};
    TRIAGE_CATEGORIES.forEach(t => { triageCounts[t.id] = queue.filter(q => q.triageLevel === t.id).length; });
    const doctorStats = SAMPLE_DOCTORS.map(d => ({ name: d.name, specialty: d.specialty, patients: queue.filter(q => q.doctorId === d.id).length }));
    const monthlyData = [
      { name: 'Jun', patients: 78, appointments: 52, revenue: 35000 },
      { name: 'Jul', patients: 95, appointments: 68, revenue: 42000 },
      { name: 'Aug', patients: 110, appointments: 82, revenue: 51000 },
      { name: 'Sep', patients: 88, appointments: 65, revenue: 38000 },
      { name: 'Oct', patients: 125, appointments: 95, revenue: 58000 },
      { name: 'Nov', patients: totalPatients || 92, appointments: todayAppointments * 30 || 72, revenue: 45000 },
    ];
    return { totalPatients, totalReports, todayAppointments, waitingInQueue, ambulanceDispatched, completedToday, triageCounts, doctorStats, monthlyData };
  };

  const value = {
    currentUser, userRole, patients, queue, ambulanceCalls, backendReady,
    loginPatient, registerPatient, loginStaff, logout,
    getPatientByPhone, getPatientById, updatePatientReports,
    addToQueue, updateQueueEntry, removeFromQueue,
    callAmbulance, updateAmbulanceCall, getAnalytics, savePatients,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export default AppContext;
