import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get('/patients/my-medical-records');
      const sortedData = (response.data.data || []).sort((a, b) => 
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      setRecords(sortedData);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateInfo = (dateString) => {
    if (!dateString) return { full: '-', date: '--', month: '---', time: '--:--' };
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { full: '-', date: '--', month: '---', time: '--:--' };
      return {
          full: date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          date: date.getDate(),
          month: date.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase(),
          time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) 
      };
    } catch (e) { return { full: '-', date: '--', month: '---', time: '--:--' }; }
  };

  // Helper Icon (Sama seperti sebelumnya)
  const getIconByPoli = (poliName, specialization) => {
    const text = `${poliName} ${specialization}`.toLowerCase();
    if (text.includes('saraf') || text.includes('neuro')) return '🧠'; 
    if (text.includes('jantung') || text.includes('cardio')) return '🫀'; 
    if (text.includes('paru')) return '🫁'; 
    if (text.includes('mata')) return '👁️'; 
    if (text.includes('gigi')) return '🦷'; 
    if (text.includes('tulang') || text.includes('ortho')) return '🦴'; 
    if (text.includes('anak') || text.includes('pedia')) return '🧸'; 
    if (text.includes('kandungan') || text.includes('obgyn')) return '🤰'; 
    return '🩺'; 
  };
  
  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  if (loading) return <div style={{padding:40, textAlign:'center', color:'#64748b'}}>Memuat Riwayat...</div>;

  return (
    <div style={styles.pageContainer}>
      
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Timeline Kesehatan</h1>
        <p style={styles.pageSubtitle}>Rekam jejak medis Anda secara detail.</p>
      </div>

      {records.length === 0 && (
        <div style={styles.emptyState}><p>Belum ada riwayat.</p></div>
      )}

      <div style={styles.timelineContainer}>
        {records.length > 0 && <div style={styles.verticalLine}></div>}

        {records.map((item) => {
          const dateInfo = getDateInfo(item.created_at);
          const isOpen = expandedId === item.id;
          
          const doctorObj = item.doctorUser;
          const doctorName = doctorObj ? doctorObj.name : (item.doctor || "Dokter");
          const doctorSpecialization = doctorObj ? doctorObj.specialization : "Umum";
          let displayPoli = item.poli || 'Poli Umum';
          
          const icon = getIconByPoli(displayPoli, doctorSpecialization);

          return (
            <div key={item.id} style={styles.timelineItem}>
              
              <div style={styles.timelineMarker}>
                <div style={isOpen ? styles.iconCircleActive : styles.iconCircle}>{icon}</div>
              </div>

              <div 
                style={{...styles.card, borderColor: isOpen ? '#3b82f6' : 'transparent'}}
                onClick={() => toggleExpand(item.id)}
              >
                {/* HEADER KARTU */}
                <div style={styles.cardHeader}>
                  <div style={isOpen ? styles.dateBadgeActive : styles.dateBadge}>
                    <span style={{fontSize:'0.7rem', fontWeight:'700'}}>{dateInfo.month}</span>
                    <span style={{fontSize:'1.3rem', fontWeight:'800'}}>{dateInfo.date}</span>
                  </div>
                  <div style={{flex: 1}}>
                    <div style={styles.docName}>Dr. {doctorName}</div>
                    <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                        <span style={styles.poliTag}>{displayPoli}</span>
                        <span style={styles.specTag}>{doctorSpecialization}</span>
                    </div>
                  </div>
                  <div style={{color:'#94a3b8', fontSize:'0.85rem'}}>🕒 {dateInfo.time} WIB</div>
                  <div style={{transform: isOpen?'rotate(180deg)':'rotate(0)', transition:'0.3s', color:'#cbd5e1'}}>▼</div>
                </div>

                {/* BODY KARTU: TAMPILAN BARU */}
                {isOpen && (
                  <div style={styles.cardBody}>
                    
                    {/* BAGIAN ATAS: DIAGNOSIS & KELUHAN (Split) */}
                    <div style={styles.topSection}>
                        
                        {/* 1. KELUHAN (Speech Bubble Style) */}
                        <div style={styles.symptomBubble}>
                            <span style={styles.quoteIcon}>❝</span>
                            <p style={styles.symptomText}>{item.symptoms || '-'}</p>
                        </div>

                        {/* 2. DIAGNOSIS (Headline Style) */}
                        <div style={styles.diagnosisContainer}>
                            <span style={styles.labelAccent}>HASIL DIAGNOSIS</span>
                            <h3 style={styles.diagnosisMain}>{item.diagnosis}</h3>
                        </div>
                    </div>

                    <hr style={styles.dashedDivider} />

                    {/* BAGIAN BAWAH: TINDAKAN & OBAT (Grid) */}
                    <div style={styles.bottomGrid}>
                        
                        {/* 3. TINDAKAN (Clean Card) */}
                        <div style={styles.actionCard}>
                            <div style={styles.cardTitleRow}>
                                <span style={styles.iconSmall}>🩺</span> 
                                <span style={styles.cardTitleText}>Tindakan Medis</span>
                            </div>
                            <p style={styles.bodyText}>
                                {item.treatment || "Hanya konsultasi dan pemeriksaan rutin."}
                            </p>
                        </div>

                        {/* 4. RESEP OBAT (Receipt/Tag Style) */}
                        <div style={styles.rxCard}>
                            <div style={styles.cardTitleRow}>
                                <span style={styles.iconSmall}>💊</span>
                                <span style={{...styles.cardTitleText, color:'#047857'}}>Resep & Obat</span>
                            </div>
                            <div style={styles.rxContent}>
                                {item.prescription ? item.prescription : "Tidak ada resep yang diberikan."}
                            </div>
                        </div>

                    </div>

                    {/* 5. CATATAN (Alert Style) */}
                    {item.notes && (
                        <div style={styles.noteAlert}>
                            <span style={{marginRight:8}}>📝</span> 
                            <span style={{fontStyle:'italic'}}>{item.notes}</span>
                        </div>
                    )}

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

// --- STYLES YANG DIPERBAIKI ---
const styles = {
  pageContainer: {
    padding: '40px 20px', maxWidth: '850px', margin: '0 auto', minHeight: '100vh',
    fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8fafc',
  },
  header: { marginBottom: '50px' },
  pageTitle: { margin: '0 0 5px', color: '#0f172a', fontSize: '2rem', fontWeight: '800' },
  pageSubtitle: { color: '#64748b' },
  
  timelineContainer: { position: 'relative', paddingLeft: '20px' },
  verticalLine: {
    position: 'absolute', left: '39px', top: 20, bottom: 0, width: '2px', borderLeft: '2px dashed #cbd5e1', zIndex: 0,
  },
  timelineItem: { position: 'relative', marginBottom: '30px', paddingLeft: '50px' },
  timelineMarker: { position: 'absolute', left: '0', top: '0', width: '40px', height: '40px', zIndex: 2 },
  
  iconCircle: {
    width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: '2px solid #cbd5e1',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: '0.3s'
  },
  iconCircleActive: {
    width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', border: '2px solid #3b82f6',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)', color: 'white', transition: '0.3s'
  },

  card: {
    background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', cursor: 'pointer', overflow: 'hidden', 
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'all 0.3s ease',
  },
  cardHeader: { padding: '20px 25px', display: 'flex', alignItems: 'center', gap: '15px' },
  
  dateBadge: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    background: '#f1f5f9', borderRadius: '12px', color: '#64748b', minWidth: '55px', height: '55px',
  },
  dateBadgeActive: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    background: '#eff6ff', borderRadius: '12px', color: '#3b82f6', minWidth: '55px', height: '55px',
  },
  
  docName: { fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '4px' },
  poliTag: { fontSize: '0.75rem', fontWeight: '700', color: '#0369a1', background: '#e0f2fe', padding: '4px 10px', borderRadius: '6px' },
  specTag: { fontSize: '0.75rem', color: '#475569', background: '#f8fafc', padding: '4px 10px', borderRadius: '6px' },
  
  // --- CARD BODY BARU ---
  cardBody: { 
    padding: '30px', 
    background: '#ffffff', 
    borderTop: '1px solid #f1f5f9',
    animation: 'fadeIn 0.4s ease' 
  },

  // 1. TOP SECTION (Symptom & Diagnosis)
  topSection: {
    display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '25px'
  },
  
  // Speech Bubble Style for Symptoms
  symptomBubble: {
    background: '#f8fafc',
    borderRadius: '0 20px 20px 20px', // Sudut kiri atas tajam (speech bubble)
    padding: '15px 20px',
    position: 'relative',
    border: '1px solid #e2e8f0',
    maxWidth: '90%'
  },
  quoteIcon: {
    fontSize: '2rem', color: '#e2e8f0', position: 'absolute', top: '-10px', left: '10px', lineHeight: 1
  },
  symptomText: {
    margin: 0, color: '#475569', fontStyle: 'italic', fontSize: '0.95rem', lineHeight: '1.5', position: 'relative', zIndex: 1
  },

  // Diagnosis Headline
  diagnosisContainer: {
    paddingLeft: '15px',
    borderLeft: '4px solid #f43f5e'
  },
  labelAccent: {
    fontSize: '0.7rem', fontWeight: '800', color: '#f43f5e', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px', display: 'block'
  },
  diagnosisMain: {
    margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', lineHeight: '1.3'
  },

  dashedDivider: {
    border: 'none', borderTop: '2px dashed #f1f5f9', margin: '0 0 25px 0'
  },

  // 2. BOTTOM GRID (Treatment & Rx)
  bottomGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'
  },

  // Action Card (Clean)
  actionCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '20px',
  },
  // Rx Card (Green Tint)
  rxCard: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '16px',
    padding: '20px',
  },

  cardTitleRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  iconSmall: { fontSize: '1.2rem' },
  cardTitleText: { fontSize: '0.9rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' },
  
  bodyText: { margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: '1.6' },
  rxContent: { margin: 0, color: '#166534', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500' },

  // 3. NOTE ALERT
  noteAlert: {
    marginTop: '20px',
    background: '#fffbeb',
    border: '1px solid #fcd34d',
    color: '#b45309',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'start'
  },

  emptyState: { textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', color: '#94a3b8' }
};

export default MedicalRecords;