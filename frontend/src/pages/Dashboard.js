import React from 'react';
import { useAuth } from '../context/AuthContext';

// Import Dashboard Spesifik
import DashboardDoctor from './doctor/DashboardDoctor';
import DashboardPatient from './patient/DashboardPatient';

const Dashboard = () => {
  const { user } = useAuth();

  // 1. Ambil role dan ubah ke huruf kecil semua agar aman
  // Contoh: "DOCTOR" jadi "doctor", "Dokter" jadi "doctor"
  const role = user?.role?.toLowerCase(); 

  // 2. Cek Role (Sekarang pakai bahasa Inggris sesuai response backend)
  if (role === 'doctor' || role === 'admin' || role === 'dokter') {
    return <DashboardDoctor />;
  }

  if (role === 'patient' || role === 'pasien') {
    return <DashboardPatient />;
  }

  // Debugging visual: Tampilkan apa yang sebenarnya diterima sistem
  return (
    <div style={{ padding: 20, textAlign: 'center', marginTop: '50px' }}>
      <h3>Role tidak dikenali.</h3>
      <p>Sistem mendeteksi role Anda sebagai: <strong>"{user?.role}"</strong></p>
      <p>Mohon hubungi admin atau perbaiki data di database.</p>
    </div>
  );
};

export default Dashboard;