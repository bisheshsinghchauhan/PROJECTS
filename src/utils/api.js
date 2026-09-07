// ═══════════════════════════════════════════════════════════════════════════
// RAKSHAK API Client - Frontend ↔ Backend Communication Layer
// ═══════════════════════════════════════════════════════════════════════════

const API_BASE = '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('rakshak_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem('rakshak_token', token);
    else localStorage.removeItem('rakshak_token');
  }

  getToken() { return this.token; }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Backend server is not running. Please start it with: cd server && npm start');
      }
      throw error;
    }
  }

  // ── Auth ───────────────────────────────────────────────────────────────
  async registerPatient(formData) {
    const res = await this.request('/auth/register', { method: 'POST', body: JSON.stringify(formData) });
    if (res.data?.token) this.setToken(res.data.token);
    return res;
  }

  async loginPatient(phone, password) {
    const res = await this.request('/auth/login', { method: 'POST', body: JSON.stringify({ phone, password }) });
    if (res.data?.token) this.setToken(res.data.token);
    return res;
  }

  async loginStaff(code, role) {
    const res = await this.request('/auth/staff-login', { method: 'POST', body: JSON.stringify({ code, role }) });
    if (res.data?.token) this.setToken(res.data.token);
    return res;
  }

  // ── Patients ───────────────────────────────────────────────────────────
  async getPatients() {
    const res = await this.request('/patients');
    return res.data;
  }

  async getMyProfile() {
    const res = await this.request('/patients/mine');
    return res.data;
  }

  async getPatientById(id) {
    const res = await this.request(`/patients/${id}`);
    return res.data;
  }

  async searchPatientByPhone(phone) {
    const res = await this.request(`/patients/search/${phone}`);
    return res.data;
  }

  async updatePatient(id, updates) {
    const res = await this.request(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    return res.data;
  }

  async addReport(patientId, report) {
    const res = await this.request(`/patients/${patientId}/reports`, { method: 'POST', body: JSON.stringify(report) });
    return res.data;
  }

  // ── Queue ──────────────────────────────────────────────────────────────
  async getQueue() {
    const res = await this.request('/queue');
    return res.data;
  }

  async addToQueue(entry) {
    const res = await this.request('/queue', { method: 'POST', body: JSON.stringify(entry) });
    return res.data;
  }

  async updateQueueEntry(id, updates) {
    const res = await this.request(`/queue/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    return res.data;
  }

  async removeFromQueue(id) {
    const res = await this.request(`/queue/${id}`, { method: 'DELETE' });
    return res;
  }

  // ── Ambulance ──────────────────────────────────────────────────────────
  async getAmbulanceCalls() {
    const res = await this.request('/ambulance');
    return res.data;
  }

  async callAmbulance(data) {
    const res = await this.request('/ambulance', { method: 'POST', body: JSON.stringify(data) });
    return res.data;
  }

  async updateAmbulanceCall(id, updates) {
    const res = await this.request(`/ambulance/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    return res.data;
  }

  // ── Analytics ──────────────────────────────────────────────────────────
  async getAnalytics() {
    const res = await this.request('/analytics');
    return res.data;
  }

  async getAccessLogs() {
    const res = await this.request('/analytics/logs');
    return res.data;
  }

  // ── Doctors ────────────────────────────────────────────────────────────
  async getDoctors() {
    const res = await this.request('/doctors');
    return res.data;
  }

  logout() {
    this.setToken(null);
  }
}

export const api = new ApiClient();
export default api;