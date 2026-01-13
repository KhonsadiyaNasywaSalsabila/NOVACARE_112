const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { validateRegister } = require('../middlewares/validateRequest');

// ==========================================
// 1. RUTE PUBLIK (Tanpa Login)
// ==========================================

/**
 * Registrasi User Baru
 * Alur: Validasi Format -> Cek Duplikasi DB -> Enkripsi -> Simpan
 */
router.post('/register', validateRegister, authController.register);

/**
 * Login User
 * Menghasilkan JWT Token untuk akses fitur privat
 */
router.post('/login', authController.login);

// ==========================================
// 2. RUTE PRIVAT (Wajib Login)
// ==========================================

/**
 * Mendapatkan Data Profil Sendiri
 * Digunakan saat refresh halaman untuk sinkronisasi state Auth
 */
router.get('/me', verifyToken, authController.getMe);

/**
 * Hapus Akun (Opsional/Admin)
 */
router.delete('/users/:id', verifyToken, authController.deleteUser);

module.exports = router;