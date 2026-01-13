import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode"; 
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: Cek token expired
  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      // exp dalam detik, Date.now() dalam milidetik
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  // 1. SAAT APLIKASI DI-LOAD / REFRESH
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');

      if (!token || !isTokenValid(token)) {
        // Jika token tidak ada atau expired
        handleLogoutLocal();
        setLoading(false);
        return;
      }

      // Jika token valid, AMBIL DATA TERBARU DARI SERVER
      // Ini solusi agar nama tidak berubah jadi "User"
      try {
        // Kita set header token manual disini untuk memastikan
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.data); // Simpan data lengkap (id, name, role, dll)
        } else {
          handleLogoutLocal();
        }
      } catch (error) {
        console.error("Gagal memuat profil user:", error);
        handleLogoutLocal();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Helper Logout Lokal (bersihkan storage & state)
  const handleLogoutLocal = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // 2. FUNGSI LOGIN
  const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;

        // Simpan token
        localStorage.setItem('token', token);
        // Simpan data user backup (opsional, tapi bagus untuk init cepat)
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set default header agar request selanjutnya otomatis bawa token
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Update State
        setUser(user);
        
        return { success: true, user: user };

      } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || "Login gagal" 
        };
      }
  };

  // 3. FUNGSI LOGOUT
  const logout = () => {
    handleLogoutLocal();
    // Opsional: Redirect ke halaman login bisa dilakukan di komponen UI
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Tampilkan loading spinner sederhana saat cek token */}
      {loading ? <div style={{textAlign:'center', marginTop:50}}>Memuat Data...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);