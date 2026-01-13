import api from './api';

// 1. Ambil Daftar Dokter (Public)
const getAllDoctors = () => {
  // Sesuai route backend di gambar Anda: GET /patients/doctors
  return api.get('/patients/doctors');
};

// 2. Booking Antrean (Protected/Butuh Login)
const bookAppointment = (bookingData) => {
  // Sesuai route backend di gambar Anda: POST /patients/book
  // bookingData berisi: { doctorId, jam_estimasi, keluhan }
  return api.post('/patients/book', bookingData);
};

// 3. Lihat Antrean Saya (Opsional, jika backend ada fiturnya)
const getMyQueues = () => {
  return api.get('/patients/my-queue');
};

const patientService = {
  getAllDoctors,
  bookAppointment,
  getMyQueues
};

export default patientService;