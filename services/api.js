import AsyncStorage from '@react-native-async-storage/async-storage';

// Set EXPO_PUBLIC_API_URL when the computer's LAN IP changes.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.146:5001';

const BASE_URL = `${API_URL}/api`;

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// --- AUTH ------------------------------------------------------------------
export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const registerUser = async (name, email, password, phoneNumber) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phoneNumber }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

// --- PRODUCTS --------------------------------------------------------------
export const fetchProducts = async () => {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/products`, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
  return data;
};

export const fetchProductById = async (id) => {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/products/${id}`, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch product');
  return data;
};

// --- SEARCH ----------------------------------------------------------------
export const searchProducts = async (query) => {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Search failed');
  return data;
};

// --- CHATS -----------------------------------------------------------------
export const fetchChats = async () => {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/chats`, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch chats');
  return data;
};

export const fetchChatById = async (id) => {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/chats/${id}`, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch chat');
  return data;
};

export const sendChatMessage = async (chatId, text, fromMe = true) => {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text, fromMe }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to send message');
  return data;
};

// --- ORDERS ----------------------------------------------------------------
export const fetchOrders = async () => {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/orders`, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
  return data;
};

export const fetchOrderById = async (id) => {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/orders/${id}`, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch order');
  return data;
};

export const createOrder = async (items, totalPrice) => {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ items, totalPrice }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create order');
  return data;
};
