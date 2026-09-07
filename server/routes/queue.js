import { Router } from 'express';
import { store } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/queue - Get all queue entries
router.get('/', authenticateToken, (req, res) => {
  try {
    res.json({ success: true, data: store.getQueue() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/queue - Add to queue
router.post('/', authenticateToken, (req, res) => {
  try {
    const entry = store.addToQueue(req.body);
    store.logAccess('ADD_TO_QUEUE', req.user.id, { patientId: req.body.patientId });
    res.status(201).json({ success: true, data: entry, message: 'Added to queue' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/queue/:id - Update queue entry
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const updated = store.updateQueueEntry(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Queue entry not found' });
    res.json({ success: true, data: updated, message: 'Queue updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/queue/:id - Remove from queue
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const removed = store.removeFromQueue(req.params.id);
    if (!removed) return res.status(404).json({ success: false, message: 'Queue entry not found' });
    res.json({ success: true, message: 'Removed from queue' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;