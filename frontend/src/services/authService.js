import api from './api';

const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

const register = (userData) => {
  return api.post('/auth/register', userData);
};

// Export sebagai object agar mudah dipanggil
const authService = {
  login,
  register,
};

export default authService;