import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// SESUAIKAN PORT DENGAN BACKEND ANDA
const BASE_URL = "http://localhost:3009"; 
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";

const PublicSchedule = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // --- 1. FETCH DATA ---
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/patients/public-schedules`);
      setSchedules(response.data.data || []);
    } catch (err) {
      console.error("Gagal ambil jadwal:", err);
      setError("Gagal memuat data jadwal dokter.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. DATA PROCESSING ---
  const groupedDoctors = useMemo(() => {
    const groups = {};
    schedules.forEach(item => {
      const docId = item.doctor?.id;
      if (!docId) return;

      if (!groups[docId]) {
        groups[docId] = {
          id: docId,
          name: item.doctor?.name || "Dokter",
          specialization: item.doctor?.specialization || "Umum",
          image: item.doctor?.image,
          slots: []
        };
      }
      
      groups[docId].slots.push({
        id: item.id,
        date: item.date,
        day: new Date(item.date).toLocaleDateString('id-ID', { weekday: 'short' }),
        fullDate: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        time: `${item.shift_start.slice(0, 5)} - ${item.shift_end.slice(0, 5)}`,
        quota: item.quota,
        isFull: item.is_full
      });
    });
    return Object.values(groups);
  }, [schedules]);

  // --- 3. FILTER LOGIC (DIPERBARUI) ---
  const filteredDoctors = groupedDoctors.filter(doc => {
    const docName = doc.name.toLowerCase();
    const docSpec = (doc.specialization || "").toLowerCase();
    const searchLow = searchTerm.toLowerCase();

    // Logic Pencarian (Nama atau Spesialisasi)
    const matchSearch = docName.includes(searchLow) || docSpec.includes(searchLow);

    // Logic Kategori
    let matchCat = false;
    if (selectedCategory === 'Semua') {
        matchCat = true;
    } else if (selectedCategory === 'Saraf') {
        // PERUBAHAN DISINI: 
        // Mencocokkan "saraf", "syaraf", "sp.s" (gelar), "sp.bs" (bedah syaraf), atau "neurolog"
        matchCat = docSpec.includes('saraf') || 
                   docSpec.includes('syaraf') || 
                   docSpec.includes('neurolog') ||
                   docName.includes('sp.s') || 
                   docName.includes('sp.bs');
    } else {
        // Untuk kategori lain (Umum, Anak, dll)
        matchCat = docSpec.includes(selectedCategory.toLowerCase());
    }

    return matchCat && matchSearch;
  });

  // --- 4. LIST KATEGORI (GIGI DIUBAH JADI SARAF) ---
  const categories = ['Semua', 'Umum', 'Saraf', 'Jantung', 'Anak', 'Penyakit Dalam'];

  return (
    <div style={styles.pageContainer}>
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.contentWrapper}>
        
        {/* HEADER SECTION */}
        <div style={styles.header}>
          <h1 style={styles.title}>Jadwal Praktik Dokter</h1>
          <p style={styles.subtitle}>Cek jadwal, kuota, dan booking antrean secara real-time.</p>

          {/* SEARCH BAR */}
          <div style={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Cari nama dokter..." 
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>

          {/* FILTER CHIPS */}
          <div style={styles.categoryScroll}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  ...styles.categoryPill,
                  background: selectedCategory === cat ? '#2563eb' : 'white',
                  color: selectedCategory === cat ? 'white' : '#64748b',
                  borderColor: selectedCategory === cat ? '#2563eb' : 'transparent',
                  boxShadow: selectedCategory === cat ? '0 4px 12px rgba(37, 99, 235, 0.3)' : '0 2px 5px rgba(0,0,0,0.05)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        {loading && <div style={{textAlign:'center', padding:50}}>Memuat Data...</div>}
        {error && <div style={{textAlign:'center', color:'red'}}>{error}</div>}

        {!loading && !error && (
          <div style={styles.grid}>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map(doc => {
                let imgUrl = DEFAULT_AVATAR;
                if (doc.image) {
                    imgUrl = `${BASE_URL}/uploads/doctors/${doc.image}`;
                }

                return (
                  <div key={doc.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <img 
                        src={imgUrl} 
                        alt={doc.name} 
                        style={styles.avatar}
                        onError={(e) => e.target.src = DEFAULT_AVATAR}
                      />
                      <div>
                        <h3 style={styles.docName}>{doc.name}</h3>
                        <span style={styles.docSpec}>{doc.specialization}</span>
                      </div>
                    </div>

                    <hr style={styles.divider} />

                    <div style={styles.ticketList}>
                      <span style={styles.ticketLabel}>Jadwal Tersedia:</span>
                      {doc.slots.map((slot) => {
                        let quotaColor = '#10b981';
                        let quotaBg = '#d1fae5';
                        let labelStatus = `Kapasitas: ${slot.quota}`;

                        if (slot.isFull || slot.quota === 0) {
                            quotaColor = '#ef4444'; quotaBg = '#fee2e2'; labelStatus = 'Penuh';
                        } else if (slot.quota <= 5) {
                            quotaColor = '#f59e0b'; quotaBg = '#fef3c7'; labelStatus = `Sisa ${slot.quota}`;
                        }

                        return (
                          <div key={slot.id} style={styles.ticket}>
                            <div style={styles.ticketDate}>
                              <span style={styles.dateNum}>{slot.fullDate}</span>
                              <span style={styles.dayName}>{slot.day}</span>
                            </div>
                            <div style={styles.ticketTime}>🕒 {slot.time}</div>
                            <div style={{...styles.ticketBadge, background: quotaBg, color: quotaColor}}>
                              {labelStatus}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button onClick={() => navigate('/login')} style={styles.bookBtn}>
                      Login untuk Booking &rarr;
                    </button>
                  </div>
                );
              })
            ) : (
               <div style={{gridColumn: '1/-1', textAlign:'center', color:'#64748b', marginTop: 50}}>
                 Tidak ada dokter yang sesuai dengan kriteria <strong>"{selectedCategory}"</strong>.
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  pageContainer: { minHeight: '100vh', background: '#f8fafc', position: 'relative', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '80px', overflowX: 'hidden' },
  blob1: { position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 },
  blob2: { position: 'absolute', top: '20%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 },
  contentWrapper: { position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
  
  header: { textAlign: 'center', marginBottom: '50px' },
  title: { fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' },
  subtitle: { color: '#64748b', fontSize: '1.1rem', marginBottom: '30px' },
  
  searchContainer: { position: 'relative', maxWidth: '500px', margin: '0 auto 25px' },
  searchInput: { width: '100%', padding: '16px 50px 16px 25px', borderRadius: '50px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' },
  searchIcon: { position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', color: '#94a3b8' },
  
  categoryScroll: { display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' },
  categoryPill: { padding: '10px 24px', borderRadius: '50px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.3s ease' },
  
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' },
  card: { background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', borderRadius: '24px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.02), 0 10px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  docName: { margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: '700' },
  docSpec: { fontSize: '0.9rem', color: '#0ea5e9', fontWeight: '600' },
  divider: { border: 'none', borderTop: '1px solid #f1f5f9', margin: '0 0 15px 0' },
  
  ticketList: { flex: 1, marginBottom: '20px' },
  ticketLabel: { display: 'block', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase' },
  ticket: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 15px', borderRadius: '16px', marginBottom: '10px', border: '1px dashed #cbd5e1' },
  ticketDate: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '50px' },
  dateNum: { fontSize: '0.95rem', fontWeight: '800', color: '#334155' },
  dayName: { fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' },
  ticketTime: { fontSize: '0.9rem', color: '#475569', fontWeight: '500' },
  ticketBadge: { padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', minWidth: '70px', textAlign: 'center' },
  
  bookBtn: { width: '100%', padding: '14px', borderRadius: '12px', background: 'white', color: '#2563eb', border: '2px solid #2563eb', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s' }
};

export default PublicSchedule;