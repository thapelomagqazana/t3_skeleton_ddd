/**
 * @file axiosInstance.ts
 * @description Axios instance that auto-attaches JWT token to Authorization headers.
 */

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to each request if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or useContext(AuthContext) if needed
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
