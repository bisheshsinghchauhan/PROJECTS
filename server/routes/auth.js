import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { store } from '../data/store.js';
import { generateToken } from '../middleware/auth.js';
import { validatePhone } from '../utils/helpers.js';

const router = Router();

// POST /api/auth/register - Patient Registration
router.post('/register', (req, res) => {
  try {
    const { name, phone, password, email, age, gender, bloodGroup, address, emergencyContact } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone and password are required' });
    }
    if (!validatePhone(phone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number' });
    }
    const existing = store.getPatientByPhone(phone);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Phone number already registered' });
    }

    const patient = store.createPatient({ name, phone, password, email, age: Number(age), gender, bloodGroup, address, emergencyContact });
    const token = generateToken({ id: patient.id, phone: patient.phone, role: 'patient' });

    // Log access
    store.logAccess('REGISTER', patient.id, { name, phone });

    // Return patient without password
    const { password: _, ...patientData } = patient;
    res.status(201).json({ success: true, message: 'Registration successful', data: { patient: patientData, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// POST /api/auth/login - Patient Login
router.post('/login', (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'Phone and password are required' });
    }

    const patient = store.getPatientByPhone(phone);
    if (!patient || !bcrypt.compareSync(password, patient.password)) {
      return res.status(401).json({ success: false, message: 'Invalid phone number or password' });
    }

    const token = generateToken({ id: patient.id, phone: patient.phone, role: 'patient' });
    store.logAccess('LOGIN', patient.id, { phone });

    const { password: _, ...patientData } = patient;
    res.json({ success: true, message: 'Login successful', data: { patient: patientData, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// POST /api/auth/staff-login - Staff Login (Doctor, Nurse, Receptionist, Admin)
router.post('/staff-login', (req, res) => {
  try {
    const { code, role } = req.body;
    if (!code || !role) {
      return res.status(400).json({ success: false, message: 'Access code and role are required' });
    }

    const configs = {
      doctor:       { code: 'DOC123', user: { id: 'doc1', name: 'Dr. Rajesh Sharma', specialty: 'General Physician', role: 'doctor' } },
      receptionist: { code: 'REC123', user: { id: 'rec1', name: 'Receptionist', role: 'receptionist' } },
      nurse:        { code: 'NRS123', user: { id: 'nrs1', name: 'Nurse Meena', role: 'nurse' } },
      admin:        { code: 'ADM123', user: { id: 'adm1', name: 'Admin', role: 'admin' } },
    };

    const config = configs[role];
    if (!config || code !== config.code) {
      return res.status(401).json({ success: false, message: 'Invalid access code' });
    }

    const token = generateToken({ id: config.user.id, role });
    store.logAccess('STAFF_LOGIN', config.user.id, { role });

    res.json({ success: true, message: `${role} login successful`, data: { user: config.user, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// GET /api/auth/me - Get current user from token
router.get('/me', (req, res) => {
  // This is a placeholder; actual auth check done by middleware in main routes
  res.json({ success: true, message: 'Auth endpoint active' });
});

export default router;