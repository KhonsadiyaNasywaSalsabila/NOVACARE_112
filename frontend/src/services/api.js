import axios from 'axios';

// Membuat instance axios dengan base URL dari .env
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR (PENTING UNTUK JWT)
// Setiap request keluar, kode ini akan cek LocalStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Tempelkan token di Header Authorization
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;