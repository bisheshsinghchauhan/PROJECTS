import { Router } from 'express';
import { store } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/ambulance - Get all ambulance calls
router.get('/', authenticateToken, (req, res) => {
  try {
    res.json({ success: true, data: store.getAmbulanceCalls() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/ambulance - Call ambulance
router.post('/', authenticateToken, (req, res) => {
  try {
    const call = store.createAmbulanceCall(req.body);
    store.logAccess('AMBULANCE_CALL', req.user.id, { type: req.body.type, location: req.body.location });
    res.status(201).json({ success: true, data: call, message: 'Ambulance dispatched' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/ambulance/:id - Update ambulance call status
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const updated = store.updateAmbulanceCall(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Ambulance call not found' });
    res.json({ success: true, data: updated, message: 'Ambulance call updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;