import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // --- LOGIKA TIDAK DIUBAH ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    
    if (result.success) {
      const role = result.user?.role || result.data?.role;
      if (role === 'DOCTOR') navigate('/dashboard-doctor');
      else navigate('/dashboard-patient');
    } else {
      alert(result.message || "Login Gagal");
    }
  };

  return (
    <div style={styles.pageContainer}>
      
      {/* Neumorphism Card */}
      <div style={styles.card}>
        
        <div style={styles.header}>
          <div style={styles.iconCircle}>🔐</div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Masuk ke akun Novacare Anda</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          
          <div style={styles.inputGroup}>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="Email Address"
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="Password"
              style={styles.input} 
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseDown={(e) => e.target.style.boxShadow = styles.buttonActive.boxShadow}
            onMouseUp={(e) => e.target.style.boxShadow = styles.button.boxShadow}
          >
            LOGIN
          </button>
        
        </form>

        <div style={styles.footer}>
          <p style={{margin: 0, color: '#7c889a', fontSize:'0.9rem'}}>
            Belum punya akun?{' '}
            <Link to="/register" style={styles.link}>
              Daftar Sekarang
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

// --- NEUMORPHISM STYLES ---
const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2f5', // Soft Blue-Grey Background
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    padding: '20px',
  },
  
  // Raised Card
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#eef2f5',
    borderRadius: '40px',
    padding: '50px 40px',
    // Shadow Timbul (Light Top-Left, Dark Bottom-Right)
    boxShadow: '15px 15px 30px #c8d0d8, -15px -15px 30px #ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  header: {
    textAlign: 'center',
    marginBottom: '40px',
    width: '100%',
  },
  // Icon Circle Timbul
  iconCircle: {
    width: '70px', height: '70px', borderRadius: '50%',
    background: '#eef2f5',
    boxShadow: '8px 8px 16px #c8d0d8, -8px -8px 16px #ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', margin: '0 auto 20px', color: '#38404e',
  },
  title: {
    fontSize: '1.8rem', color: '#38404e', fontWeight: '800', marginBottom: '10px', marginTop: 0,
  },
  subtitle: {
    color: '#7c889a', fontSize: '0.95rem', margin: 0, fontWeight: '600',
  },

  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  inputGroup: {
    width: '100%',
  },
  // Input Tenggelam (Inset Shadow)
  input: {
    width: '100%',
    padding: '18px 25px',
    borderRadius: '25px',
    border: 'none',
    backgroundColor: '#eef2f5',
    fontSize: '1rem',
    color: '#38404e',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: 'inset 6px 6px 12px #c8d0d8, inset -6px -6px 12px #ffffff', // Inset Effect
    transition: '0.3s',
  },
  
  // Button Timbul
  button: {
    marginTop: '10px',
    padding: '18px',
    width: '100%',
    backgroundColor: '#eef2f5',
    color: '#2563eb', // Accent Text Color
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '800',
    cursor: 'pointer',
    letterSpacing: '1px',
    boxShadow: '8px 8px 16px #c8d0d8, -8px -8px 16px #ffffff', // Raised Effect
    transition: 'all 0.1s ease',
  },
  // Efek tombol ditekan
  buttonActive: {
    boxShadow: 'inset 4px 4px 8px #c8d0d8, inset -4px -4px 8px #ffffff', // Pressed Effect
  },

  footer: {
    marginTop: '35px',
    textAlign: 'center',
  },
  link: {
    color: '#38404e',
    fontWeight: '800',
    textDecoration: 'none',
    marginLeft: '5px',
  }
};

export default Login;