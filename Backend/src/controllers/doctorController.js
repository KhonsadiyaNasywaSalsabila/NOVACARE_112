const { User, Schedule, Appointment, MedicalRecord } = require('../models/index');
const { Op } = require('sequelize');


// ==============================
// 1. MANAJEMEN JADWAL (SCHEDULE)
// ==============================

// 1. AMBIL JADWAL SAYA (KHUSUS DOKTER)
exports.getMySchedules = async (req, res) => {
    try {
        const doctorId = req.user.id;
        
        // Ambil tanggal hari ini (Format: YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];

        const schedules = await Schedule.findAll({
            where: {
                doctor_id: doctorId,
                // FILTER BARU: Hanya ambil jadwal hari ini atau masa depan
                date: { [Op.gte]: today } 
            },
            order: [['date', 'ASC'], ['shift_start', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: schedules
        });
    } catch (error) {
        console.error("Error getMySchedules:", error);
        res.status(500).json({ message: 'Gagal mengambil data jadwal', error: error.message });
    }
};

// B. Buat Jadwal Baru
exports.createSchedule = async (req, res) => {
    try {
        const { date, shift_start, shift_end, quota } = req.body;
        const doctor_id = req.user.id; 

        if (!date || !shift_start || !shift_end) {
            return res.status(400).json({ message: "Data jadwal tidak lengkap!" });
        }

        const newSchedule = await Schedule.create({ 
            doctor_id, date, shift_start, shift_end, 
            quota: quota || 10 
        });
        
        res.status(201).json({ message: 'Jadwal berhasil dibuat', data: newSchedule });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat jadwal', error: error.message });
    }
};

// C. Hapus Jadwal
exports.deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorId = req.user.id;
        const deleted = await Schedule.destroy({ where: { id: id, doctor_id: doctorId } });

        if (!deleted) return res.status(404).json({ message: "Jadwal tidak ditemukan" });
        res.json({ message: "Jadwal berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal hapus jadwal", error: error.message });
    }
};


