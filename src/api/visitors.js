import api from '../lib/api';

export const visitorApi = {
  adminOverview: () => api.get('/visitors/overview'),
  watchmanOverview: () => api.get('/visitors/watchman/overview'),
  residentOverview: () => api.get('/visitors/resident/overview'),
  liveVisitors: () => api.get('/visitors/live'),
};

export const dailyStaffApi = {
  list: (params) => api.get('/visitors/daily-staff', { params }),
  get: (id) => api.get(`/visitors/daily-staff/${id}`),
  register: (formData) => api.post('/visitors/daily-staff', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  approve: (id) => api.post(`/visitors/daily-staff/${id}/approve`),
  reject: (id, reason) => api.post(`/visitors/daily-staff/${id}/reject`, { reason }),
};

export const guestApi = {
  list: (params) => api.get('/visitors/guests', { params }),
  get: (id) => api.get(`/visitors/guests/${id}`),
  create: (data) => api.post('/visitors/guests', data),
  approve: (id) => api.post(`/visitors/guests/${id}/approve`),
  reject: (id, reason) => api.post(`/visitors/guests/${id}/reject`, { reason }),
};

export const deliveryApi = {
  list: (params) => api.get('/visitors/delivery', { params }),
  create: (data) => api.post('/visitors/delivery', data),
  exit: (id) => api.post(`/visitors/delivery/${id}/exit`),
};

export const scanApi = {
  lookup: (token) => api.get('/visitors/scan/lookup', { params: { token } }),
  process: (token) => api.post('/visitors/scan', { token }),
};

export const visitorLogsApi = {
  list: (params) => api.get('/visitors/logs', { params }),
  search: (params) => api.get('/visitors/logs/search', { params }),
};
