// src/utils/axiosInstance.js
import axios from 'axios';
import authService from '../components/accounts/authService'; // adjust path if needed

const baseURL = 'http://127.0.0.1:8000'; // or use import.meta.env if needed

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers before each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `FRISKYTECH ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccess = await authService.refreshAccessToken();
      if (newAccess) {
        // Update the authorization header and retry request
        originalRequest.headers.Authorization = `FRISKYTECH ${newAccess}`;
        return axiosInstance(originalRequest);
      }

      // Refresh failed — force logout
      authService.logout();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
