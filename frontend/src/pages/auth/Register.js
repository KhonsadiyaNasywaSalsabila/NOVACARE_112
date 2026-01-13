import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; 

const Register = () => {
  // --- LOGIKA TIDAK DIUBAH ---
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi Sisi Klien (Client-side)
    const phoneRegex = /^(08|628|\+628)[0-9]{8,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      return alert("❌ Nomor telepon tidak valid! Gunakan format Indonesia (08...)");
    }
    
    if (formData.password.length < 6) {
      return alert("❌ Password minimal 6 karakter!");
    }

    try {
      await api.post('/auth/register', formData);
      alert(`✅ Registrasi Berhasil!`);
      navigate('/login');
    } catch (error) {
      alert('❌ Registrasi Gagal: ' + (error.response?.data?.message || "Server Error"));
    }
  };

  return (
    <div style={styles.pageContainer}>
      
      {/* Neumorphism Card */}
      <div style={styles.card}>
        
        <div style={styles.header}>
          <div style={styles.iconCircle}>🚀</div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Mulai perjalanan sehat Anda</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          
          <div style={styles.inputGroup}>
            <input 
              type="text" name="name" 
              onChange={handleChange} required 
              placeholder="Nama Lengkap"
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <input 
              type="email" name="email" 
              onChange={handleChange} required 
              placeholder="Email Address"
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <input 
              type="tel" name="phone" 
              onChange={handleChange} required
              placeholder="Nomor WhatsApp (Contoh: 0812...)"
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <input 
              type="password" name="password" 
              onChange={handleChange} required 
              placeholder="Password (Min. 6 Karakter)"
              style={styles.input} 
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseDown={(e) => e.target.style.boxShadow = styles.buttonActive.boxShadow}
            onMouseUp={(e) => e.target.style.boxShadow = styles.button.boxShadow}
          >
            DAFTAR SEKARANG
          </button>
        </form>

        <div style={styles.footer}>
          <p style={{margin: 0, color: '#7c889a', fontSize:'0.9rem'}}>
            Sudah punya akun?{' '}
            <Link to="/login" style={styles.link}>
              Login Disini
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

// --- STYLES SAMA DENGAN LOGIN (Reusable) ---
const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2f5', 
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    padding: '20px',
  },
  
  card: {
    width: '100%',
    maxWidth: '420px', // Sedikit lebih lebar untuk register
    backgroundColor: '#eef2f5',
    borderRadius: '40px',
    padding: '50px 40px',
    boxShadow: '15px 15px 30px #c8d0d8, -15px -15px 30px #ffffff',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },

  header: { textAlign: 'center', marginBottom: '30px', width: '100%' },
  iconCircle: {
    width: '70px', height: '70px', borderRadius: '50%', background: '#eef2f5',
    boxShadow: '8px 8px 16px #c8d0d8, -8px -8px 16px #ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', margin: '0 auto 20px',
  },
  title: { fontSize: '1.8rem', color: '#38404e', fontWeight: '800', marginBottom: '10px', marginTop: 0 },
  subtitle: { color: '#7c889a', fontSize: '0.95rem', margin: 0, fontWeight: '600' },

  form: { width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { width: '100%' },
  
  input: {
    width: '100%', padding: '18px 25px', borderRadius: '25px', border: 'none',
    backgroundColor: '#eef2f5', fontSize: '1rem', color: '#38404e', outline: 'none',
    boxSizing: 'border-box',
    boxShadow: 'inset 6px 6px 12px #c8d0d8, inset -6px -6px 12px #ffffff', // Tenggelam
  },
  
  button: {
    marginTop: '15px', padding: '18px', width: '100%', backgroundColor: '#eef2f5',
    color: '#10b981', // Hijau untuk Register
    border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: '800',
    cursor: 'pointer', letterSpacing: '1px',
    boxShadow: '8px 8px 16px #c8d0d8, -8px -8px 16px #ffffff', // Timbul
    transition: 'all 0.1s ease',
  },
  buttonActive: {
    boxShadow: 'inset 4px 4px 8px #c8d0d8, inset -4px -4px 8px #ffffff', // Ditekan
  },

  footer: { marginTop: '35px', textAlign: 'center' },
  link: { color: '#38404e', fontWeight: '800', textDecoration: 'none', marginLeft: '5px' }
};

export default Register;