exports.updateProfile = async (req, res) => {
  try {
    const doctorId = req.user.id; // Asumsi dari Auth Middleware
    const { name, specialization } = req.body;
    let imagePath = null;

    // Jika ada file yang diupload
    if (req.file) {
      imagePath = req.file.filename; // Ambil nama filenya saja
    }

    // Siapkan data update
    const updateData = { name, specialization };
    if (imagePath) {
      updateData.image = imagePath; // Update kolom image di DB
    }

    // Update ke Database
    await User.update(updateData, { where: { id: doctorId } });

    res.status(200).json({ message: 'Profil berhasil diupdate', data: updateData });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ==============================
// 2. MANAJEMEN ANTREAN & PEMERIKSAAN
// ==============================

// A. Ambil Daftar Antrean Pasien (Queue)
exports.getQueue = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const today = new Date().toISOString().split('T')[0]; // Tanggal Hari Ini

    const queue = await Appointment.findAll({
      where: {
        // Cari appointment milik dokter ini
        // Status harus 'waiting' (artinya pasien sudah klik check-in)
        status: 'waiting', 
        // Tanggal harus hari ini (Opsional, tapi bagus untuk keamanan ganda)
        date: today 
      },
      include: [
        {
          model: Schedule,
          where: { doctor_id: doctorId } // Pastikan jadwal milik dokter tsb
        },
        {
          model: User, // Include data pasien
          as: 'patient',
          attributes: ['name', 'id']
        }
      ],
      order: [['queue_number', 'ASC']]
    });

    res.status(200).json({ data: queue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- HELPER: LOGIKA PEMETAAN SPESIALIS -> POLI (VERSI PINTAR) ---
const getPoliName = (specialization) => {
    if (!specialization) return 'Poli Umum';
    
    // 1. Normalisasi: Ubah ke huruf kecil & hilangkan spasi ganda
    const specRaw = specialization.toLowerCase().trim();

    // 2. KAMUS SINGKATAN (Mapping Manual untuk singkatan populer)
    // Kiri: Singkatan yang dicari | Kanan: Nama Poli yang diinginkan
    const dictionary = {
        'drg': 'Poli Gigi',
        'bedah mulut': 'Poli Bedah Mulut',
        'konservasi gigi': 'Poli Konservasi Gigi',
        
        'sp.og': 'Poli Kandungan (Obgyn)',
        'sp.a': 'Poli Anak',
        'sp.pd': 'Poli Penyakit Dalam',
        'sp.b': 'Poli Bedah Umum',
        'sp.ba': 'Poli Bedah Anak',     // <--- Ini yang Anda tanyakan
        'sp.bs': 'Poli Bedah Saraf',
        'sp.bm': 'Poli Bedah Mulut',
        'sp.ot': 'Poli Orthopedi (Tulang)',
        'sp.u': 'Poli Urologi',
        
        'sp.jp': 'Poli Jantung',
        'sp.p': 'Poli Paru',
        'sp.m': 'Poli Mata',
        'sp.tht': 'Poli THT',
        'sp.s': 'Poli Saraf',
        'sp.kj': 'Poli Jiwa',
        'sp.kk': 'Poli Kulit & Kelamin',
        'sp.kfr': 'Poli Rehab Medik',
        'sp.rad': 'Poli Radiologi',
        'sp.an': 'Poli Anestesi'
    };

    // Cek apakah ada di kamus?
    for (const [key, value] of Object.entries(dictionary)) {
        // Jika spesialisasi mengandung kata kunci (misal "dr. Budi, Sp.BA")
        if (specRaw.includes(key)) {
            return value;
        }
    }

    // 3. LOGIKA FALLBACK (JIKA TIDAK ADA DI KAMUS)
    // Jika dokter menulis "Spesialis Gizi", sistem akan otomatis buat "Poli Gizi"
    // Caranya: Hapus kata "Spesialis", "Sp.", "Dokter", lalu ambil sisanya.
    
    let dynamicName = specialization
        .replace(/Spesialis/yi, '') // Hapus kata Spesialis
        .replace(/Sp\./yi, '')      // Hapus kata Sp.
        .replace(/dr\./yi, '')      // Hapus kata dr.
        .trim();                    // Hapus spasi sisa

    // Kapitalisasi huruf depan (misal: "gizi klinik" -> "Gizi Klinik")
    dynamicName = dynamicName.replace(/\b\w/g, l => l.toUpperCase());

    if (dynamicName.length > 2) {
        return `Poli ${dynamicName}`;
    }

    // Default terakhir banget jika gagal semua
    return 'Poli Spesialis';
};

// B. Simpan Rekam Medis (Diagnosis)
exports.createMedicalRecord = async (req, res) => {
    try {
        const { appointment_id, diagnosis, treatment, prescription, notes } = req.body;

        // 1. Validasi Appointment
        const appointment = await Appointment.findByPk(appointment_id);
        if (!appointment) return res.status(404).json({ message: "Antrean tidak ditemukan!" });

        // 2. AMBIL DATA DOKTER DARI DATABASE (PERBAIKAN UTAMA)
        // Kita cari user berdasarkan ID yang sedang login untuk dapat spesialisasinya
        const doctorData = await User.findByPk(req.user.id);
        
        if (!doctorData) {
            return res.status(404).json({ message: "Data dokter tidak ditemukan." });
        }

        // 3. Tentukan Nama Poli
        const automaticPoli = getPoliName(doctorData.specialization);

        // 4. Simpan Record
        const newRecord = await MedicalRecord.create({
            user_id: appointment.patient_id, 
            appointment_id,
            doctor_id: req.user.id,
            poli: automaticPoli, // <--- Sekarang pasti terisi benar (misal: Poli Bedah Saraf)
            symptoms: appointment.symptoms,
            diagnosis,
            treatment,
            prescription,
            notes
        });

        await appointment.update({ status: 'COMPLETED' });

        res.status(201).json({
            success: true,
            message: "Berhasil disimpan ke " + automaticPoli,
            data: newRecord
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Gagal menyimpan', error: error.message });
    }
};