
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";

const API = `${import.meta.env.VITE_BACKEND_URL}/auth`;

const setToken = (token) => {
  localStorage.setItem('access_token', token.access);
  localStorage.setItem('refresh_token', token.refresh);
};

const getToken = () => localStorage.getItem('access_token');

const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = '/auth/login';
};

const refreshAccessToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return null;

  try {
    const response = await axios.post(`${API}/jwt/refresh/`, { refresh });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    return access;
  } catch (error) {
    console.error("Token refresh failed:", error);
    logout(); // Optional: force logout if refresh fails
    return null;
  }
};

const register = async (data) => {
  return axiosInstance.post(`${API}/users/`, data);
};

const login = async (credentials) => {
  const response = await axiosInstance.post(`${API}/jwt/create/`, credentials);
  setToken(response.data);
  return response.data;
};

const changePassword = async (data) => {
  return axiosInstance.post(`${API}/users/set_password/`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

const resetPasswordRequest = async (email) => {
  return axiosInstance.post(`${API}/users/reset_password/`, { email });
};

const resetPasswordConfirm = async (data) => {
  return axiosInstance.post(`${API}/users/reset_password_confirm/`, data);
};

export default {
  register,
  login,
  logout,
  changePassword,
  resetPasswordRequest,
  resetPasswordConfirm,
  getToken,
  refreshAccessToken, // ✅ Export it here
};
