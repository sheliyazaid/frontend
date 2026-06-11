import api from '../lib/api';

export const usersApi = {
  listWatchmen: (params) => api.get('/users/watchmen', { params }),
  createWatchman: (data) => api.post('/users/watchmen', data),
  deactivate: (id) => api.delete(`/users/watchmen/${id}`),
};
