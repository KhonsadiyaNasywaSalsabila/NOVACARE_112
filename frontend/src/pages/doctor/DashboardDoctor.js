import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Asumsi ada AuthContext

const DashboardDoctor = () => {
  const { user } = useAuth();
  
  // Helper Tanggal
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={styles.pageWrapper}>
      
      {/* Background Decor (Blob Halus) */}
      <div style={styles.blob}></div>

      <div style={styles.container}>
        
        {/* --- HEADER SECTION --- */}
        <div style={styles.header}>
          <div>
            <p style={styles.dateBadge}>🗓️ {today}</p>
            <h1 style={styles.greeting}>
              Halo, <span style={{color: '#0284c7'}}> {user?.username || user?.name || 'Dokter'}</span> 👋
            </h1>
            <p style={styles.subGreeting}>Siap melayani pasien hari ini?</p>
          </div>
          
          {/* Status Indikator (Hiasan Profesional) */}
          <div style={styles.statusPill}>
            <span style={styles.statusDot}></span> Mode Praktik Aktif
          </div>
        </div>

        {/* --- BENTO GRID MENU --- */}
        <div style={styles.bentoGrid}>
          
          {/* KARTU 1: DIAGNOSIS (HERO CARD - PALING BESAR) */}
          <Link to="/doctor/input-diagnosis" style={{textDecoration: 'none', gridColumn: 'span 2'}}>
            <div style={styles.cardHero}>
              <div style={styles.cardContent}>
                <div style={{...styles.iconBox, background: '#e0f2fe', color: '#0284c7'}}>
                  🩺
                </div>
                <div>
                  <h3 style={styles.cardTitle}>Pemeriksaan & Diagnosis</h3>
                  <p style={styles.cardDesc}>
                    Masuk ke mode pemeriksaan. Catat rekam medis, diagnosis, dan buat resep digital secara real-time.
                  </p>
                </div>
              </div>
              <div style={styles.arrowIcon}>→</div>
            </div>
          </Link>

          {/* KARTU 2: JADWAL */}
          <Link to="/doctor/manage-schedule" style={{textDecoration: 'none'}}>
            <div style={styles.cardStandard}>
              <div style={{...styles.iconBox, background: '#f0fdf4', color: '#16a34a'}}>
                📅
              </div>
              <h3 style={styles.cardTitle}>Atur Jadwal</h3>
              <p style={styles.cardDesc}>Kelola slot waktu praktik & kuota.</p>
            </div>
          </Link>

          {/* KARTU 3: PROFIL */}
          <Link to="/doctor/profile" style={{textDecoration: 'none'}}>
            <div style={styles.cardStandard}>
              <div style={{...styles.iconBox, background: '#fff7ed', color: '#ea580c'}}>
                👤
              </div>
              <h3 style={styles.cardTitle}>Profil Dokter</h3>
              <p style={styles.cardDesc}>Update gelar & spesialisasi.</p>
            </div>
          </Link>

          {/* KARTU 4: API KEY (Tambahan agar lengkap) */}
          <Link to="/doctor/api-keys" style={{textDecoration: 'none', gridColumn: 'span 2'}}>
            <div style={styles.cardWide}>
              <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                <div style={{...styles.iconBox, background: '#f3e8ff', color: '#9333ea'}}>
                  🔐
                </div>
                <div>
                  <h3 style={styles.cardTitle}>Developer Hub (API)</h3>
                  <p style={{...styles.cardDesc, margin:0}}>Integrasi dengan sistem Apotek & Asuransi.</p>
                </div>
              </div>
              <div style={styles.arrowIcon}>↗</div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};

// --- STYLES (MODERN BENTO GRID) ---
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: '50px'
  },
  // Background Blob
  blob: {
    position: 'absolute', top: '-10%', right: '-10%',
    width: '600px', height: '600px',
    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, rgba(255,255,255,0) 70%)',
    zIndex: 0,
    borderRadius: '50%'
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    position: 'relative',
    zIndex: 1
  },

  // HEADER
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '40px', flexWrap: 'wrap', gap: '20px'
  },
  dateBadge: {
    fontSize: '0.85rem', fontWeight: '600', color: '#64748b', 
    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px'
  },
  greeting: {
    fontSize: '2.2rem', fontWeight: '800', color: '#1e293b', margin: '0 0 5px 0'
  },
  subGreeting: {
    fontSize: '1rem', color: '#64748b', margin: 0
  },
  statusPill: {
    background: 'white', padding: '8px 16px', borderRadius: '50px',
    border: '1px solid #e2e8f0', color: '#059669', fontWeight: '700', fontSize: '0.85rem',
    display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
  },
  statusDot: {
    width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%',
    boxShadow: '0 0 0 2px #bbf7d0'
  },

  // GRID LAYOUT
  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Responsive columns
    gap: '24px',
  },

  // CARD STYLES
  cardHero: {
    background: 'white',
    borderRadius: '24px',
    padding: '30px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    height: '100%',
    /* Hover effect in style tag below */
  },
  cardStandard: {
    background: 'white',
    borderRadius: '24px',
    padding: '25px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
    cursor: 'pointer', transition: 'transform 0.2s ease',
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    height: '100%', boxSizing: 'border-box'
  },
  cardWide: {
    background: 'white',
    borderRadius: '20px',
    padding: '20px 30px',
    border: '1px dashed #cbd5e1', // Dashed border for dev feel
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    cursor: 'pointer', transition: 'background 0.2s ease',
  },

  // COMPONENTS INSIDE CARD
  cardContent: {
    display: 'flex', gap: '20px', alignItems: 'flex-start'
  },
  iconBox: {
    width: '50px', height: '50px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.5rem', flexShrink: 0
  },
  cardTitle: {
    margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: '800', color: '#1e293b'
  },
  cardDesc: {
    margin: 0, fontSize: '0.95rem', color: '#64748b', lineHeight: '1.5'
  },
  arrowIcon: {
    fontSize: '1.5rem', color: '#cbd5e1', fontWeight: '300'
  }
};

// Inject Hover Effects
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  div[style*="cardHero"]:hover, div[style*="cardStandard"]:hover, div[style*="cardWide"]:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08) !important;
  }
`;
document.head.appendChild(styleSheet);

export default DashboardDoctor;