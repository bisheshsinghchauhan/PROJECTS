import { Router } from 'express';
import { store } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/doctors - Get all doctors (public for booking)
router.get('/', (req, res) => {
  try {
    res.json({ success: true, data: store.getDoctors() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/doctors/:id
router.get('/:id', (req, res) => {
  try {
    const doctor = store.getDoctorById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;