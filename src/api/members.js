import api, { API_BASE } from '../lib/api';

export const flatsApi = {
  list: (params) => api.get('/flats', { params }),
  get: (id) => api.get(`/flats/${id}`),
  create: (data) => api.post('/flats', data),
  update: (id, data) => api.put(`/flats/${id}`, data),
  remove: (id) => api.delete(`/flats/${id}`),
  flat360: (id) => api.get(`/flats/360/${id}`),
  search: (q) => api.get('/flats/search', { params: { q } }),
};

const crud = (base) => ({
  list: (params) => api.get(base, { params }),
  get: (id) => api.get(`${base}/${id}`),
  create: (data) => api.post(base, data),
  update: (id, data) => api.put(`${base}/${id}`, data),
  remove: (id) => api.delete(`${base}/${id}`),
});

export const ownersApi = crud('/members/owners');
export const occupantsApi = crud('/members/occupants');
export const familyMembersApi = crud('/members/family-members');
export const tenantsApi = {
  ...crud('/members/tenants'),
  history: (flatId) => api.get(`/members/tenants/history/${flatId}`),
  expiring: (days) => api.get('/members/tenants/expiring', { params: { days } }),
};
export const vehiclesApi = {
  ...crud('/members/vehicles'),
  history: (flatId) => api.get(`/members/vehicles/history/${flatId}`),
};
export const notesApi = crud('/members/notes');
export const remindersApi = crud('/members/reminders');

export const documentsApi = {
  list: (params) => api.get('/members/documents', { params }),
  get: (id) => api.get(`/members/documents/${id}`),
  upload: (formData) =>
    api.post('/members/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  download: (id) => api.get(`/members/documents/${id}/download`, { responseType: 'blob' }),
  preview: (id) => `${API_BASE}/members/documents/${id}/preview`,
  remove: (id) => api.delete(`/members/documents/${id}`),
};

export const tagsApi = {
  list: () => api.get('/members/tags'),
  create: (data) => api.post('/members/tags', data),
  update: (id, data) => api.put(`/members/tags/${id}`, data),
  remove: (id) => api.delete(`/members/tags/${id}`),
  assignToFlat: (flatId, tagIds) => api.put(`/members/tags/assign/${flatId}`, { tagIds }),
  removeFromFlat: (flatId, tagId) => api.delete(`/members/tags/assign/${flatId}/${tagId}`),
};

export const importExportApi = {
  downloadTemplate: (type) =>
    api.get(`/import-export/template/${type}`, { responseType: 'blob' }),
  preview: (formData) =>
    api.post('/import-export/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  import: (formData) =>
    api.post('/import-export/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  export: (type, format) =>
    api.get('/import-export/export', { params: { type, format }, responseType: 'blob' }),
};
