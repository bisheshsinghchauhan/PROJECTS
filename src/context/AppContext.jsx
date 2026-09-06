import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage, generateId } from '../utils/storage';
import { initializeMockData, SAMPLE_DOCTORS, TRIAGE_CATEGORIES } from '../data/mockData';

const AppContext = createContext(null);
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [patients, setPatients] = useState([]);
  const [queue, setQueue] = useState([]);
  const [ambulanceCalls, setAmbulanceCalls] = useState([]);

  useEffect(() => {
    initializeMockData();
    setPatients(storage.get('patients') || []);
    setQueue(storage.get('queue') || []);
    setAmbulanceCalls(storage.get('ambulance_calls') || []);
    const savedUser = storage.get('current_user');
    const savedRole = storage.get('user_role');
    if (savedUser) { setCurrentUser(savedUser); setUserRole(savedRole); }
  }, []);

  const savePatients = useCallback((data) => {
    setPatients(data);
    storage.set('patients', data);
    // Also update currentUser if it matches a patient in the updated list
    const updated = data.find(p => p.id === currentUser?.id);
    if (updated) {
      setCurrentUser(updated);
      storage.set('current_user', updated);
    }
  }, [currentUser?.id]);
  const saveQueue = useCallback((data) => { setQueue(data); storage.set('queue', data); }, []);
  const saveAmbulanceCalls = useCallback((data) => { setAmbulanceCalls(data); storage.set('ambulance_calls', data); }, []);

  const loginPatient = (phone, password) => {
    const patient = patients.find(p => p.phone === phone && p.password === password);
    if (patient) {
      setCurrentUser(patient); setUserRole('patient');
      storage.set('current_user', patient); storage.set('user_role', 'patient');
      return { success: true, patient };
    }
    return { success: false, error: 'Invalid phone number or password' };
  };

  const registerPatient = (data) => {
    const exists = patients.find(p => p.phone === data.phone);
    if (exists) return { success: false, error: 'Phone number already registered' };
    const newPatient = { ...data, id: generateId(), reports: [], appointments: [], registeredAt: new Date().toISOString() };
    const updated = [...patients, newPatient];
    savePatients(updated);
    setCurrentUser(newPatient); setUserRole('patient');
    storage.set('current_user', newPatient); storage.set('user_role', 'patient');
    return { success: true, patient: newPatient };
  };

  const loginStaff = (code, role) => {
    const configs = {
      doctor: { code: 'DOC123', user: { ...SAMPLE_DOCTORS[0], role: 'doctor' } },
      receptionist: { code: 'REC123', user: { id: 'rec1', name: 'Receptionist', role: 'receptionist' } },
      nurse: { code: 'NRS123', user: { id: 'nrs1', name: 'Nurse Meena', role: 'nurse' } },
      admin: { code: 'ADM123', user: { id: 'adm1', name: 'Admin', role: 'admin' } },
    };
    const config = configs[role];
    if (config && code === config.code) {
      setCurrentUser(config.user); setUserRole(role);
      storage.set('current_user', config.user); storage.set('user_role', role);
      return { success: true };
    }
    return { success: false, error: 'Invalid access code' };
  };

  const logout = () => {
    setCurrentUser(null); setUserRole(null);
    storage.remove('current_user'); storage.remove('user_role');
  };

  const getPatientByPhone = (phone) => patients.find(p => p.phone === phone);
  const getPatientById = (id) => patients.find(p => p.id === id);

  const updatePatientReports = (patientId, report) => {
    const updated = patients.map(p => {
      if (p.id === patientId) {
        return { ...p, reports: [...(p.reports || []), { ...report, id: generateId(), date: new Date().toISOString() }] };
      }
      return p;
    });
    savePatients(updated);
    if (currentUser?.id === patientId) {
      const updatedPatient = updated.find(p => p.id === patientId);
      setCurrentUser(updatedPatient);
      storage.set('current_user', updatedPatient);
    }
  };

  const addToQueue = (entry) => {
    const newEntry = {
      ...entry, id: generateId(),
      position: queue.filter(q => q.status === 'waiting' && q.doctorId === entry.doctorId).length + 1,
      status: 'waiting', checkInTime: new Date().toISOString(),
    };
    const updated = [...queue, newEntry];
    saveQueue(updated);
    return newEntry;
  };

  const updateQueueEntry = (id, updates) => {
    const updated = queue.map(q => q.id === id ? { ...q, ...updates } : q);
    saveQueue(updated);
  };

  const removeFromQueue = (id) => { saveQueue(queue.filter(q => q.id !== id)); };

  const callAmbulance = (data) => {
    const newCall = { ...data, id: generateId(), status: 'dispatched', calledAt: new Date().toISOString() };
    saveAmbulanceCalls([...ambulanceCalls, newCall]);
    return newCall;
  };

  const updateAmbulanceCall = (id, updates) => {
    saveAmbulanceCalls(ambulanceCalls.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const getAnalytics = () => {
    const totalPatients = patients.length;
    const totalReports = patients.reduce((sum, p) => sum + (p.reports?.length || 0), 0);
    const todayAppointments = patients.reduce((sum, p) => sum + (p.appointments?.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length || 0), 0);
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
    currentUser, userRole, patients, queue, ambulanceCalls,
    loginPatient, registerPatient, loginStaff, logout,
    getPatientByPhone, getPatientById, updatePatientReports,
    addToQueue, updateQueueEntry, removeFromQueue,
    callAmbulance, updateAmbulanceCall, getAnalytics, savePatients,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;