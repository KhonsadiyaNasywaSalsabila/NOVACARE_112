import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 

const InputDiagnosis = () => {
  // --- STATE MANAGEMENT ---
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

  // State untuk Manajemen Resep (Temporary List)
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medList, setMedList] = useState([]); 

  // --- 1. EFFECT: AUTO-POLLING ANTREAN ---
  useEffect(() => {
    fetchQueue();
    // Cek pasien baru yang check-in setiap 10 detik tanpa refresh halaman
    const interval = setInterval(() => {
      fetchQueue();
    }, 10000); 

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

  // --- 2. HELPERS ---
  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleCardClick = (item) => {
    setSelectedAppointment(item.id);
    setPatientData(item);
    // Reset form & resep saat berpindah pasien
    setForm({ diagnosis: '', treatment: '', prescription: '', notes: '' });
    setMedList([]); 
  };

  // --- 3. LOGIKA RESEP OBAT ---
  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!medName || !medDose) return;

    const newList = [...medList, { name: medName, dose: medDose }];
    setMedList(newList);
    setMedName('');
    setMedDose('');

    // Gabungkan list menjadi string untuk dikirim ke database
    const prescriptionString = newList.map(m => `${m.name} (${m.dose})`).join(', ');
    setForm(prev => ({ ...prev, prescription: prescriptionString }));
  };

  const handleRemoveMedicine = (index) => {
    const newList = medList.filter((_, i) => i !== index);
    setMedList(newList);
    const prescriptionString = newList.map(m => `${m.name} (${m.dose})`).join(', ');
    setForm(prev => ({ ...prev, prescription: prescriptionString }));
  };

  // --- 4. SUBMIT PEMERIKSAAN ---
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
      
      alert("✨ Pemeriksaan Selesai & Data Berhasil Disimpan!");
      
      // Reset State & Refresh Antrean
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
    <div style={styles.workspaceContainer}>
      
      {/* SIDEBAR: DAFTAR ANTREAN (WAITING) */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
            <h3 style={{margin:0, color:'#1e293b'}}>Antrean Pasien</h3>
            <span style={styles.badgeCount}>{queue.length} Menunggu</span>
        </div>

        <div style={styles.cardList}>
            {queue.length > 0 ? (
              queue.map(item => {
                const isActive = selectedAppointment === item.id;
                return (
                  <div 
                    key={item.id} 
                    onClick={() => handleCardClick(item)}
                    style={{
                        ...styles.patientCard,
                        ...(isActive ? styles.patientCardActive : {})
                    }}
                  >
                    <div style={styles.cardTop}>
                        <span style={isActive ? styles.queueNumActive : styles.queueNum}>#{item.queue_number}</span>
                        <span style={{fontSize:'0.75rem', color: isActive?'white':'#94a3b8', fontWeight:'bold'}}>
                            {item.check_in_time ? formatTime(item.check_in_time) : "Check-in Baru"}
                        </span>
                    </div>
                    <div style={{fontWeight:'800', fontSize:'1rem', marginBottom:'4px'}}>{item.patient?.name}</div>
                    <div style={{fontSize:'0.8rem', opacity:0.8, fontStyle: 'italic'}}>
                        "{item.symptoms || 'Tidak ada keluhan tertulis'}"
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={styles.emptyQueue}>☕ Tidak ada pasien di ruang tunggu.</div>
            )}
        </div>
      </div>

      {/* MAIN CONTENT: EDITOR MEDIS */}
      <div style={styles.mainContent}>
        {patientData ? (
            <div style={{ maxWidth: '850px' }}>
                <div style={styles.patientHeader}>
                    <div style={styles.avatar}>{patientData.patient?.name.charAt(0)}</div>
                    <div>
                        <h2 style={{margin:0, color:'#0f172a'}}>{patientData.patient?.name}</h2>
                        <div style={styles.symptomBadge}>⚠️ Keluhan Awal: {patientData.symptoms}</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={styles.bentoForm}>
                    <div style={styles.formGrid}>
                        {/* DIAGNOSIS */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>📝 DIAGNOSIS UTAMA</label>
                            <textarea 
                                rows="3"
                                placeholder="Tulis diagnosa medis..."
                                value={form.diagnosis}
                                onChange={e => setForm({...form, diagnosis: e.target.value})}
                                style={styles.textArea}
                                required
                            />
                        </div>

                        {/* TINDAKAN */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>🛠️ TINDAKAN (TREATMENT)</label>
                            <textarea 
                                rows="3"
                                placeholder="Tindakan yang diberikan..."
                                value={form.treatment}
                                onChange={e => setForm({...form, treatment: e.target.value})}
                                style={styles.textArea}
                            />
                        </div>
                    </div>

                    {/* RESEP OBAT (INTERAKTIF) */}
                    <div style={{marginTop: '30px'}}>
                        <label style={styles.label}>💊 INPUT RESEP OBAT</label>
                        <div style={styles.medInputs}>
                            <input type="text" placeholder="Nama Obat" value={medName} onChange={e => setMedName(e.target.value)} style={styles.input} />
                            <input type="text" placeholder="Dosis (3x1)" value={medDose} onChange={e => setMedDose(e.target.value)} style={styles.input} />
                            <button onClick={handleAddMedicine} style={styles.btnAddMed} type="button">+ Tambah</button>
                        </div>

                        <div style={styles.medBucket}>
                            {medList.map((med, idx) => (
                                <div key={idx} style={styles.medItem}>
                                    <span><strong>{med.name}</strong> — {med.dose}</span>
                                    <button type="button" onClick={() => handleRemoveMedicine(idx)} style={styles.btnRemove}>✕</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={{...styles.label, marginTop: '25px'}}>🗒️ CATATAN TAMBAHAN</label>
                        <input type="text" placeholder="Saran/catatan untuk pasien..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={styles.input} />
                    </div>

                    <button type="submit" disabled={loading} style={styles.btnSubmit}>
                        {loading ? "MENYIMPAN..." : "SELESAIKAN PEMERIKSAAN"}
                    </button>
                </form>
            </div>
        ) : (
            <div style={styles.emptyState}>
                <div style={{fontSize:'5rem'}}>🩺</div>
                <h2>Siap Memulai Pemeriksaan?</h2>
                <p>Pilih pasien yang berada di <b>Daftar Antrean</b> untuk mulai mengisi rekam medis.</p>
            </div>
        )}
      </div>
    </div>
  );
};

// --- MODERN STYLES ---
const styles = {
  workspaceContainer: { display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden' },
  sidebar: { flex: '0 0 350px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { padding: '25px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badgeCount: { background: '#fef2f2', color: '#ef4444', fontSize:'0.7rem', fontWeight:'900', padding:'5px 12px', borderRadius:'20px' },
  cardList: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' },
  patientCard: { background: 'white', borderRadius: '18px', padding: '18px', border: '1px solid #f1f5f9', cursor: 'pointer', transition: '0.3s' },
  patientCardActive: { background: '#4f46e5', color: 'white', transform: 'translateX(10px)', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.2)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  queueNum: { background: '#f1f5f9', color: '#64748b', padding:'3px 10px', borderRadius:'8px', fontWeight:'800', fontSize:'0.75rem' },
  queueNumActive: { background: 'rgba(255,255,255,0.2)', color: 'white', padding:'3px 10px', borderRadius:'8px', fontWeight:'800', fontSize:'0.75rem' },
  emptyQueue: { textAlign: 'center', marginTop: '100px', color: '#94a3b8', fontStyle: 'italic' },
  
  mainContent: { flex: 1, overflowY: 'auto', padding: '50px', display: 'flex', justifyContent: 'center' },
  patientHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '35px', background: 'white', padding: '25px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' },
  avatar: { width: '60px', height: '60px', borderRadius: '20px', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' },
  symptomBadge: { marginTop: '8px', background: '#fffbeb', color: '#b45309', padding: '6px 14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid #fef3c7' },
  
  bentoForm: { background: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { fontSize: '0.75rem', fontWeight: '800', color: '#64748b', letterSpacing: '1px' },
  textArea: { padding: '15px', borderRadius: '16px', border: '2px solid #f1f5f9', fontSize: '1rem', outline: 'none', transition: '0.3s', focus: { borderColor: '#4f46e5' } },
  input: { padding: '12px 18px', borderRadius: '14px', border: '2px solid #f1f5f9', fontSize: '1rem', width: '100%' },
  
  medInputs: { display: 'flex', gap: '10px', marginBottom: '20px' },
  btnAddMed: { background: '#0f172a', color: 'white', border: 'none', padding: '0 25px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer' },
  medBucket: { background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '2px dashed #e2e8f0', minHeight: '60px' },
  medItem: { display: 'flex', justifyContent: 'space-between', background: 'white', padding: '12px 18px', borderRadius: '12px', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
  btnRemove: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' },
  
  btnSubmit: { width: '100%', marginTop: '40px', background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', color: 'white', border: 'none', padding: '18px', borderRadius: '18px', fontSize: '1rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 15px 30px rgba(79, 70, 229, 0.3)' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#cbd5e1' }
};

export default InputDiagnosis;