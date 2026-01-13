import React from 'react';
import logoImg from '../assets/NOVACARE5.png'; 

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.column}>
          
          {/* LOGO */}
          <div style={styles.logoContainer}>
            <img src={logoImg} alt="Novacare" style={styles.logoFooter} />
          </div>

          <p style={styles.desc}>
            Layanan kesehatan terpadu dengan fasilitas interior modern dan tenaga medis profesional. 
            Kenyamanan dan keselamatan Anda adalah prioritas kami.
          </p>
        </div>
        
        <div style={styles.column}>
          <h4 style={styles.heading}>Akses Cepat</h4>
          <p style={styles.link}>Jadwal Dokter</p>
          <p style={styles.link}>Booking Online</p>
          <p style={styles.link}>Cek Hasil Lab</p>
        </div>

        <div style={styles.column}>
          <h4 style={styles.heading}>Hubungi Kami</h4>
          <p style={styles.text}>📞 1500-888 (24 Jam)</p>
          <p style={styles.text}>📍 Jl. Medika Plaza No. 10, Jakarta</p>
          <p style={styles.text}>📧 care@novacare.id</p>
        </div>
      </div>
      
      {/* COPYRIGHT (Sekarang transparan & menyatu) */}
      <div style={styles.copyright}>
        &copy; {new Date().getFullYear()} Novacare Integrated System. All rights reserved.
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    // --- KUNCI GRADASI NATURAL ---
    // Gradasi dimulai dari Putih (agar nyambung dengan halaman atas)
    // lalu perlahan menjadi Biru Muda di bagian paling bawah.
    // Tidak ada garis putus.
    background: 'linear-gradient(180deg, #ffffff 0%, #e0f2fe 100%)', 
    color: '#334155', 
    marginTop: 'auto',
    paddingTop: '60px', // Padding atas saja, bawah diatur di copyright
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 25px 40px', // Padding bawah dikurangi agar dekat ke copyright
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '40px',
    width: '100%',
    boxSizing: 'border-box',
  },
  column: {
    flex: '1',
    minWidth: '220px',
  },
  logoContainer: {
    marginBottom: '20px',
  },
  logoFooter: {
    height: '60px', 
    width: 'auto',
    objectFit: 'contain',
  },
  desc: {
    lineHeight: '1.6',
    fontSize: '0.95rem',
    color: '#475569', 
    maxWidth: '300px',
  },
  heading: {
    color: '#0f172a', 
    marginBottom: '20px',
    fontSize: '1.1rem',
    fontWeight: '700',
    marginTop: 0,
  },
  link: {
    marginBottom: '10px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '#334155',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  text: {
    marginBottom: '10px',
    fontSize: '0.95rem',
    color: '#334155',
    fontWeight: '500',
  },
  
  // --- PERBAIKAN COPYRIGHT ---
  copyright: {
    backgroundColor: 'transparent', // TRANSPARAN (Agar gradasi footer terlihat)
    borderTop: 'none',              // HAPUS GARIS BATAS
    textAlign: 'center',
    padding: '25px',
    fontSize: '0.85rem',
    color: '#64748b', 
    fontWeight: '500',
    marginTop: 'auto',              // Dorong ke paling bawah
  }
};

export default Footer;