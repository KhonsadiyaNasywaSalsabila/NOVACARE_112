import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({ date: '', shift_start: '', shift_end: '', quota: 10 });
  const [loading, setLoading] = useState(false);

  // --- LOGIC (TIDAK BERUBAH) ---
  useEffect(() => { fetchSchedules(); }, []);

  const fetchSchedules = async () => {
    try {
      const res = await api.get('/doctor/schedule');
      setSchedules(res.data.data || []);
    } catch (error) { console.error("Gagal load jadwal"); }
  };

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/doctor/schedule', form);
      alert("✅ Jadwal Berhasil Ditambah!");
      setForm({ date: '', shift_start: '', shift_end: '', quota: 10 }); 
      fetchSchedules();
    } catch (error) { alert("❌ Error: " + (error.response?.data?.message || error.message)); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus jadwal ini?")) return;
    try {
      await api.delete(`/doctor/schedule/${id}`);
      fetchSchedules();
    } catch (error) { alert("Gagal hapus data"); }
  };

  return (
    <div style={styles.pageWrapper}>
      
      {/* Background Decor (Ambient Light) */}
      <div style={styles.ambientLight1}></div>
      <div style={styles.ambientLight2}></div>

      <div style={styles.container}>
        
        {/* HEADER SECTION */}
        <div style={styles.header}>
            <div style={styles.iconBox}>📅</div>
            <div>
                <h1 style={styles.title}>Kelola Jadwal Praktik</h1>
                <p style={styles.subtitle}>Atur ketersediaan waktu Anda untuk pasien.</p>
            </div>
        </div>

        {/* --- FORM CARD (CLEAN & MODERN) --- */}
        <div style={styles.formCard}>
            <div style={styles.formHeader}>
                <h3 style={{margin:0, color:'#1e293b'}}>Buat Slot Baru</h3>
                <span style={styles.badgeInfo}>Auto-Active</span>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.formGrid}>
                {/* Date Input */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>TANGGAL PRAKTIK</label>
                    <input 
                        type="date" name="date" value={form.date} onChange={handleChange} 
                        style={styles.inputField} required 
                    />
                </div>

                {/* Time Range */}
                <div style={{display:'flex', gap:'15px', flex:1}}>
                    <div style={{...styles.inputGroup, flex:1}}>
                        <label style={styles.label}>MULAI</label>
                        <input type="time" name="shift_start" value={form.shift_start} onChange={handleChange} style={styles.inputField} required />
                    </div>
                    <div style={{...styles.inputGroup, flex:1}}>
                        <label style={styles.label}>SELESAI</label>
                        <input type="time" name="shift_end" value={form.shift_end} onChange={handleChange} style={styles.inputField} required />
                    </div>
                </div>

                {/* Quota & Submit */}
                <div style={{display:'flex', gap:'15px', alignItems:'flex-end', flex:1}}>
                    <div style={{...styles.inputGroup, width:'100px'}}>
                        <label style={styles.label}>KUOTA</label>
                        <input type="number" name="quota" value={form.quota} onChange={handleChange} style={styles.inputField} min="1" required />
                    </div>
                    <button type="submit" disabled={loading} style={styles.submitBtn}>
                        {loading ? "Menyimpan..." : "+ Tambah Jadwal"}
                    </button>
                </div>
            </form>
        </div>

        {/* --- SCHEDULE LIST (CARD STYLE) --- */}
        <div style={styles.listSection}>
            <h3 style={styles.sectionTitle}>Jadwal Aktif ({schedules.length})</h3>
            
            {schedules.length === 0 ? (
                <div style={styles.emptyState}>
                    <p>Belum ada jadwal praktik yang dibuat.</p>
                </div>
            ) : (
                <div style={styles.cardGrid}>
                    {schedules.map((item) => (
                        <div key={item.id} style={styles.scheduleCard}>
                            
                            {/* Visual Date (Left) */}
                            <div style={styles.dateBox}>
                                <span style={styles.monthText}>{new Date(item.date).toLocaleDateString('id-ID', { month: 'short' }).toUpperCase()}</span>
                                <span style={styles.dayText}>{new Date(item.date).getDate()}</span>
                                <span style={styles.weekdayText}>{new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long' })}</span>
                            </div>

                            {/* Details (Middle) */}
                            <div style={styles.cardDetails}>
                                <div style={styles.timeRow}>
                                    <span style={styles.iconSmall}>🕒</span> 
                                    <span style={styles.timeText}>{item.shift_start.slice(0,5)} - {item.shift_end.slice(0,5)} WIB</span>
                                </div>
                                <div style={styles.quotaRow}>
                                    <span style={styles.iconSmall}>👥</span>
                                    <span>Kuota: <strong>{item.quota} Pasien</strong></span>
                                </div>
                                <div style={item.is_active ? styles.statusActive : styles.statusInactive}>
                                    ● {item.is_active ? 'ACTIVE' : 'CLOSED'}
                                </div>
                            </div>

                            {/* Action (Right) */}
                            <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn} title="Hapus Jadwal">
                                🗑️
                            </button>

                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

// --- STYLES (CLEAN WHITE THEME) ---
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: '#f8fafc', // Putih Abu-abu (Clean Base)
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    padding: '40px 20px',
    position: 'relative',
    overflowX: 'hidden'
  },
  // Ambient Orbs (Subtle)
  ambientLight1: { position: 'fixed', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' },
  ambientLight2: { position: 'fixed', bottom: '-10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' },

  container: { maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 },

  // Header
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' },
  iconBox: { width: '60px', height: '60px', borderRadius: '16px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
  title: { margin: '0 0 5px', fontSize: '1.8rem', color: '#1e293b', fontWeight: '800' },
  subtitle: { margin: 0, color: '#64748b', fontSize: '1rem' },

  // FORM CARD
  formCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '30px',
    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)', // Soft depth shadow
    border: '1px solid #f1f5f9',
    marginBottom: '50px'
  },
  formHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' },
  badgeInfo: { background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '50px', fontWeight: '700' },
  
  formGrid: { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px', flex: 1 },
  label: { fontSize: '0.75rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' },
  inputField: {
    padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc',
    fontSize: '0.95rem', color: '#334155', outline: 'none', transition: '0.2s', width: '100%', boxSizing: 'border-box'
  },
  submitBtn: {
    padding: '12px 24px', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer',
    fontSize: '0.95rem', height: '45px', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
    transition: 'transform 0.2s', flex: 1
  },

  // LIST SECTION
  listSection: { marginTop: '20px' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#334155', marginBottom: '20px' },
  
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  
  // SCHEDULE CARD DESIGN
  scheduleCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden'
  },
  
  // Kotak Tanggal (Visual)
  dateBox: {
    background: '#eff6ff',
    borderRadius: '16px',
    padding: '15px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '70px',
    border: '1px solid #dbeafe'
  },
  monthText: { fontSize: '0.7rem', fontWeight: '800', color: '#3b82f6', marginBottom: '2px' },
  dayText: { fontSize: '1.6rem', fontWeight: '800', color: '#1e3a8a', lineHeight: 1 },
  weekdayText: { fontSize: '0.7rem', fontWeight: '600', color: '#64748b', marginTop: '2px' },

  cardDetails: { flex: 1 },
  timeRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: '800', color: '#334155', marginBottom: '5px' },
  quotaRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#64748b', marginBottom: '10px' },
  iconSmall: { fontSize: '1rem', opacity: 0.8 },
  
  statusActive: { fontSize: '0.75rem', fontWeight: '800', color: '#16a34a', background: '#dcfce7', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' },
  statusInactive: { fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' },

  deleteBtn: {
    background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48',
    width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
    transition: '0.2s'
  },

  emptyState: {
    textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px',
    border: '2px dashed #e2e8f0', color: '#94a3b8'
  }
};

// Inject Hover via JS karena inline style limitation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  div[style*="scheduleCard"]:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08) !important;
    border-color: #cbd5e1 !important;
  }
  button[style*="deleteBtn"]:hover {
    background: #e11d48 !important;
    color: white !important;
  }
`;
document.head.appendChild(styleSheet);

export default ManageSchedule;