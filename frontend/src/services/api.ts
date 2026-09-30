import axios from 'axios';

const isCodespaceOrLocal = Boolean(
  typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]' ||
    window.location.protocol === 'file:' ||
    !window.location.hostname ||
    window.location.hostname.endsWith('.github.dev') ||
    window.location.hostname.endsWith('.app.github.dev') ||
    window.location.hostname.includes('codespaces') ||
    window.location.hostname.includes('gitpod.io')
  )
);

export const BASE_API_URL = import.meta.env.VITE_API_URL || (
  isCodespaceOrLocal || import.meta.env.DEV
    ? '/api/users'
    : 'https://skill-binimoy-backend.onrender.com/api/users'
);

export const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Handle token expiration
    }
    return Promise.reject(error);
  }
);
