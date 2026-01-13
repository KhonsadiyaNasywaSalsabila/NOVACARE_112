const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Middleware Keamanan (Hanya Dokter yang boleh akses)
const { verifyToken, verifyDoctor } = require('../middlewares/authMiddleware'); 
const upload = require('../middlewares/uploadMiddleware');


// --- MENU 1: KELOLA JADWAL ---
router.get('/schedule', verifyToken, verifyDoctor, doctorController.getMySchedules);
router.post('/schedule', verifyToken, verifyDoctor, doctorController.createSchedule);
router.delete('/schedule/:id', verifyToken, verifyDoctor, doctorController.deleteSchedule);
router.put('/profile', verifyToken, verifyDoctor, upload.single('image'), doctorController.updateProfile);

// --- MENU 2: PEMERIKSAAN PASIEN ---
// 1. Lihat siapa saja yang antri
router.get('/queue', verifyToken, verifyDoctor, doctorController.getQueue);

// 2. Input Diagnosis & Resep (Menyelesaikan pemeriksaan)
router.post('/medical-record', verifyToken, verifyDoctor, doctorController.createMedicalRecord);

module.exports = router;