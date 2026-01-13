import React, { useState, useEffect } from 'react';
import api from '../services/api'; 

const ApiKeyManager = () => {
  // --- STATE LOGIC (TIDAK BERUBAH) ---
  const [keys, setKeys] = useState([]);
  const [labelInput, setLabelInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [permissions, setPermissions] = useState({
    read_resep: false,
    read_jadwal: false
  });

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await api.get('/keys/list');
      setKeys(res.data.data || []);
    } catch (error) {
      console.error("Gagal ambil data key");
    }
  };

  const togglePermission = (name) => {
    setPermissions(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleGenerate = async () => {
    if (!labelInput) return alert("Beri nama label mitra dulu!");

    const selectedPerms = Object.keys(permissions).filter(key => permissions[key]);
    
    if (selectedPerms.length === 0) {
      if(!window.confirm("Key ini tidak punya izin akses apapun. Yakin buat?")) return;
    }

    setLoading(true);
    try {
      await api.post('/keys/generate', { 
        label: labelInput,
        permissions: selectedPerms 
      });
      
      setLabelInput('');
      setPermissions({ read_resep: false, read_jadwal: false });
      fetchKeys();
      alert("Sukses membuat Key Mitra!");
    } catch (error) {
      alert("Gagal: " + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  const handleRevoke = async (id) => {
    if(!window.confirm("Hapus key ini? Mitra akan kehilangan akses.")) return;
    try {
      await api.delete(`/keys/${id}`);
      fetchKeys();
    } catch (error) {
      alert("Gagal hapus key");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("API Key disalin ke clipboard!");
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .pulse-active { animation: pulse-green 2s infinite; }
      `}</style>

      {/* WRAPPER LAYOUT: SIDE BY SIDE */}
      <div style={styles.layoutWrapper}>
        
        {/* --- KOLOM KIRI: FORM INPUT --- */}
        <div style={styles.leftColumn}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h3>🔑 Buat Akses Baru</h3>
              <p style={{margin:0, color:'#64748b', fontSize:'0.9rem'}}>Isi detail mitra untuk mendapatkan kunci akses.</p>
            </div>

            {/* Input Nama Mitra */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nama Mitra / Aplikasi</label>
              <input 
                type="text" 
                placeholder="Contoh: Apotek Sehat Jaya" 
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* Input Hak Akses */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Hak Akses Data</label>
              <div style={styles.permissionContainer}>
                
                <div 
                  style={permissions.read_resep ? styles.permPillActive : styles.permPill}
                  onClick={() => togglePermission('read_resep')}
                >
                  <span style={{fontSize:'1.2rem'}}>💊</span>
                  <div>
                    <strong>Lihat Resep</strong>
                    <div style={{fontSize:'0.75rem', opacity:0.8}}>Akses data obat</div>
                  </div>
                  <div style={styles.checkboxMock}>{permissions.read_resep && '✓'}</div>
                </div>

                <div 
                  style={permissions.read_jadwal ? styles.permPillActive : styles.permPill}
                  onClick={() => togglePermission('read_jadwal')}
                >
                  <span style={{fontSize:'1.2rem'}}>📅</span>
                  <div>
                    <strong>Lihat Jadwal</strong>
                    <div style={{fontSize:'0.75rem', opacity:0.8}}>Sinkronisasi waktu</div>
                  </div>
                  <div style={styles.checkboxMock}>{permissions.read_jadwal && '✓'}</div>
                </div>

              </div>
            </div>

            <button onClick={handleGenerate} disabled={loading} style={styles.generateBtn}>
              {loading ? "Memproses..." : "✨ Generate API Key"}
            </button>
          </div>
        </div>

        {/* --- KOLOM KANAN: LIST KARTU --- */}
        <div style={styles.rightColumn}>
          <h4 style={{margin: '0 0 20px', color: '#334155'}}>Daftar Kunci Aktif ({keys.length})</h4>
          
          <div style={styles.gridList}>
            {keys.length === 0 && (
              <div style={styles.emptyState}>
                <p>Belum ada API Key dibuat.</p>
                <small>Isi formulir di sebelah kiri untuk membuat key baru.</small>
              </div>
            )}
            
            {keys.map((item) => (
              <div key={item.id} style={styles.keyCard}>
                {/* Header Card */}
                <div style={styles.cardHeader}>
                  <div style={styles.chipImage}>
                    <div style={styles.chipLine}></div><div style={styles.chipLine}></div>
                  </div>
                  <div style={styles.statusBadge}>
                    <div className="pulse-active" style={styles.greenDot}></div> ACTIVE
                  </div>
                </div>

                {/* Body Card */}
                <div style={styles.cardBody}>
                  <div style={styles.partnerLabel}>{item.label}</div>
                  <div style={styles.codeBox} onClick={() => copyToClipboard(item.key)} title="Klik untuk salin">
                    {item.key.substring(0, 20)}...
                    <span style={{float:'right', opacity:0.5}}>📋</span>
                  </div>
                </div>

                {/* Footer Card */}
                <div style={styles.cardFooter}>
                  <div style={styles.tags}>
                    {item.permissions && JSON.parse(JSON.stringify(item.permissions)).map(p => (
                      <span key={p} style={styles.miniTag}>
                        {p.replace('read_', '').toUpperCase()}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => handleRevoke(item.id)} style={styles.btnDanger}>
                    REVOKE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { width: '100%', maxWidth: '1200px', margin: '0 auto' }, // Lebar container max diperbesar

  // LAYOUT GRID UTAMA
  layoutWrapper: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap', // Agar responsif di HP (turun ke bawah)
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: '1',
    minWidth: '350px', // Lebar minimal form
  },
  rightColumn: {
    flex: '1.2', // Kolom kanan sedikit lebih lebar
    minWidth: '350px',
  },

  // --- FORM STYLES ---
  formCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    border: '1px solid #f1f5f9',
    position: 'sticky', // Agar form tetap terlihat saat scroll list panjang
    top: '20px', 
  },
  formHeader: { marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '8px', fontSize: '0.9rem' },
  input: {
    width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0',
    fontSize: '1rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box'
  },
  
  // Permission Pills
  permissionContainer: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  permPill: {
    flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '12px',
    border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', transition: '0.2s',
    background: '#f8fafc', color: '#64748b'
  },
  permPillActive: {
    flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '12px',
    border: '2px solid #6366f1', borderRadius: '12px', cursor: 'pointer', transition: '0.2s',
    background: '#eef2ff', color: '#4338ca'
  },
  checkboxMock: {
    marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '6px',
    border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.7rem', fontWeight: 'bold'
  },

  generateBtn: {
    width: '100%', padding: '16px', borderRadius: '50px', border: 'none',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white', fontWeight: '800', fontSize: '1rem', cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(79, 70, 229, 0.3)', marginTop: '10px'
  },

  // --- LIST / CARD STYLES ---
  gridList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  
  // Futuristic Card
  keyCard: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', // Dark
    borderRadius: '16px',
    padding: '25px',
    color: 'white',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex', flexDirection: 'column', gap: '15px'
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' },
  
  chipImage: {
    width: '40px', height: '28px', borderRadius: '4px',
    background: 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)',
    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)'
  },
  chipLine: { width: '100%', height: '1px', background: 'rgba(0,0,0,0.2)', marginTop: '6px' },
  
  statusBadge: { display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px' },
  greenDot: { width: '6px', height: '6px', background: '#34d399', borderRadius: '50%' },

  cardBody: { display: 'flex', flexDirection: 'column', gap: '5px' },
  partnerLabel: { fontSize: '1.2rem', fontWeight: 'bold', color: 'white' },
  codeBox: {
    background: 'rgba(0,0,0,0.3)', color: '#cbd5e1', padding: '12px',
    borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.95rem',
    cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
    transition: 'background 0.2s', display:'flex', justifyContent:'space-between'
  },

  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
  tags: { display: 'flex', gap: '5px' },
  miniTag: {
    fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px',
    borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px'
  },
  btnDanger: {
    background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.5)',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold',
    transition: '0.2s'
  },
  emptyState: {
    textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px',
    color: '#94a3b8', fontStyle: 'italic', border: '1px dashed #cbd5e1'
  }
};

export default ApiKeyManager;