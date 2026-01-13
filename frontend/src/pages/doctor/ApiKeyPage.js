import React from 'react';
import ApiKeyManager from '../../components/ApiKeyManager';

const ApiKeyPage = () => {
  return (
    <div style={styles.pageContainer}>
      {/* Background Decor */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.header}>
        <span style={styles.badge}>DEVELOPER AREA</span>
        <h1 style={styles.title}>Integrasi API Mitra</h1>
        <p style={styles.subtitle}>
          Kelola kunci akses aman untuk menghubungkan data klinik dengan Apotek atau Asuransi pihak ketiga.
        </p>
      </div>

      <ApiKeyManager />
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    padding: '40px 20px',
    background: '#f8fafc',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: 'relative',
    overflowX: 'hidden', // Mencegah scroll horizontal jika blob keluar
  },
  // Hiasan Background
  blob1: { position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0 },
  blob2: { position: 'absolute', top: '20%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0 },
  
  header: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto 50px',
    position: 'relative',
    zIndex: 1,
  },
  badge: {
    fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', color: '#6366f1',
    background: '#e0e7ff', padding: '6px 12px', borderRadius: '30px', marginBottom: '15px', display: 'inline-block'
  },
  title: {
    fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '10px', marginTop: 0
  },
  subtitle: {
    color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6'
  }
};

export default ApiKeyPage;