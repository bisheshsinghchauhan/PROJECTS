// In-memory data store for RAKSHAK Healthcare
import bcrypt from 'bcryptjs';
import { generateId } from '../utils/helpers.js';

const hash = (pw) => bcrypt.hashSync(pw, 10);

const doctors = [
  { id: 'doc1', name: 'Dr. Rajesh Sharma', specialty: 'General Physician', available: true },
  { id: 'doc2', name: 'Dr. Priya Patel', specialty: 'Cardiologist', available: true },
  { id: 'doc3', name: 'Dr. Vikram Singh', specialty: 'Neurologist', available: false },
  { id: 'doc4', name: 'Dr. Anita Desai', specialty: 'Orthopedic', available: true },
  { id: 'doc5', name: 'Dr. Suresh Kumar', specialty: 'Pediatrician', available: true },
];

const seedPatients = [
  {
    id: 'pat1', name: 'Rahul Verma', phone: '9876543210', email: 'rahul@email.com',
    age: 32, gender: 'Male', bloodGroup: 'O+', address: '123 MG Road, Delhi',
    emergencyContact: '9876543211', password: hash('patient123'),
    registeredAt: new Date(Date.now() - 30*24*60*60*1000).toISOString(),
    reports: [
      { id: 'r1', type: 'Blood Report', title: 'Complete Blood Count', date: new Date(Date.now()-15*24*60*60*1000).toISOString(), doctor: 'Dr. Rajesh Sharma', notes: 'Hemoglobin slightly low. Vitamin D deficiency.', imageData: null },
      { id: 'r2', type: 'X-Ray', title: 'Chest X-Ray', date: new Date(Date.now()-10*24*60*60*1000).toISOString(), doctor: 'Dr. Rajesh Sharma', notes: 'No abnormalities detected.', imageData: null },
      { id: 'r3', type: 'MRI Scan', title: 'MRI Brain', date: new Date(Date.now()-5*24*60*60*1000).toISOString(), doctor: 'Dr. Vikram Singh', notes: 'Normal MRI. No lesions.', imageData: null },
    ],
    appointments: [
      { id: 'apt1', patientId:'pat1', doctorId:'doc1', doctorName:'Dr. Rajesh Sharma', specialty:'General Physician', date: new Date().toISOString(), time:'10:00 AM', status:'scheduled', reason:'Follow-up for vitamin deficiency', createdAt: new Date(Date.now()-2*24*60*60*1000).toISOString() }
    ],
  },
  {
    id: 'pat2', name: 'Anita Gupta', phone: '9876543220', email: 'anita@email.com',
    age: 45, gender: 'Female', bloodGroup: 'A+', address: '456 Nehru Nagar, Mumbai',
    emergencyContact: '9876543221', password: hash('patient123'),
    registeredAt: new Date(Date.now() - 60*24*60*60*1000).toISOString(),
    reports: [{ id:'r4', type:'ECG', title:'Resting ECG', date: new Date(Date.now()-20*24*60*60*1000).toISOString(), doctor:'Dr. Priya Patel', notes:'Normal sinus rhythm.', imageData:null }],
    appointments: [],
  },
];

const seedQueue = [
  { id:'q1', patientId:'pat1', patientName:'Rahul Verma', doctorId:'doc1', doctorName:'Dr. Rajesh Sharma', position:1, status:'waiting', triageLevel:4, checkInTime: new Date(Date.now()-30*60*1000).toISOString(), symptoms:['Fever','Cough'] },
  { id:'q2', patientId:'pat2', patientName:'Anita Gupta', doctorId:'doc2', doctorName:'Dr. Priya Patel', position:2, status:'waiting', triageLevel:3, checkInTime: new Date(Date.now()-15*60*1000).toISOString(), symptoms:['Chest Pain'] },
];

