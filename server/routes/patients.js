import { Router } from 'express';
import { store } from '../data/store.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/patients - Get all patients (staff only)
router.get('/', authenticateToken, requireRole('doctor', 'nurse', 'receptionist', 'admin'), (req, res) => {
  try {
    const patients = store.getPatients().map(({ password, ...p }) => p);
    res.json({ success: true, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/patients/mine - Get current patient's own data
router.get('/mine', authenticateToken, (req, res) => {
  try {
    const patient = store.getPatientById(req.user.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    const { password, ...data } = patient;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/patients/:id
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const patient = store.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    const { password, ...data } = patient;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/patients/:id - Update patient
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const updated = store.updatePatient(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Patient not found' });
    const { password, ...data } = updated;
    res.json({ success: true, data, message: 'Patient updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/patients/:id/reports - Add report to patient
router.post('/:id/reports', authenticateToken, requireRole('doctor', 'nurse'), (req, res) => {
  try {
    const report = store.addReport(req.params.id, req.body);
    if (!report) return res.status(404).json({ success: false, message: 'Patient not found' });
    store.logAccess('ADD_REPORT', req.user.id, { patientId: req.params.id });
    res.status(201).json({ success: true, data: report, message: 'Report added' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/patients/search/:phone - Search by phone
router.get('/search/:phone', authenticateToken, (req, res) => {
  try {
    const patient = store.getPatientByPhone(req.params.phone);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    const { password, ...data } = patient;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;