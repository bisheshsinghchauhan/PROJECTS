// ═══════════════════════════════════════════════════════════════════════════
// RAKSHAK Healthcare - Backend API Server
// Node.js + Express.js + JWT Auth + RESTful API
// ═══════════════════════════════════════════════════════════════════════════

import express from 'express';
import cors from 'cors';

// Routes
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import queueRoutes from './routes/queue.js';
import ambulanceRoutes from './routes/ambulance.js';
import analyticsRoutes from './routes/analytics.js';
import doctorRoutes from './routes/doctors.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'], credentials: true }));
app.use(express.json({ limit: '10mb' })); // 10mb for report images

// Request logger (shows API activity)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.url.startsWith('/api')) {
      console.log(`  ${req.method} ${req.url} → ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// ── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/ambulance', ambulanceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/doctors', doctorRoutes);

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'RAKSHAK Healthcare API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth (register, login, staff-login)',
      patients: '/api/patients (CRUD + reports)',
      queue: '/api/queue (add, update, remove)',
      ambulance: '/api/ambulance (call, track)',
      analytics: '/api/analytics (stats, logs)',
      doctors: '/api/doctors (list, get)',
    },
  });
});

// ── 404 Handler ────────────────────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── Error Handler ──────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start Server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════════╗');
  console.log('  ║   🏥 RAKSHAK Healthcare API Server          ║');
  console.log('  ╠══════════════════════════════════════════════╣');
  console.log(`  ║   Running on: http://localhost:${PORT}            ║`);
  console.log(`  ║   Health:     http://localhost:${PORT}/api/health    ║`);
  console.log('  ║   Status:     ✅ Ready                       ║');
  console.log('  ╚══════════════════════════════════════════════╝');
  console.log('');
  console.log('  API Routes:');
  console.log('    POST   /api/auth/register      - Patient signup');
  console.log('    POST   /api/auth/login          - Patient login');
  console.log('    POST   /api/auth/staff-login    - Staff login (JWT)');
  console.log('    GET    /api/patients            - List patients');
  console.log('    POST   /api/patients/:id/reports- Add report');
  console.log('    GET    /api/queue               - Queue list');
  console.log('    POST   /api/queue               - Join queue');
  console.log('    POST   /api/ambulance           - Call ambulance');
  console.log('    GET    /api/analytics           - Dashboard stats');
  console.log('    GET    /api/doctors             - Doctor list');
  console.log('');
});