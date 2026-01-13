const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
// Pastikan penulisan import sesuai (apakah default export atau named export)
const verifyApiKey = require('../middlewares/apiKeyMiddleware'); 

// ==================================================================
// ROUTE MITRA EKSTERNAL (Apotek / Aplikasi Lain)
// ==================================================================

/**
 * 1. Cek Resep Digital
 * URL: GET /api/v1/partners/resep/:no_rm
 * Header Wajib: x-api-key
 */
// PERBAIKAN: Hapus tanda kurung () jika verifyApiKey adalah middleware standar
router.get('/resep/:no_rm', verifyApiKey('read_resep'), partnerController.cekResep);

/**
 * 2. Cek Jadwal Dokter (Opsional untuk Mitra)
 * URL: GET /api/v1/partners/jadwal-dokter
 */
router.get('/jadwal-dokter', verifyApiKey('read_jadwal'), partnerController.cekJadwal);

module.exports = router;