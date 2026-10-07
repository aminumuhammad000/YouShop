import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const multipartConfig = (data) => (
  typeof FormData !== 'undefined' && data instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : undefined
);

export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data, multipartConfig(data)),
  update: (id, data) => api.put(`/products/${id}`, data, multipartConfig(data)),
  delete: (id) => api.delete(`/products/${id}`),
};

export const ordersApi = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData),
};

export const chatsApi = {
  getAll: () => api.get('/chats'),
  getById: (id) => api.get(`/chats/${id}`),
  sendMessage: (id, text, fromMe) => api.post(`/chats/${id}/messages`, { text, fromMe }),
};

export const getChats = async () => {
  const res = await chatsApi.getAll();
  return res.data;
};

export const getChatById = async (id) => {
  const res = await chatsApi.getById(id);
  return res.data;
};

export const sendMessage = async (id, text, fromMe = false) => {
  const res = await chatsApi.sendMessage(id, text, fromMe);
  return res.data;
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  getNotifications: () => api.get('/admin/notifications'),
  createNotification: (data) => api.post('/admin/notifications', data),
  getLogs: () => api.get('/admin/logs'),
};

export default api;
