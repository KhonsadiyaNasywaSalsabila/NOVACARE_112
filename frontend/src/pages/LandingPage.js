import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/clinic-bg.jpg'; 

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleProtectedAction = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      
      {/* HERO SECTION */}
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>

        <div style={styles.heroContentContainer}>
          <div style={styles.heroGlassCard}>
            
            
            <h1 style={styles.heroTitle}>
              Solusi Kesehatan <br/>
              <span style={{color: '#38bdf8'}}>Terintegrasi & Terpercaya</span>
            </h1>
            
            <p style={styles.heroDesc}>
              Akses layanan medis prioritas tanpa antre. Booking dokter spesialis, 
              pantau jadwal real-time, dan kelola rekam medis digital Anda dalam satu sistem terpadu.
            </p>

            <div style={styles.btnGroup}>
              <button onClick={() => navigate('/register')} style={styles.btnPrimary}>
                Daftar Pasien Baru
              </button>
              <button onClick={() => navigate('/schedule')} style={styles.btnSecondary}>
                Cek Jadwal Dokter
              </button>
            </div>
          </div>
        </div>

        {/* Floating Quick Stats */}
        <div style={styles.quickStatsBar}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>24 Jam</span>
            <span style={styles.statLabel}>Layanan IGD</span>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>15+</span>
            <span style={styles.statLabel}>Dokter Spesialis</span>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>4.9/5</span>
            <span style={styles.statLabel}>Kepuasan Pasien</span>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section style={styles.servicesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Layanan Unggulan</h2>
          <p style={styles.sectionSubtitle}>
            Akses layanan kesehatan digital dengan mudah, cepat, dan terintegrasi.
          </p>
        </div>

        <div style={styles.gridContainer}>
          
          {/* Card 1: Jadwal & Konsultasi */}
          <div style={styles.serviceCard} onClick={() => handleProtectedAction('/booking')}>
            <div style={{...styles.iconWrapper, color: '#0284c7', background: '#f0f9ff'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M9 16l2 2 4-4"></path>
              </svg>
            </div>
            
            <h3 style={styles.cardTitle}>Jadwal & Konsultasi</h3>
            <p style={styles.cardDesc}>
              Lihat jadwal dokter spesialis dan buat janji temu tanpa perlu antre di lokasi. Hemat waktu Anda.
            </p>
            
            <div style={styles.cardActionRow}>
              <span style={styles.linkText}>Buat Janji</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>

          {/* Card 2: Riwayat Medis (EMR) */}
          <div style={styles.serviceCard} onClick={() => handleProtectedAction('/medical-records')}>
            <div style={{...styles.iconWrapper, color: '#059669', background: '#ecfdf5'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <path d="M9 14l2 2 4-4"></path> 
              </svg>
            </div>

            <h3 style={styles.cardTitle}>Riwayat Medis (EMR)</h3>
            <p style={styles.cardDesc}>
              Akses rekam medis digital Anda dengan aman. Diagnosis, resep, dan riwayat tindakan tersimpan rapi.
            </p>

            <div style={styles.cardActionRow}>
              <span style={styles.linkText}>Lihat Riwayat</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>

          {/* Card 3: Farmasi Digital (DIPERBAIKI LINK-NYA) */}
          <div 
            style={styles.serviceCard} 
            // PERBAIKAN: Mengarah ke halaman eksternal (HTML statis)
            onClick={() => window.location.href = '/aplikasi_apotek.html'}
          >
            <div style={{...styles.iconWrapper, color: '#d97706', background: '#fffbeb'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z"></path>
                <path d="M8.5 8.5l7 7"></path>
              </svg>
            </div>

            <h3 style={styles.cardTitle}>Farmasi Digital</h3>
            <p style={styles.cardDesc}>
              Integrasi resep elektronik langsung ke apotek. Tebus obat lebih cepat dan transparan.
            </p>

            <div style={styles.cardActionRow}>
              {/* Ubah teks agar sesuai konteks apotek */}
              <span style={styles.linkText}>Buka Apotek</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <h2 style={{color: 'white', margin: '0 0 15px 0'}}>Prioritaskan Kesehatan Anda Hari Ini</h2>
          <p style={{color: '#e0f2fe', margin: '0 0 30px 0'}}>Bergabunglah dengan ribuan pasien yang telah merasakan kemudahan layanan kami.</p>
          <button onClick={() => navigate('/login')} style={styles.btnWhite}>
            Masuk ke Akun Saya
          </button>
        </div>
      </section>

    </div>
  );
};

// ... STYLES (SAMA) ...
const styles = {
  pageWrapper: {
    fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif",
    background: '#f8fafc', 
    minHeight: '100vh',
    width: '100%',
    overflowX: 'hidden',
  },
  heroSection: {
    position: 'relative',
    height: '85vh', 
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    marginBottom: '80px', 
  },
  heroOverlay: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
    zIndex: 1,
  },
  heroContentContainer: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    padding: '0 20px',
    textAlign: 'center',
  },
  heroGlassCard: {
    background: 'rgba(255, 255, 255, 0.1)', 
    backdropFilter: 'blur(10px)', 
    padding: '40px',
    borderRadius: '30px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
  },
  badge: {
    display: 'inline-block',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: '700',
    marginBottom: '20px',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    color: 'white',
    lineHeight: '1.2',
    margin: '0 0 20px 0',
    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },
  heroDesc: {
    fontSize: '1.1rem',
    color: '#e2e8f0',
    lineHeight: '1.6',
    marginBottom: '35px',
  },
  btnGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '14px 35px',
    background: '#0ea5e9',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(14, 165, 233, 0.4)',
    transition: 'transform 0.2s',
  },
  btnSecondary: {
    padding: '14px 35px',
    background: 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.8)',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  quickStatsBar: {
    position: 'absolute',
    bottom: '-40px', 
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 3,
    background: 'white',
    padding: '30px 60px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '60px',
    width: '80%',
    maxWidth: '1000px',
  },
  statItem: { textAlign: 'center' },
  statNumber: { display: 'block', fontSize: '1.8rem', fontWeight: '800', color: '#1e293b' },
  statLabel: { fontSize: '0.9rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' },
  statDivider: { width: '1px', height: '40px', background: '#e2e8f0' },
  servicesSection: {
    padding: '100px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionHeader: { textAlign: 'center', marginBottom: '60px' },
  sectionTitle: { fontSize: '2.2rem', fontWeight: '800', color: '#1e293b', marginBottom: '10px' },
  sectionSubtitle: { fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
  },
  serviceCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)', 
    border: '1px solid #f1f5f9',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '100%', 
  },
  iconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 10px 0',
  },
  cardDesc: {
    fontSize: '0.95rem',
    color: '#64748b',
    lineHeight: '1.6',
    margin: '0 0 25px 0',
    flex: 1,
  },
  cardActionRow: {
    marginTop: 'auto', 
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#0284c7',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  linkText: {
    textDecoration: 'none',
  },
  ctaSection: {
    padding: '0 20px 80px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  ctaCard: {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    borderRadius: '30px',
    padding: '60px',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(30, 41, 59, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  btnWhite: {
    padding: '16px 40px',
    background: 'white',
    color: '#1e293b',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
};

export default LandingPage;