const seedAmbulance = [
  { id:'ac1', patientName:'Emergency Caller', patientPhone:'9876543299', type:'als', typeName:'Advanced Life Support', location:'456 Ring Road, Delhi', status:'dispatched', calledAt: new Date(Date.now()-10*60*1000).toISOString(), estimatedArrival:'12 min' },
];
class DataStore {
  constructor() {
    this.patients = [...seedPatients];
    this.queue = [...seedQueue];
    this.ambulanceCalls = [...seedAmbulance];
    this.doctors = [...doctors];
    this.accessLogs = [];
  }

  // Patients
  getPatients() { return this.patients; }
  getPatientById(id) { return this.patients.find(p => p.id === id); }
  getPatientByPhone(phone) { return this.patients.find(p => p.phone === phone); }
  createPatient(data) {
    const p = { ...data, id: generateId(), password: hash(data.password), reports: [], appointments: [], registeredAt: new Date().toISOString() };
    this.patients.push(p);
    return p;
  }
  updatePatient(id, updates) {
    const i = this.patients.findIndex(p => p.id === id);
    if (i === -1) return null;
    this.patients[i] = { ...this.patients[i], ...updates };
    return this.patients[i];
  }
  addReport(patientId, report) {
    const p = this.getPatientById(patientId);
    if (!p) return null;
    const r = { ...report, id: generateId(), date: new Date().toISOString() };
    p.reports.push(r);
    return r;
  }

  // Queue
  getQueue() { return this.queue; }
  addToQueue(entry) {
    const e = { ...entry, id: generateId(), position: this.queue.filter(q => q.status === 'waiting' && q.doctorId === entry.doctorId).length + 1, status: 'waiting', checkInTime: new Date().toISOString() };
    this.queue.push(e);
    return e;
  }
  updateQueueEntry(id, updates) {
    const i = this.queue.findIndex(q => q.id === id);
    if (i === -1) return null;
    this.queue[i] = { ...this.queue[i], ...updates };
    return this.queue[i];
  }
  removeFromQueue(id) {
    const i = this.queue.findIndex(q => q.id === id);
    if (i === -1) return false;
    this.queue.splice(i, 1);
    return true;
  }

  // Ambulance
  getAmbulanceCalls() { return this.ambulanceCalls; }
  createAmbulanceCall(data) {
    const c = { ...data, id: generateId(), status: 'dispatched', calledAt: new Date().toISOString() };
    this.ambulanceCalls.push(c);
    return c;
  }
  updateAmbulanceCall(id, updates) {
    const i = this.ambulanceCalls.findIndex(c => c.id === id);
    if (i === -1) return null;
    this.ambulanceCalls[i] = { ...this.ambulanceCalls[i], ...updates };
    return this.ambulanceCalls[i];
  }

  // Doctors
  getDoctors() { return this.doctors; }
  getDoctorById(id) { return this.doctors.find(d => d.id === id); }

  // Access Logs (audit trail)
  logAccess(action, userId, details = {}) {
    this.accessLogs.push({ id: generateId(), action, userId, details, timestamp: new Date().toISOString() });
  }
  getAccessLogs() { return this.accessLogs; }

  // Analytics
  getAnalytics() {
    const totalPatients = this.patients.length;
    const totalReports = this.patients.reduce((s, p) => s + (p.reports?.length || 0), 0);
    const todayApts = this.patients.reduce((s, p) => s + (p.appointments?.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length || 0), 0);
    const waitingInQueue = this.queue.filter(q => q.status === 'waiting').length;
    const completedToday = this.queue.filter(q => q.status === 'completed').length;
    const totalQueue = this.queue.length;
    const completionRate = totalQueue > 0 ? Math.round((completedToday / totalQueue) * 100) : 0;
    return {
      totalPatients, totalReports, todayAppointments: todayApts,
      waitingInQueue, ambulanceDispatched: this.ambulanceCalls.filter(c => c.status === 'dispatched').length,
      completedToday, completionRate, totalAmbulanceCalls: this.ambulanceCalls.length,
      totalAccessLogs: this.accessLogs.length,
    };
  }
}

export const store = new DataStore();
