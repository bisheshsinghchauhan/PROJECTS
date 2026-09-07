import { Router } from 'express';
import { store } from '../data/store.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/analytics - Get analytics data (admin/doctor)
router.get('/', authenticateToken, requireRole('admin', 'doctor'), (req, res) => {
  try {
    const analytics = store.getAnalytics();
    res.json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/logs - Get access logs (admin only)
router.get('/logs', authenticateToken, requireRole('admin'), (req, res) => {
  try {
    const logs = store.getAccessLogs().reverse(); // newest first
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/doctors - Get doctor stats
router.get('/doctors', authenticateToken, requireRole('admin', 'receptionist'), (req, res) => {
  try {
    const doctors = store.getDoctors();
    const queue = store.getQueue();
    const stats = doctors.map(d => ({
      ...d,
      patientCount: queue.filter(q => q.doctorId === d.id).length,
      waitingCount: queue.filter(q => q.doctorId === d.id && q.status === 'waiting').length,
    }));
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;