import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DashboardPatient = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(null);

  // --- 1. LOGIKA PEMBAGIAN WAKTU & KONTRAS EKSTRIM ---
  useEffect(() => {
    const hour = new Date().getHours();
    let selectedTheme;

    if (hour >= 5 && hour < 11) {
      // PAGI (5 - 11)
      selectedTheme = {
        greeting: "Selamat Pagi", mode: "light", icon: "🌅",
        bg: "#f8fafc", accent: "#f43f5e",
        glass: "rgba(255, 255, 255, 0.95)", border: "#e2e8f0",
        text: "#0f172a", subText: "#475569", orb1: "#fecdd3", orb2: "#bae6fd"
      };
    } else if (hour >= 11 && hour < 15) {
      // SIANG (11 - 15)
      selectedTheme = {
        greeting: "Selamat Siang", mode: "light", icon: "☀️",
        bg: "#f0f9ff", accent: "#0ea5e9",
        glass: "rgba(255, 255, 255, 0.9)", border: "#bae6fd",
        text: "#0f172a", subText: "#475569", orb1: "#7dd3fc", orb2: "#fef08a"
      };
    } else if (hour >= 15 && hour < 18) {
      // SORE (15 - 18)
      selectedTheme = {
        greeting: "Selamat Sore", mode: "light", icon: "🌇",
        bg: "#fff7ed", accent: "#f97316",
        glass: "rgba(255, 255, 255, 0.95)", border: "#fed7aa",
        text: "#0f172a", subText: "#475569", orb1: "#fdba74", orb2: "#fca5a5"
      };
    } else {
      // MALAM (18 - 5): HIGH CONTRAST MODE
      selectedTheme = {
        greeting: "Selamat Malam", mode: "dark", icon: "🌙",
        bg: "#020617", 
        accent: "#a5b4fc", // Ungu Muda Neon (Ganti Ungu Tua)
        glass: "rgba(30, 41, 59, 1)", // Card Slate-800 Solid (Kontras terhadap Background)
        border: "rgba(255, 255, 255, 0.2)",
        text: "#ffffff", // Font Putih Murni (Ganti Hitam)
        subText: "#e2e8f0", // Font Silver Terang (Ganti Hitam/Abu Tua)
        orb1: "#1e1b4b", orb2: "#312e81"
      };
    }
    setTheme(selectedTheme);
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      const response = await api.get('/patients/my-appointments');
      const sortedData = (response.data.data || []).sort((a, b) => {
        const order = { 'WAITING': 1, 'BOOKED': 2, 'COMPLETED': 3, 'CANCELLED': 4 };
        return (order[a.status?.toUpperCase()] || 99) - (order[b.status?.toUpperCase()] || 99);
      });
      setAppointments(sortedData);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (!theme) return null;

  const isToday = (date) => new Date(date).toLocaleDateString('en-CA') === new Date().toLocaleDateString('en-CA');

  return (
    <div style={{ ...styles.pageWrapper, background: theme.bg }}>
      <style>{`
        @keyframes pulse-radar { 0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(234, 179, 8, 0); } 100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); } }
        .ticket-cut:before, .ticket-cut:after {
            content: ''; position: absolute; width: 30px; height: 30px; 
            background: ${theme.bg}; border-radius: 50%;
            left: 72%; transform: translateX(-50%); z-index: 2;
        }
        .ticket-cut:before { top: -15px; }
        .ticket-cut:after { bottom: -15px; }
        .glossy-metallic {
            background: linear-gradient(145deg, #f8fafc 0%, #cbd5e1 45%, #94a3b8 100%);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.9), 0 10px 25px rgba(0,0,0,0.3);
            border: 1px solid #94a3b8;
        }
        .aurora-orb { position: fixed; filter: blur(100px); border-radius: 50%; opacity: 0.5; z-index: 0; }
      `}</style>

      {/* Orbs siluet background */}
      <div className="aurora-orb" style={{ top: '-10%', right: '-5%', width: '60vw', height: '60vw', background: theme.orb1 }}></div>
      <div className="aurora-orb" style={{ bottom: '-10%', left: '-5%', width: '50vw', height: '50vw', background: theme.orb2 }}></div>

      <div style={styles.container}>
        
        {/* HEADER */}
        <div style={styles.header}>
            <h1 style={{ color: theme.text, fontSize: '2.2rem', fontWeight: '900', margin: 0 }}>
                {theme.greeting}, {user?.username || user?.name}
            </h1>
            <p style={{ color: theme.subText, fontSize: '1.1rem', marginTop: '5px' }}>Data medis Anda telah diperbarui.</p>
        </div>

        {/* QUICK MENU */}
        <div style={styles.menuGrid}>
          <Link to="/booking" style={{ textDecoration: 'none', flex: 1 }}>
            <div style={{ ...styles.menuCard, background: theme.glass, borderColor: theme.border }}>
              <div style={styles.iconBox}>📅</div>
              <div style={{ color: theme.text, fontWeight: '800', fontSize: '1.1rem' }}>Buat Janji</div>
            </div>
          </Link>
          <Link to="/medical-records" style={{ textDecoration: 'none', flex: 1 }}>
            <div style={{ ...styles.menuCard, background: theme.glass, borderColor: theme.border }}>
              <div style={styles.iconBox}>📂</div>
              <div style={{ color: theme.text, fontWeight: '800', fontSize: '1.1rem' }}>Rekam Medis</div>
            </div>
          </Link>
        </div>

        <h3 style={{ color: theme.text, fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: 10 }}>
           <span style={{ width: 10, height: 10, background: theme.accent, borderRadius: '50%' }}></span>
           Tiket Antrean Aktif
        </h3>

        {appointments.map((item) => {
          const status = item.status?.toUpperCase();
          // Fix Gelar Ganda dr. dr.
          const cleanDocName = item.doctor?.name.replace(/^dr\.\s+/i, '');

          return (
            <div key={item.id} className="ticket-cut" 
                 style={{ ...styles.ticketContainer, background: theme.glass, borderColor: theme.border, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
              
              <div style={styles.ticketMain}>
                <div style={{ ...styles.statusPill, color: theme.accent, background: 'rgba(165, 180, 252, 0.15)' }}>
                  ● {status}
                </div>
                
                <h2 style={{ color: theme.text, fontSize: '1.9rem', fontWeight: '950', margin: '10px 0' }}>
                  dr. {cleanDocName}
                </h2>
                <p style={{ color: theme.accent, fontWeight: '800', fontSize: '1rem', textTransform: 'uppercase' }}>
                  {item.doctor?.specialization || "Umum"}
                </p>
                
                <div style={styles.infoGrid}>
                    <div>
                      <span style={{ ...styles.label, color: theme.subText }}>TANGGAL PERIKSA</span>
                      <span style={{ color: theme.text, fontWeight: '900', fontSize: '1.2rem' }}>
                          {new Date(item.schedule?.date || item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span style={{ ...styles.label, color: theme.subText }}>JAM SHIFT</span>
                      <span style={{ color: theme.text, fontWeight: '900', fontSize: '1.2rem' }}>
                          {item.schedule?.shift_start?.slice(0, 5)} WIB
                      </span>
                    </div>
                </div>
              </div>

              <div style={{ ...styles.ticketSide, borderLeft: `2px dashed ${theme.border}` }}>
                {status === 'WAITING' && (
                  <div className="glossy-metallic" style={styles.badgeBox}>
                    <div style={styles.radarIcon}></div>
                    <p style={styles.badgeLabel}>NOMOR ANTREAN</p>
                    <h1 style={styles.badgeNumber}>{item.queue_number}</h1>
                  </div>
                )}

                {status === 'BOOKED' && (
                  <div className="glossy-metallic" style={styles.badgeBox}>
                    <p style={styles.badgeLabel}>NOMOR BOOKING</p>
                    <h1 style={styles.badgeNumber}>{item.queue_number}</h1>
                    {isToday(item.schedule?.date) && (
                        <button onClick={() => navigate(`/checkin/${item.id}`)} style={styles.btnCheckin}>CHECK-IN</button>
                    )}
                  </div>
                )}

                {status === 'COMPLETED' && (
                  <div className="glossy-metallic" style={{ ...styles.badgeBox, background: 'linear-gradient(145deg, #dcfce7 0%, #ffffff 50%, #86efac 100%)', border: '1px solid #22c55e' }}>
                    <p style={{ ...styles.badgeLabel, color: '#166534' }}>ID APOTEK</p>
                    <h1 style={{ ...styles.badgeNumber, color: '#15803d', fontSize: '1.6rem' }}>RSP-{item.id}</h1>
                    <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#166534', marginTop: 8 }}>VALIDATED ✅</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { minHeight: '100vh', padding: '30px 0', transition: 'background 0.5s ease' },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '0 25px', position: 'relative', zIndex: 1 },
  header: { marginBottom: '50px' },
  menuGrid: { display: 'flex', gap: '20px', marginBottom: '50px' },
  menuCard: { padding: '25px', borderRadius: '25px', border: '1px solid', display: 'flex', alignItems: 'center', gap: '20px' },
  iconBox: { width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
  ticketContainer: { display: 'flex', borderRadius: '35px', border: '1px solid', marginBottom: '35px', position: 'relative', overflow: 'visible' },
  ticketMain: { flex: 2.3, padding: '40px' },
  ticketSide: { flex: 1, padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.03)' },
  statusPill: { padding: '5px 15px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '900', display: 'inline-block', letterSpacing: '1.5px' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: '900', marginBottom: '6px', letterSpacing: '1px' },
  infoGrid: { display: 'flex', gap: '50px', marginTop: '25px' },
  badgeBox: { width: '100%', padding: '25px 15px', borderRadius: '25px', textAlign: 'center', position: 'relative' },
  badgeLabel: { margin: 0, fontSize: '0.65rem', fontWeight: '950', color: '#475569', letterSpacing: '1px' },
  badgeNumber: { margin: '8px 0', fontSize: '3.5rem', fontWeight: '950', color: '#0f172a', lineHeight: 1, fontFamily: 'monospace' },
  radarIcon: { width: '10px', height: '10px', background: '#f59e0b', borderRadius: '50%', margin: '0 auto 10px', animation: 'pulse-radar 1.5s infinite' },
  btnCheckin: { background: '#f43f5e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '900', fontSize: '0.75rem', marginTop: '15px', cursor: 'pointer' }
};

export default DashboardPatient;