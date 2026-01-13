const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/public-schedules', patientController.getPublicSchedules);
// ==========================================
// 1. MIDDLEWARE PELINDUNG (Wajib Login)
// ==========================================
router.use(verifyToken); 

// ==========================================
// 2. DEFINISI ROUTE
// ==========================================

// A. Booking & Jadwal
// PERBAIKAN: Di controller namanya 'getDoctorSchedules', bukan 'getBookingOptions'
router.get('/booking-options', patientController.getDoctorSchedules); 

// Submit booking
router.post('/book', patientController.bookAppointment);            

// Lihat history antrean
router.get('/my-appointments', patientController.getMyAppointments); 

// Pastikan rutenya seperti ini (ada titik dua /: )
router.put('/checkin/:appointmentId', verifyToken, patientController.checkIn);                 

// B. Rekam Medis
router.get('/my-medical-records', patientController.getMyMedicalRecords);


module.exports = router;