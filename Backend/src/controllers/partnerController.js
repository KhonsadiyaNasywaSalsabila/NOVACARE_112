const { MedicalRecord, Appointment, User, Schedule } = require('../models');// Sesuaikan path jika perlu
const { Op } = require('sequelize');

// ==========================================
// 1. CEK RESEP (Untuk Apotek / Mitra)
// ==========================================
exports.cekResep = async (req, res) => {
  try {
    const { no_rm } = req.params; 

    // 1. Membersihkan Format ID (RSP-8 -> 8)
    const idDariInput = no_rm.replace('RSP-', '').trim();

    // 2. Query: Cari rekam medis berdasarkan ID APPOINTMENT
    const record = await MedicalRecord.findOne({
      where: { appointment_id: idDariInput }, 
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['name']
        },
        {
          model: User,
          as: 'doctorUser',
          attributes: ['name', 'specialization']
        },
        {
          model: Appointment,
          as: 'appointment',
          include: [{
            model: Schedule,
            as: 'schedule',
            attributes: ['date'] // Diambil dari tabel Schedule
          }]
        }
      ]
    });

    // 3. Validasi
    if (!record) {
      return res.status(404).json({ 
        success: false,
        message: "Resep tidak ditemukan. Pastikan nomor Janji Temu benar." 
      });
    }

    // 4. Respon Sukses (Sesuaikan nama properti dengan Frontend)
    res.status(200).json({
      success: true,
      data: {
        id_resep: `RSP-${record.appointment_id}`,
        // UBAH 'tanggal' MENJADI 'tanggal_periksa' agar sinkron dengan Portal Apotek
        tanggal_periksa: record.appointment?.schedule?.date, 
        nama_pasien: record.patient?.name,
        nama_dokter: record.doctorUser?.name,
        spesialisasi: record.doctorUser?.specialization,
        diagnosa: record.diagnosis,
        resep_obat: record.prescription,
        catatan_tambahan: record.notes
      }
    });

  } catch (error) {
    console.error("Error cekResep:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==========================================
// 2. CEK JADWAL (Untuk Aplikasi Pihak Ketiga)
// ==========================================
exports.cekJadwal = async (req, res) => {
  try {
    // Ambil tanggal hari ini
    const today = new Date().toISOString().split('T')[0];

    // Ambil Jadwal dari tabel Schedules
    const schedules = await Schedule.findAll({
      where: {
        date: { [Op.gte]: today }, // Jadwal hari ini ke depan
        is_active: true,
        quota: { [Op.gt]: 0 }      // Kuota masih ada
      },
      include: [{ 
        model: User, 
        as: 'doctor', // Relasi ke User (Dokter)
        attributes: ['name', 'specialization'] 
      }],
      order: [['date', 'ASC'], ['shift_start', 'ASC']]
    });

    res.json({
      status: "success",
      mitra: req.partner?.name || "Mitra",
      total_jadwal: schedules.length,
      data: schedules.map(item => ({
        dokter: item.doctor.name,
        spesialis: item.doctor.specialization,
        tanggal: item.date,
        jam: `${item.shift_start.slice(0,5)} - ${item.shift_end.slice(0,5)}`,
        sisa_kuota: item.quota
      }))
    });

  } catch (error) {
    console.error("Error cekJadwal:", error);
    res.status(500).json({ message: "Gagal mengambil jadwal dokter" });
  }
};