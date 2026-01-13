const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');

// Import DUA middleware tadi
const { verifyToken, verifyDoctor } = require('../middlewares/authMiddleware');

// --- ATURAN KEAMANAN ---
// 1. verifyToken: Harus login dulu
// 2. verifyDoctor: Harus role 'dokter' (Pasien dilarang masuk sini)

router.post('/generate', verifyToken, verifyDoctor, apiKeyController.generateKey);
router.get('/list', verifyToken, verifyDoctor, apiKeyController.getMyKeys);
router.delete('/:id', verifyToken, verifyDoctor, apiKeyController.revokeKey);

module.exports = router;