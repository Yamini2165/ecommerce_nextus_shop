api.js
/**
   * utils/api.js - Axios instance with auth interceptors
   */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
      'Content-Type': 'application/json',
    },
});

// Request interceptor: attach JWT token from localStorage
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear invalid session
            localStorage.removeItem('userInfo');
            // Only redirect if not already on auth pages
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;