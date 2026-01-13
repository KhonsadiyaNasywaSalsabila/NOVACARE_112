const { User, Schedule, Appointment, MedicalRecord } = require('../models');
const { Op } = require('sequelize');

// --- 1. AMBIL DAFTAR JADWAL DOKTER (Public/Booking) ---
exports.getDoctorSchedules = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
    
    const schedules = await Schedule.findAll({
      where: {
        date: { [Op.gte]: today },
        is_active: true,
        quota: { [Op.gt]: 0 }
      },
      include: [{
        model: User,
        as: 'doctor',
        attributes: ['id', 'name', 'specialization', 'image']
      }],
      order: [['date', 'ASC'], ['shift_start', 'ASC']]
    });

    return res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    console.error("Error getDoctorSchedules:", error);
    return res.status(500).json({ message: 'Gagal mengambil jadwal', error: error.message });
  }
};

// --- 2. BOOKING ANTREAN BARU ---
exports.bookAppointment = async (req, res) => {
  try {
    const { schedule_id, symptoms } = req.body;
    const patient_id = req.user.id;

    const schedule = await Schedule.findByPk(schedule_id);
    if (!schedule || !schedule.is_active || schedule.quota <= 0) {
      return res.status(400).json({ message: "Jadwal tidak tersedia atau kuota sudah habis." });
    }

    // Hitung nomor antrean berdasarkan jumlah yang sudah booking di jadwal tsb
    const count = await Appointment.count({ where: { schedule_id } });
    const queue_number = count + 1;

    const newAppointment = await Appointment.create({
      patient_id,
      doctor_id: schedule.doctor_id,
      schedule_id,
      queue_number,
      status: 'BOOKED',
      symptoms: symptoms || '-'
    });

    // Kurangi kuota pada tabel Schedule
    await schedule.decrement('quota');

    return res.status(201).json({ 
      success: true, 
      message: "Booking antrean berhasil!", 
      data: newAppointment 
    });
  } catch (error) {
    console.error("Error bookAppointment:", error);
    return res.status(500).json({ message: 'Proses booking gagal', error: error.message });
  }
};

// --- 3. DAFTAR ANTREAN SAYA (Dashboard Patient) ---
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patient_id: req.user.id },
      include: [
        { 
          model: User, 
          as: 'doctor', 
          attributes: ['name', 'specialization', 'image'] 
        },
        {
          model: Schedule,
          as: 'schedule',
          attributes: ['date', 'shift_start', 'shift_end']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error getMyAppointments:", error);
    return res.status(500).json({ message: 'Gagal memuat data antrean', error: error.message });
  }
};

// --- 4. PROSES CHECK-IN (Mandiri oleh Pasien) ---
exports.checkIn = async (req, res) => {
  try {
    const { appointmentId } = req.params; 
    
    // Cari appointment beserta tanggal jadwalnya
    const appointment = await Appointment.findByPk(appointmentId, {
      include: [{ model: Schedule, as: 'schedule', attributes: ['date'] }]
    });

    if (!appointment) {
      return res.status(404).json({ message: "Data janji temu tidak ditemukan." });
    }

    if (appointment.status !== 'BOOKED') {
      return res.status(400).json({ message: `Status saat ini adalah ${appointment.status}. Tidak bisa Check-in.` });
    }

    // Validasi Tanggal (Hanya bisa check-in di hari yang sama)
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
    const appDate = new Date(appointment.schedule.date).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

    if (appDate !== today) {
      return res.status(400).json({ 
        message: `Gagal Check-in. Jadwal Anda adalah tanggal ${appDate}, silakan kembali pada hari tersebut.` 
      });
    }

    // Update status ke WAITING (Menunggu dipanggil dokter)
    appointment.status = 'WAITING';
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Check-in berhasil! Mohon tunggu panggilan dokter di ruang tunggu.",
      data: appointment
    });
  } catch (error) {
    console.error("CheckIn Error:", error);
    return res.status(500).json({ message: "Gagal memproses Check-in", error: error.message });
  }
};

// --- 5. RIWAYAT MEDIS SAYA ---
exports.getMyMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.findAll({
      where: { user_id: req.user.id },
      include: [
        { 
          model: User, 
          as: 'doctorUser', 
          attributes: ['name', 'specialization', 'image'] 
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ success: true, data: records });
  } catch (error) {
    console.error("Error getMyMedicalRecords:", error);
    return res.status(500).json({ message: 'Gagal mengambil riwayat medis', error: error.message });
  }
};

exports.getPublicSchedules = async (req, res) => {
  try {
    // 1. Inisialisasi tanggal hari ini (set ke jam 00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Ambil data jadwal dengan relasi dokter
    const schedules = await Schedule.findAll({
      where: {
        date: { [Op.gte]: today }
      },
      include: [
        {
          model: User,
          as: 'doctor', // Pastikan alias ini sinkron dengan src/models/index.js
          attributes: ['id', 'name', 'specialization', 'image']
        }
      ],
      order: [
        ['date', 'ASC'],
        ['shift_start', 'ASC']
      ]
    });

    // 3. Berikan respon sukses
    return res.status(200).json({
      status: 'success',
      data: schedules
    });

    } catch (error) {
    // 4. Penanganan error server
    console.error("Error getPublicSchedules:", error);
    return res.status(500).json({ 
      message: 'Terjadi kesalahan server', 
      error: error.message 
    });
    }
};