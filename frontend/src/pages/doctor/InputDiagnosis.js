import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 

const InputDiagnosis = () => {
  // --- STATE LOGIC ---
  const [queue, setQueue] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [patientData, setPatientData] = useState(null);

  const [form, setForm] = useState({
    diagnosis: '',
    treatment: '', 
    prescription: '', 
    notes: ''
  });

  // State untuk "Keranjang Belanja" Resep Obat
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medList, setMedList] = useState([]); 

  // 1. Fetch Queue
  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await api.get('/doctor/queue');
      setQueue(res.data.data || []);
    } catch (error) {
      console.error("Gagal ambil antrian:", error);
    }
  };

  // --- HELPER: FORMAT JAM (FIX JAM BERGERAK) ---
  const formatTime = (dateString) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit', 
            minute: '2-digit'
        });
    } catch (e) {
        return '-';
    }
  };

  // 2. Handle Select Patient
  const handleCardClick = (item) => {
    setSelectedAppointment(item.id);
    setPatientData(item);
    
    // Reset form saat ganti pasien
    setForm({ diagnosis: '', treatment: '', prescription: '', notes: '' });
    setMedList([]); 
  };

  // 3. Logic Tambah Obat
  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!medName || !medDose) return;

    const newItem = { name: medName, dose: medDose };
    const newList = [...medList, newItem];
    setMedList(newList);
    setMedName('');
    setMedDose('');

    const prescriptionString = newList.map(m => `${m.name} (${m.dose})`).join(', ');
    setForm(prev => ({ ...prev, prescription: prescriptionString }));
  };

  const handleRemoveMedicine = (index) => {
    const newList = medList.filter((_, i) => i !== index);
    setMedList(newList);
    const prescriptionString = newList.map(m => `${m.name} (${m.dose})`).join(', ');
    setForm(prev => ({ ...prev, prescription: prescriptionString }));
  };

  // 4. Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return alert("Harap pilih pasien terlebih dahulu!");

    try {
      await api.post('/doctor/medical-record', {
        appointment_id: selectedAppointment,
        diagnosis: form.diagnosis,
        treatment: form.treatment, 
        prescription: form.prescription,
        notes: form.notes
      });
      
      alert("✅ Pemeriksaan Selesai!");
      
      // Reset All
      setForm({ diagnosis: '', treatment: '', prescription: '', notes: '' });
      setSelectedAppointment('');
      setPatientData(null);
      setMedList([]);
      fetchQueue(); 
    } catch (error) {
      alert("Gagal menyimpan: " + (error.response?.data?.message || "Terjadi kesalahan"));
    }
  };

  return (
    <div style={styles.workspaceContainer}>
      
      {/* --- SIDEBAR: WAITING LIST (30%) --- */}
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
                        <span style={isActive ? styles.queueNumActive : styles.queueNum}>
                            #{item.queue_number}
                        </span>
                        
                        {/* --- PERBAIKAN: MENAMPILKAN JAM CHECK-IN DARI DB --- */}
                        <span style={{fontSize:'0.8rem', color: isActive?'white':'#94a3b8', fontWeight:'bold'}}>
                            {item.check_in_time ? formatTime(item.check_in_time) : "Belum Check-in"}
                        </span>
                    </div>
                    <div style={{fontWeight:'bold', fontSize:'1.1rem', marginBottom:'5px'}}>
                        {item.patient?.name}
                    </div>
                    <div style={{fontSize:'0.85rem', opacity:0.8}}>
                        {item.symptoms ? item.symptoms.substring(0, 30)+"..." : "Tidak ada keluhan awal"}
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={styles.emptyQueue}>
                  ☕ Tidak ada pasien antre.
              </div>
            )}
        </div>
      </div>

      {/* --- MAIN: EXAMINATION EDITOR (70%) --- */}
      <div style={styles.mainContent}>
        
        {/* HEADER PASIEN AKTIF */}
        {patientData ? (
            <>
                <div style={styles.patientHeader}>
                    <div style={styles.avatarPlaceholder}>{patientData.patient?.name.charAt(0)}</div>
                    <div>
                        <h2 style={{margin:0, color:'#1e293b'}}>{patientData.patient?.name}</h2>
                        <div style={styles.symptomBadge}>
                            ⚠️ Keluhan: "{patientData.symptoms}"
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={styles.editorForm}>
                    
                    {/* SECTION 1: DIAGNOSIS */}
                    <div style={styles.formSection}>
                        <label style={styles.label}>📝 Diagnosis Dokter</label>
                        <textarea 
                            rows="2"
                            placeholder="Ketik diagnosis utama (misal: Hipertensi Grade 1)..."
                            value={form.diagnosis}
                            onChange={e => setForm({...form, diagnosis: e.target.value})}
                            style={styles.inputArea}
                            required
                        />
                        <div style={styles.chipContainer}>
                            {['Demam Berdarah', 'ISPA', 'Dispepsia', 'Migrain', 'Hipertensi'].map(tag => (
                                <span 
                                    key={tag} 
                                    style={styles.chip}
                                    onClick={() => setForm(prev => ({...prev, diagnosis: prev.diagnosis ? prev.diagnosis + ', ' + tag : tag}))}
                                >
                                    + {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 2: TINDAKAN (TREATMENT) */}
                    <div style={styles.formSection}>
                        <label style={styles.label}>🛠️ Tindakan Medis (Treatment)</label>
                        <textarea 
                            rows="2"
                            placeholder="Tindakan yang dilakukan (misal: Nebulizer, Jahit Luka)..."
                            value={form.treatment}
                            onChange={e => setForm({...form, treatment: e.target.value})}
                            style={styles.inputArea}
                        />
                        <div style={styles.chipContainer}>
                            {['Nebulizer', 'Pemberian Oksigen', 'Rawat Luka', 'Suntik Vitamin', 'EKG'].map(tag => (
                                <span 
                                    key={tag} 
                                    style={{...styles.chip, background: '#e0e7ff', color: '#4338ca', borderColor: '#c7d2fe'}} 
                                    onClick={() => setForm(prev => ({...prev, treatment: prev.treatment ? prev.treatment + ', ' + tag : tag}))}
                                >
                                    + {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 3: RESEP */}
                    <div style={styles.formSection}>
                        <label style={styles.label}>💊 Resep Obat</label>
                        
                        <div style={styles.medInputGroup}>
                            <input 
                                type="text" 
                                placeholder="Nama Obat" 
                                value={medName}
                                onChange={e => setMedName(e.target.value)}
                                style={{...styles.inputShort, flex: 2}}
                            />
                            <input 
                                type="text" 
                                placeholder="Dosis (3x1)" 
                                value={medDose}
                                onChange={e => setMedDose(e.target.value)}
                                style={{...styles.inputShort, flex: 1}}
                            />
                            <button 
                                onClick={handleAddMedicine}
                                style={styles.btnAddMed}
                                type="button" 
                            >
                                + Tambah
                            </button>
                        </div>

                        <div style={styles.medListContainer}>
                            {medList.length === 0 && (
                                <div style={{color:'#94a3b8', fontStyle:'italic', padding:'10px'}}>Belum ada obat ditambahkan.</div>
                            )}
                            {medList.map((med, idx) => (
                                <div key={idx} style={styles.medItem}>
                                    <div><strong>{med.name}</strong> <span style={{color:'#64748b'}}>({med.dose})</span></div>
                                    <button type="button" onClick={() => handleRemoveMedicine(idx)} style={styles.btnRemove}>✕</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 4: NOTES */}
                    <div style={styles.formSection}>
                        <label style={styles.label}>🗒️ Catatan / Saran</label>
                        <input 
                            type="text"
                            placeholder="Saran untuk pasien (misal: Perbanyak minum air putih)..."
                            value={form.notes}
                            onChange={e => setForm({...form, notes: e.target.value})}
                            style={styles.inputShort}
                        />
                    </div>

                    {/* ACTION BUTTON */}
                    <div style={styles.actionFooter}>
                        <button type="submit" style={styles.btnSubmit}>
                            ✅ Simpan & Selesai
                        </button>
                    </div>

                </form>
            </>
        ) : (
            <div style={styles.emptyState}>
                <div style={{fontSize:'4rem'}}>👈</div>
                <h3>Pilih Pasien dari Daftar Antrean</h3>
                <p>Klik kartu pasien di sebelah kiri untuk memulai pemeriksaan.</p>
            </div>
        )}
      </div>

    </div>
  );
};

// --- STYLES ---
const styles = {
  workspaceContainer: {
    display: 'flex', height: '100vh', background: '#f1f5f9', fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: 'hidden',
  },
  sidebar: {
    flex: '0 0 320px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column',
  },
  sidebarHeader: {
    padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  badgeCount: {
    background: '#e0f2fe', color: '#0ea5e9', fontSize:'0.75rem', fontWeight:'bold', padding:'4px 8px', borderRadius:'12px'
  },
  cardList: {
    flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px'
  },
  patientCard: {
    background: 'white', borderRadius: '12px', padding: '15px', border: '1px solid #f1f5f9',
    boxShadow: '0 2px 5px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.2s',
  },
  patientCardActive: {
    background: '#2563eb', color: 'white', border: '1px solid #2563eb',
    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)', transform: 'scale(1.02)',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  queueNum: { background: '#f1f5f9', color: '#64748b', padding:'2px 8px', borderRadius:'6px', fontWeight:'bold', fontSize:'0.8rem' },
  queueNumActive: { background: 'rgba(255,255,255,0.2)', color: 'white', padding:'2px 8px', borderRadius:'6px', fontWeight:'bold', fontSize:'0.8rem' },
  emptyQueue: { textAlign: 'center', marginTop: '50px', color: '#94a3b8' },
  mainContent: {
    flex: 1, overflowY: 'auto', padding: '40px', display: 'flex', flexDirection: 'column',
  },
  patientHeader: {
    display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px',
    background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
  },
  avatarPlaceholder: {
    width: '60px', height: '60px', borderRadius: '50%', background: '#e2e8f0', color: '#64748b',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold'
  },
  symptomBadge: {
    marginTop: '5px', display: 'inline-block', background: '#fef3c7', color: '#d97706', 
    padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600'
  },
  editorForm: {
    background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  },
  formSection: { marginBottom: '25px' },
  label: {
    display: 'block', fontWeight: '700', color: '#334155', marginBottom: '10px', fontSize: '0.95rem'
  },
  inputArea: {
    width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', 
    fontSize: '1rem', fontFamily: 'inherit', minHeight: '80px', resize: 'vertical', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box'
  },
  inputShort: {
    width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e2e8f0', 
    fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
  },
  chipContainer: { display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' },
  chip: {
    background: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '20px',
    fontSize: '0.85rem', cursor: 'pointer', border: '1px solid #e2e8f0', transition: '0.2s'
  },
  medInputGroup: { display: 'flex', gap: '10px', marginBottom: '15px' },
  btnAddMed: {
    padding: '0 20px', background: '#3b82f6', color: 'white', border: 'none',
    borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'
  },
  medListContainer: {
    border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '15px', background: '#f8fafc', minHeight: '50px'
  },
  medItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'white', padding: '10px 15px', borderRadius: '8px', marginBottom: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
  },
  btnRemove: { background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' },
  actionFooter: { marginTop: '20px', textAlign: 'right' },
  btnSubmit: {
    padding: '15px 30px', background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    color: 'white', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: 'bold', 
    cursor: 'pointer', boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)', transition: 'transform 0.2s'
  },
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '100%', color: '#cbd5e1', textAlign: 'center'
  }
};

export default InputDiagnosis;