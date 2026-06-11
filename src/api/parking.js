import api from '../lib/api';

const crud = (base) => ({
  list: (params) => api.get(base, { params }),
  get: (id) => api.get(`${base}/${id}`),
  create: (data) => api.post(base, data),
  update: (id, data) => api.put(`${base}/${id}`, data),
  remove: (id) => api.delete(`${base}/${id}`),
});

export const parkingApi = {
  overview: () => api.get('/parking/overview'),
};

export const slotsApi = {
  ...crud('/parking/slots'),
  available: () => api.get('/parking/slots/available'),
};

export const allocationsApi = {
  list: (params) => api.get('/parking/allocations', { params }),
  create: (data) => api.post('/parking/allocations', data),
  release: (id, reason) => api.post(`/parking/allocations/${id}/release`, { reason }),
};

export const gateApi = {
  lookup: (digits) => api.get('/parking/gate/lookup', { params: { digits } }),
  log: (data) => api.post('/parking/gate/log', data),
};

export const entryLogsApi = {
  list: (params) => api.get('/parking/entry-exit', { params }),
};
