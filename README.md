# 🏥 RAKSHAK — Smart Healthcare Management System

RAKSHAK is a full-stack healthcare management system that connects **patients**, **doctors**, **nurses**, **receptionists**, and **admins** through a single modern web platform. It handles patient registration, appointment booking, live queue tracking, triage, medical report management (with camera capture), ambulance dispatch, and clinic analytics.

![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Express%20%2B%20Tailwind-red)

---

## ✨ Features

| Role | Capabilities |
|------|--------------|
| **Patient** | Register/login, book appointments, view live queue position & wait time, upload & browse medical reports (camera/file), call an ambulance (Basic / ALS / ICU / Air) |
| **Doctor** | Live queue, find patients by phone, view reports, add new reports with image capture, assign triage levels, complete/remove queue entries |
| **Nurse** | Triage station with guided assessment questionnaire & automatic level calculation, view registered patients |
| **Receptionist** | Manage queue (start / complete / remove / triage), view appointments, register new patients |
| **Admin** | Dashboard overview stats, queue activity, ambulance tracking, patient directory, clinic performance (completion rate, patients-per-doctor) |

- 🔐 **Role-based access** enforced via JWT tokens and server-side `requireRole` middleware
- 📸 **Camera capture & file upload** for medical reports (base64 stored locally)
- 📊 **Analytics** & audit trail (access logs) on the backend
- 🔌 **Resilient data layer** — works with the live backend *or* falls back to browser `localStorage`

---

## 🧰 Tech Stack

- **Frontend:** React 18, React Router v6, Tailwind CSS, lucide-react icons, recharts, react-hot-toast
- **Backend:** Node.js + Express, JWT auth (jsonwebtoken), bcryptjs, uuid (in-memory store)
- **Build:** Vite 5
- **Run:** concurrently (client + server together)

---

## 🚀 Getting Started

### Prerequisites
- Node.js **16+**
- npm

### 1. Install dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 2. Run the full app (frontend + backend)

```bash
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health check:** http://localhost:3001/api/health

You can also run the client and server separately:

```bash
npm run dev:client   # Vite on :3000
npm run dev:server   # Express on :3001
```

### 3. Production build

```bash
npm run build        # outputs to /dist
npm run preview
```

---

## 🔑 Demo Credentials

| Role | Access | Credentials |
|------|--------|-------------|
| Patient | Open | Phone `9876543210` · Password `patient123` |
| Doctor | Code-protected | Access code `DOC123` |
| Receptionist | Code-protected | Access code `REC123` |
| Nurse | Code-protected | Access code `NRS123` |
| Admin | Code-protected | Access code `ADM123` |

> Store `DOC123`, `REC123`, `NRS123`, `ADM123` on the Staff Login screens or a "Need the code?" hint reveals them.

---

## 📁 Project Structure

```
├── index.html
├── package.json            # Root scripts (dev, build, start)
├── vite.config.js          # :3000 client, proxies /api → :3001
├── tailwind.config.js
├── server/
│   ├── server.js           # Express app entry
│   ├── data/store.js       # In-memory data layer + seeds
│   ├── middleware/auth.js  # JWT sign/verify, requireRole
│   ├── routes/             # auth, patients, queue, ambulance, analytics, doctors
│   └── utils/helpers.js
└── src/
    ├── App.jsx             # Router + providers
    ├── context/AppContext.jsx   # Global state + data logic
    ├── utils/              # api client, storage helpers
    ├── data/mockData.js    # Doctors, queues, triage meta, seed data
    ├── components/         # DashboardLayout, CameraCapture
    └── pages/
        ├── LandingPage.jsx
        ├── PatientLogin.jsx, PatientRegister.jsx, PatientDashboard.jsx
        ├── StaffLogin.jsx
        ├── DoctorDashboard.jsx
        ├── ReceptionistDashboard.jsx
        ├── NurseDashboard.jsx
        └── AdminDashboard.jsx
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | – | Patient signup |
| POST | `/api/auth/login` | – | Patient login |
| POST | `/api/auth/staff-login` | – | Staff login (role + code) |
| GET | `/api/patients` | Staff | List all patients |
| GET | `/api/patients/:id` | Auth | Get a patient |
| GET | `/api/patients/mine` | Patient | Own patient profile |
| GET | `/api/patients/search/:phone` | Staff | Find by phone |
| PUT | `/api/patients/:id` | Auth | Update patient |
| POST | `/api/patients/:id/reports` | Doctor/Nurse | Add a report |
| GET | `/api/queue` | Auth | Queue list |
| POST | `/api/queue` | Auth | Join queue |
| PUT | `/api/queue/:id` | Auth | Update queue entry |
| DELETE | `/api/queue/:id` | Auth | Remove queue entry |
| GET/POST | `/api/ambulance` | Auth | List / call ambulance |
| PUT | `/api/ambulance/:id` | Auth | Update ambulance call |
| GET | `/api/analytics` | Admin/Doctor | Dashboard stats |
| GET | `/api/analytics/logs` | Admin | Access audit logs |
| GET | `/api/doctors` | – | List doctors |

---

## 🧠 Notes on Data Handling

- When the backend is **reachable**, all actions persist through the REST API (in-memory store seeded on start).
- When the backend is **unavailable**, the app automatically falls back to `localStorage` so the demo still works offline.
- Report images are stored as base64 `data:` URLs (10 MB JSON limit on the server).

---

© 2026 RAKSHAK Healthcare. All rights reserved.
