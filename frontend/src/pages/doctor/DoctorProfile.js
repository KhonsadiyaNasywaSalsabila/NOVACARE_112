import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const BASE_URL = "http://localhost:3009"; 
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";

const DoctorProfile = () => {
  const navigate = useNavigate();

  // State untuk data form
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '', 
    phone: ''
  });

  // State untuk gambar & UI
  const [imagePreview, setImagePreview] = useState(DEFAULT_AVATAR);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =================================================================
  // 1. LOGIKA UTAMA: FETCH DATA SAAT HALAMAN DIMUAT
  // =================================================================
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Panggil API untuk ambil data user yang sedang login
      const response = await api.get('/auth/me'); 
      const user = response.data.data || response.data;
      
      // Masukkan data dari database ke dalam Form
      setFormData({
        name: user.name || '',
        specialization: user.specialization || '',
        email: user.email || '',
        phone: user.phone || ''
      });

      // Tampilkan foto profil dari database jika ada
      if (user.image) {
        setImagePreview(`${BASE_URL}/uploads/doctors/${user.image}`);
      }
    } catch (error) {
      console.error("Gagal load profil", error);
      alert("Gagal memuat data profil.");
    } finally {
      setLoading(false); // Matikan loading agar form muncul
    }
  };

  // 2. Handle Ganti Gambar (Preview Lokal)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 3. Handle Input Teks (Agar bisa diedit)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Handle Submit ke Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name);
      dataToSend.append('specialization', formData.specialization);
      dataToSend.append('phone', formData.phone);
      
      if (selectedFile) {
        dataToSend.append('image', selectedFile); 
      }

      await api.put('/doctor/profile', dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Profil berhasil diperbarui!");
      navigate('/dashboard-doctor'); // Redirect setelah sukses

    } catch (error) {
      console.error(error);
      alert("❌ Gagal update profil: " + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  // Tampilkan Loading jika data belum siap
  if (loading) return (
    <div style={{display:'flex', justifyContent:'center', marginTop:'50px'}}>
        <p>Sedang mengambil data profil...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Profil Dokter</h2>
        
        <form onSubmit={handleSubmit}>
          {/* --- Bagian Foto Profil --- */}
          <div style={styles.avatarSection}>
            <div style={styles.avatarWrapper}>
              <img 
                src={imagePreview} 
                alt="Profile" 
                style={styles.avatar} 
                onError={(e) => e.target.src = DEFAULT_AVATAR}
              />
              <label htmlFor="fileInput" style={styles.cameraButton}>
                📷
              </label>
              <input 
                id="fileInput"
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                style={{display: 'none'}}
              />
            </div>
            <p style={styles.hintText}>Klik ikon kamera untuk mengganti foto</p>
          </div>

          {/* --- Bagian Form Input --- */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Nama Lengkap & Gelar</label>
            <input 
              type="text" 
              name="name"
              value={formData.name} // <--- INI YANG MEMBUAT DATA MUNCUL
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Spesialisasi</label>
            <input 
              type="text" 
              name="specialization"
              value={formData.specialization} // <--- INI YANG MEMBUAT DATA MUNCUL
              onChange={handleChange}
              style={styles.input}
              placeholder="Contoh: Spesialis Anak"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email (Tidak dapat diubah)</label>
            <input 
              type="email" 
              value={formData.email} // <--- DATA DARI DB
              style={{...styles.input, background: '#f1f5f9', color: '#94a3b8'}}
              disabled
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nomor Telepon</label>
            <input 
              type="text" 
              name="phone"
              value={formData.phone} // <--- DATA DARI DB
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.button,
              background: saving ? '#94a3b8' : 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
            disabled={saving}
          >
            {saving ? "Menyimpan Perubahan..." : "Simpan Profil"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles JS
const styles = {
  container: {
    padding: '40px 20px',
    background: '#f8fafc',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    background: 'white',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  },
  title: {
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: '30px',
    fontSize: '1.5rem',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
  },
  avatarWrapper: {
    position: 'relative',
    width: '120px',
    height: '120px',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #f1f5f9',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  cameraButton: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    background: '#2563eb',
    color: 'white',
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '3px solid white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  hintText: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginTop: '10px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#64748b',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    color: '#334155',
    boxSizing: 'border-box', 
    outline: 'none',
    transition: '0.3s',
  },
  button: {
    width: '100%',
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '700',
    marginTop: '10px',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
  }
};

export default DoctorProfile;