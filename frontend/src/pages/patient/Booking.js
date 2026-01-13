import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api'; 

const BASE_URL = "http://localhost:3009"; 
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";

const Booking = () => {
  const [rawSchedules, setRawSchedules] = useState([]); 
  const [loadingFetch, setLoadingFetch] = useState(true);
  
  // State UI
  const [selectedDateIndex, setSelectedDateIndex] = useState(0); 
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); 
  const [keluhan, setKeluhan] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get('/patients/booking-options');
        const data = response.data.data || [];
        const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setRawSchedules(sortedData);
      } catch (error) {
        console.error("Gagal ambil jadwal:", error);
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchSchedules();
  }, []);

  // --- DATA PROCESSING ---
  const uniqueDates = useMemo(() => {
    const datesMap = new Map();
    rawSchedules.forEach(item => {
      if (!datesMap.has(item.date)) {
        const d = new Date(item.date);
        datesMap.set(item.date, {
          rawDate: item.date,
          dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
          dateNum: d.getDate(),
          month: d.toLocaleDateString('id-ID', { month: 'short' })
        });
      }
    });
    return Array.from(datesMap.values());
  }, [rawSchedules]);

  const doctorsOnSelectedDate = useMemo(() => {
    if (uniqueDates.length === 0) return [];
    
    const targetDate = uniqueDates[selectedDateIndex].rawDate;
    const schedulesOnDate = rawSchedules.filter(s => s.date === targetDate);
    const doctorsMap = {};

    schedulesOnDate.forEach(schedule => {
      const docId = schedule.doctor?.id;
      if (!docId) return;

      let imageUrl = DEFAULT_AVATAR;
      if (schedule.doctor?.image) {
        imageUrl = `${BASE_URL}/uploads/doctors/${schedule.doctor.image}`;
      }

      if (!doctorsMap[docId]) {
        doctorsMap[docId] = {
          id: docId,
          name: schedule.doctor?.name || "Dokter",
          specialization: schedule.doctor?.specialization || "Umum",
          image: imageUrl, 
          slots: []
        };
      }

      doctorsMap[docId].slots.push({
        id: schedule.id,
        time: schedule.shift_start.slice(0, 5),
        status: schedule.is_full ? 'full' : 'available'
      });
    });

    return Object.values(doctorsMap);
  }, [rawSchedules, uniqueDates, selectedDateIndex]);

  // --- HANDLERS ---
  const handleSlotClick = (doctor, slot) => {
    if (slot.status === 'full') return;
    setSelectedSlot({ doctor, slot, dateInfo: uniqueDates[selectedDateIndex] });
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setTimeout(() => { setSelectedSlot(null); setKeluhan(''); }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      await api.post('/patients/book', { 
        schedule_id: selectedSlot.slot.id, 
        symptoms: keluhan 
      });
      alert(`✅ Berhasil Booking untuk ${selectedSlot.doctor.name}`);
      closeOverlay();
    } catch (error) {
      alert('❌ Gagal: ' + (error.response?.data?.message || "Error"));
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingFetch) return <div style={{padding:'50px', textAlign:'center'}}>Memuat...</div>;

  return (
    <div className="page-wrapper">
      <style>{`
        /* --- LAYOUT UTAMA --- */
        .page-wrapper { min-height: 100vh; background: #eef2f5; font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 80px; }
        
        /* HEADER & DATE SCROLLER */
        .header-section { 
            padding: 20px; 
            background: #eef2f5; 
            margin-bottom: 20px;
        }
        
        .date-scroller { display: flex; gap: 12px; overflow-x: auto; padding: 10px; scrollbar-width: none; }
        
        /* Neumorphic Date Pill */
        .date-pill { 
            min-width: 60px; height: 75px; 
            border-radius: 20px; 
            background: #eef2f5;
            box-shadow: 5px 5px 10px #c8d0d8, -5px -5px 10px #ffffff;
            display: flex; flex-direction: column; align-items: center; justify-content: center; 
            cursor: pointer; transition: 0.2s; 
            color: #7c889a;
        }
        .date-pill.active { 
            box-shadow: inset 5px 5px 10px #c8d0d8, inset -5px -5px 10px #ffffff;
            color: #2563eb;
            font-weight: bold;
        }
        
        /* DOCTOR CARD GRID */
        .doctor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; padding: 20px; }
        .doc-card-body { 
            background: #eef2f5; 
            border-radius: 30px; 
            padding: 40px 20px 20px; 
            box-shadow: 9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5);
        }
        .doc-card-wrapper { margin-top: 30px; position: relative; }
        .doc-img-container { position: absolute; top: -40px; left: 50%; transform: translateX(-50%); width: 80px; height: 80px; }
        .doc-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 4px solid #eef2f5; box-shadow: 5px 5px 10px #c8d0d8; }

        .time-slots { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 15px; }
        .time-pill { 
            padding: 8px 16px; border-radius: 50px; border: none; 
            background: #eef2f5; color: #7c889a; cursor: pointer; font-weight: 600;
            box-shadow: 3px 3px 6px #c8d0d8, -3px -3px 6px #ffffff;
            transition: 0.2s;
        }
        .time-pill:active { box-shadow: inset 2px 2px 5px #c8d0d8, inset -2px -2px 5px #ffffff; }
        .time-pill.available:hover { color: #2563eb; transform: translateY(-2px); }
        .time-pill.full { text-decoration: line-through; opacity: 0.5; cursor: not-allowed; }

        /* --- OVERLAY NEUMORPHISM --- */
        .overlay-backdrop { 
            position: fixed; inset: 0; 
            background: rgba(163, 177, 198, 0.6); 
            backdrop-filter: blur(5px);
            z-index: 1100; visibility: hidden; opacity: 0; transition: 0.3s; 
        }
        .overlay-backdrop.open { visibility: visible; opacity: 1; }

        .booking-panel { 
            position: fixed; bottom: 0; left: 0; right: 0; 
            background: #eef2f5; 
            padding: 35px; 
            border-radius: 40px 40px 0 0; 
            z-index: 1200; 
            transform: translateY(100%); 
            transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); 
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 -10px 30px rgba(163, 177, 198, 0.5);
        }
        .booking-panel.open { transform: translateY(0); }

        @media(min-width: 768px) { 
            .booking-panel { 
                top: 50%; left: 50%; bottom: auto; right: auto;
                transform: translate(-50%, 150%);
                width: 400px; 
                border-radius: 40px; 
            } 
            .booking-panel.open { transform: translate(-50%, -50%); } 
        }

        /* --- ELEMEN DALAM PANEL --- */
        
        /* 1. Header & Close Button (FIXED Z-INDEX) */
        .panel-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 20px;
            position: relative; 
            z-index: 10; /* Agar di atas elemen lain */
        }
        .close-btn {
            width: 45px; height: 45px;
            border-radius: 50%;
            border: none;
            background: #eef2f5;
            color: #7c889a;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 5px 5px 10px #c8d0d8, -5px -5px 10px #ffffff;
            display: flex; align-items: center; justify-content: center;
            transition: 0.2s;
            position: relative; 
            z-index: 20; /* Agar tombol selalu paling atas */
        }
        .close-btn:hover { color: #ef4444; }
        .close-btn:active { box-shadow: inset 3px 3px 6px #c8d0d8, inset -3px -3px 6px #ffffff; }

        /* 2. Doctor Info */
        .doctor-display {
            text-align: center;
            margin-bottom: 30px;
            display: flex; flex-direction: column; align-items: center;
        }
        
        .doctor-avatar-large {
            width: 100px; height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 5px solid #eef2f5;
            box-shadow: 10px 10px 20px #c8d0d8, -10px -10px 20px #ffffff;
            margin-bottom: 20px;
        }
        
        .doctor-name-large {
            font-size: 1.8rem; font-weight: 800; color: #38404e; margin: 0;
            letter-spacing: -0.5px;
        }
        
        .schedule-info {
            font-size: 1rem; color: #7c889a; font-weight: 600; margin-top: 5px;
        }

        /* 3. Input Keluhan */
        .input-container { margin-bottom: 30px; }
        
        .neumorph-input {
            width: 100%; padding: 20px;
            border-radius: 20px; border: none;
            background: #eef2f5; color: #38404e;
            font-size: 1rem; font-family: inherit;
            box-shadow: inset 6px 6px 12px #c8d0d8, inset -6px -6px 12px #ffffff;
            outline: none; box-sizing: border-box; resize: none; transition: 0.3s;
        }
        .neumorph-input::placeholder { color: #aab5c5; }
        .neumorph-input:focus { box-shadow: inset 3px 3px 6px #c8d0d8, inset -3px -3px 6px #ffffff; }

        /* 4. Info Cards */
        .info-cards-row { display: flex; gap: 15px; margin-bottom: 30px; }
        .info-card {
            flex: 1;
            background: #eef2f5; border-radius: 20px;
            padding: 15px; text-align: center;
            box-shadow: 6px 6px 12px #c8d0d8, -6px -6px 12px #ffffff;
            display: flex; flex-direction: column; justify-content: center;
        }
        .info-label { font-size: 0.75rem; color: #aab5c5; font-weight: 600; margin-bottom: 5px; }
        .info-value { font-size: 0.95rem; color: #38404e; font-weight: 700; }

        /* 5. Submit Button */
        .submit-btn {
            width: 100%; padding: 18px;
            border-radius: 25px; border: none;
            background: #eef2f5; color: #2563eb;
            font-size: 1.1rem; font-weight: 800;
            cursor: pointer;
            box-shadow: 6px 6px 12px #c8d0d8, -6px -6px 12px #ffffff;
            transition: 0.2s;
        }
        .submit-btn:hover { color: #1d4ed8; transform: translateY(-2px); }
        .submit-btn:active { box-shadow: inset 4px 4px 8px #c8d0d8, inset -4px -4px 8px #ffffff; transform: translateY(0); }
        .submit-btn:disabled { color: #aab5c5; cursor: not-allowed; }

      `}</style>

      {/* --- HEADER --- */}
      <div className="header-section">
        <h2 style={{margin:'0 0 20px', color:'#38404e', fontWeight:'800'}}>Jadwal Praktik</h2>
        <div className="date-scroller">
          {uniqueDates.map((d, i) => (
            <div key={i} className={`date-pill ${selectedDateIndex === i ? 'active' : ''}`} onClick={() => setSelectedDateIndex(i)}>
              <small>{d.dayName}</small>
              <strong style={{fontSize:'1.2rem'}}>{d.dateNum}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* --- GRID DOKTER --- */}
      <div className="doctor-grid">
        {doctorsOnSelectedDate.map(doc => (
          <div key={doc.id} className="doc-card-wrapper">
            <div className="doc-img-container">
              <img 
                src={doc.image} 
                alt={doc.name} 
                className="doc-img"
                onError={(e) => { e.target.src = DEFAULT_AVATAR; }} 
              />
            </div>
            <div className="doc-card-body">
              <div style={{textAlign:'center'}}>
                <h3 style={{margin:0, fontSize:'1.1rem', color:'#38404e'}}>{doc.name}</h3>
                <p style={{margin:'5px 0', color:'#7c889a', fontSize:'0.9rem'}}>{doc.specialization}</p>
              </div>
              <div className="time-slots">
                {doc.slots.map(slot => (
                  <button key={slot.id} className={`time-pill ${slot.status}`} onClick={() => handleSlotClick(doc, slot)} disabled={slot.status === 'full'}>
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- OVERLAY NEUMORPHIC --- */}
      <div className={`overlay-backdrop ${isOverlayOpen ? 'open' : ''}`} onClick={closeOverlay}></div>
      
      <div className={`booking-panel ${isOverlayOpen ? 'open' : ''}`}>
        
        {/* Tombol Close & Judul */}
        <div className="panel-header">
            <span style={{color: '#aab5c5', fontWeight: 'bold'}}>Konfirmasi Booking</span>
            
            {/* FIX: Tambahkan type="button" dan stopPropagation agar tidak klik tembus */}
            <button className="close-btn" type="button" onClick={(e) => {
                e.stopPropagation(); 
                closeOverlay();
            }}>
                ✕
            </button>
        </div>

        {selectedSlot && (
            <>
                {/* Bagian Tengah: Info Dokter */}
                <div className="doctor-display">
                    <img 
                        src={selectedSlot.doctor.image} 
                        alt="Avatar" 
                        className="doctor-avatar-large"
                        onError={(e)=>e.target.src=DEFAULT_AVATAR}
                    />
                    <h2 className="doctor-name-large">{selectedSlot.doctor.name}</h2>
                    <div className="schedule-info">
                        {selectedSlot.dateInfo?.dayName}, {selectedSlot.dateInfo?.dateNum} {selectedSlot.dateInfo?.month} • {selectedSlot.slot.time}
                    </div>
                </div>

                {/* Kotak Info Kecil */}
                <div className="info-cards-row">
                    <div className="info-card">
                        <span className="info-label">Spesialis</span>
                        <span className="info-value">{selectedSlot.doctor.specialization}</span>
                    </div>
                    <div className="info-card">
                        <span className="info-label">Status</span>
                        
                        {/* LOGIKA STATUS DINAMIS (PENUH/TERSEDIA) */}
                        {selectedSlot.slot.status === 'full' ? (
                            <span className="info-value" style={{color:'#ef4444'}}>Penuh</span>
                        ) : (
                            <span className="info-value" style={{color:'#10b981'}}>Tersedia</span>
                        )}
                        
                    </div>
                </div>
            </>
        )}

        {/* Form Input Keluhan */}
        <form onSubmit={handleSubmit}>
            <div className="input-container">
                <textarea 
                  className="neumorph-input"
                  rows="3" 
                  placeholder="Tuliskan keluhan atau gejala yang Anda rasakan..."
                  value={keluhan}
                  onChange={e=>setKeluhan(e.target.value)}
                  required
                />
            </div>

            <button type="submit" className="submit-btn" disabled={loadingSubmit}>
              {loadingSubmit ? 'Memproses...' : 'Ambil Antrean'}
            </button>
        </form>

      </div>

    </div>
  );
};

export default Booking;