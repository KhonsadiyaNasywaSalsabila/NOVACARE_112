import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 

const InputDiagnosis = () => {
  const [queue, setQueue] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    diagnosis: '',
    treatment: '', 
    prescription: '', 
    notes: ''
  });

  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medList, setMedList] = useState([]); 

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000); 
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await api.get('/doctor/queue');
      setQueue(res.data.data || []);
    } catch (error) {
      console.error("Gagal ambil antrean:", error);
    }
  };

  const handleCardClick = (item) => {
    setSelectedAppointment(item.id);
    setPatientData(item);
    setForm({ diagnosis: '', treatment: '', prescription: '', notes: '' });
    setMedList([]); 
  };

  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!medName || !medDose) return;
    const newList = [...medList, { name: medName, dose: medDose }];
    setMedList(newList);
    setMedName('');
    setMedDose('');
    setForm(prev => ({ ...prev, prescription: newList.map(m => `${m.name} (${m.dose})`).join(', ') }));
  };

  const handleRemoveMedicine = (index) => {
    const newList = medList.filter((_, i) => i !== index);
    setMedList(newList);
    setForm(prev => ({ ...prev, prescription: newList.map(m => `${m.name} (${m.dose})`).join(', ') }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return alert("Pilih pasien terlebih dahulu!");
    setLoading(true);
    try {
      await api.post('/doctor/medical-record', {
        appointment_id: selectedAppointment,
        diagnosis: form.diagnosis,
        treatment: form.treatment, 
        prescription: form.prescription,
        notes: form.notes
      });
      alert("✨ Pemeriksaan Selesai!");
      setForm({ diagnosis: '', treatment: '', prescription: '', notes: '' });
      setSelectedAppointment('');
      setPatientData(null);
      setMedList([]);
      fetchQueue(); 
    } catch (error) {
      alert("❌ Gagal: " + (error.response?.data?.message || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* ANIMATED BACKGROUND ELEMENTS */}
      <style>{`
        @keyframes orb-float { 0% { transform: translate(0,0); } 50% { transform: translate(30px, -50px); } 100% { transform: translate(0,0); } }
        .aurora-orb { position: fixed; filter: blur(100px); border-radius: 50%; opacity: 0.4; z-index: 0; animation: orb-float 10s infinite ease-in-out; }
        .glass-card { backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>

      <div className="aurora-orb" style={{ top: '-10%', right: '10%', width: '40vw', height: '40vw', background: '#312e81' }}></div>
      <div className="aurora-orb" style={{ bottom: '-5%', left: '10%', width: '30vw', height: '30vw', background: '#1e1b4b' }}></div>

      <div style={styles.workspace}>
        {/* SIDEBAR: GLASS LIST */}
        <div style={styles.sidebar} className="glass-card">
          <div style={styles.sidebarHeader}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '900' }}>Antrean</h2>
            <div style={styles.activeDot}></div>
          </div>
          
          <div style={styles.queueContainer}>
            {queue.map(item => (
              <div 
                key={item.id} 
                onClick={() => handleCardClick(item)}
                style={{
                  ...styles.patientCard,
                  ...(selectedAppointment === item.id ? styles.cardActive : {})
                }}
              >
                <div style={styles.cardInfo}>
                  <span style={styles.qNumber}>#{item.queue_number}</span>
                  <div style={{ color: '#fff', fontWeight: '800' }}>{item.patient?.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{item.symptoms?.substring(0, 20)}...</div>
                </div>
              </div>
            ))}
            {queue.length === 0 && <div style={styles.emptyMsg}>Tidak ada antrean</div>}
          </div>
        </div>

        {/* MAIN: BENTO FORM */}
        <div style={styles.mainArea}>
          {patientData ? (
            <div style={styles.bentoGrid}>
              {/* PATIENT PROFILE HEADER */}
              <div style={styles.bentoHeader} className="glass-card">
                <div style={styles.avatar}>{patientData.patient?.name.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <h1 style={styles.patientName}>{patientData.patient?.name}</h1>
                  <span style={styles.badge}>⚠️ Keluhan: {patientData.symptoms}</span>
                </div>
                <div style={styles.timer}>AKTIF</div>
              </div>

              {/* INPUT SECTIONS */}
              <form onSubmit={handleSubmit} style={styles.formContent}>
                <div style={styles.row}>
                  <div style={styles.bentoBox} className="glass-card">
                    <label style={styles.label}>📝 Diagnosis Medis</label>
                    <textarea 
                      style={styles.textArea} 
                      placeholder="Masukkan diagnosa..." 
                      value={form.diagnosis}
                      onChange={e => setForm({...form, diagnosis: e.target.value})}
                      required
                    />
                  </div>
                  <div style={styles.bentoBox} className="glass-card">
                    <label style={styles.label}>🛠️ Tindakan / Treatment</label>
                    <textarea 
                      style={styles.textArea} 
                      placeholder="Tindakan medis..." 
                      value={form.treatment}
                      onChange={e => setForm({...form, treatment: e.target.value})}
                    />
                  </div>
                </div>

                <div style={styles.bentoBox} className="glass-card">
                  <label style={styles.label}>💊 Manajemen Resep</label>
                  <div style={styles.medRow}>
                    <input style={styles.input} placeholder="Nama Obat" value={medName} onChange={e => setMedName(e.target.value)} />
                    <input style={styles.input} placeholder="Dosis" value={medDose} onChange={e => setMedDose(e.target.value)} />
                    <button type="button" onClick={handleAddMedicine} style={styles.btnAdd}>+</button>
                  </div>
                  <div style={styles.medBucket}>
                    {medList.map((med, i) => (
                      <div key={i} style={styles.medItem}>
                        <span>{med.name} - {med.dose}</span>
                        <button type="button" onClick={() => handleRemoveMedicine(i)} style={styles.btnDel}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.bentoBox} className="glass-card">
                  <label style={styles.label}>🗒️ Saran & Catatan Tambahan</label>
                  <input style={styles.input} placeholder="Contoh: Istirahat cukup..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                </div>

                <button type="submit" style={styles.btnFinish} disabled={loading}>
                  {loading ? "MENYIMPAN..." : "SIMPAN & SELESAIKAN"}
                </button>
              </form>
            </div>
          ) : (
            <div style={styles.idleState}>
              <h1 style={{ color: '#fff', fontSize: '3rem', opacity: 0.1, fontWeight: 900 }}>READY TO WORK</h1>
              <p style={{ color: '#64748b' }}>Pilih pasien untuk memulai sesi pemeriksaan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- STYLES: HIGH-END CLINIC DESIGN ---
const styles = {
  pageWrapper: { background: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  workspace: { width: '95vw', height: '90vh', display: 'flex', gap: '20px', zIndex: 1 },
  
  sidebar: { flex: '0 0 300px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', padding: '25px', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  activeDot: { width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 15px #10b981' },
  queueContainer: { flex: 1, overflowY: 'auto' },
  patientCard: { padding: '18px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', marginBottom: '15px', cursor: 'pointer', border: '1px solid transparent', transition: '0.3s' },
  cardActive: { background: 'rgba(79, 70, 229, 0.2)', borderColor: '#6366f1', transform: 'scale(1.03)' },
  qNumber: { fontSize: '0.7rem', fontWeight: '900', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 8px', borderRadius: '8px', marginBottom: '8px', display: 'inline-block' },

  mainArea: { flex: 1, position: 'relative' },
  idleState: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  
  bentoGrid: { display: 'flex', flexDirection: 'column', gap: '20px' },
  bentoHeader: { background: 'rgba(30, 41, 59, 0.7)', padding: '25px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid rgba(255,255,255,0.1)' },
  avatar: { width: '60px', height: '60px', borderRadius: '20px', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900' },
  patientName: { margin: 0, color: '#fff', fontSize: '1.6rem', fontWeight: '900' },
  badge: { fontSize: '0.85rem', color: '#f59e0b', fontWeight: '700' },
  timer: { background: '#f43f5e', color: '#fff', padding: '6px 15px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '900' },

  formContent: { display: 'flex', flexDirection: 'column', gap: '20px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  bentoBox: { background: 'rgba(30, 41, 59, 0.5)', padding: '25px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' },
  textArea: { width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', outline: 'none', minHeight: '80px', fontFamily: 'inherit' },
  input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', padding: '15px', borderRadius: '15px', color: '#fff', outline: 'none', fontSize: '1rem' },
  
  medRow: { display: 'flex', gap: '10px', marginBottom: '15px' },
  btnAdd: { background: '#6366f1', color: '#fff', border: 'none', width: '50px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer' },
  medBucket: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  medItem: { background: '#1e1b4b', padding: '10px 15px', borderRadius: '12px', border: '1px solid #312e81', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.9rem' },
  btnDel: { background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontWeight: '900' },
  
  btnFinish: { background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)', color: '#fff', border: 'none', padding: '20px', borderRadius: '20px', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)' },
  emptyMsg: { color: '#475569', textAlign: 'center', marginTop: '50px', fontStyle: 'italic' }
};

export default InputDiagnosis;