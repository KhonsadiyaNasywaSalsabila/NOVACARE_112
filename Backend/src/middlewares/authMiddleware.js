const jwt = require('jsonwebtoken');
require('dotenv').config();

// --- 1. Middleware Cek Token (Apakah User Login?) ---
const verifyToken = (req, res, next) => {
    // Ambil token dari Header (Biasanya format: "Bearer eyJhbGciOi...")
    const authHeader = req.headers['authorization'];
    
    // Kita ambil bagian tokennya saja (setelah spasi)
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            message: 'Akses ditolak! Token tidak ditemukan. Silakan login terlebih dahulu.' 
        });
    }

    // Verifikasi Token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ 
                message: 'Token tidak valid atau sudah kedaluwarsa!' 
            });
        }
        
        // Simpan data user (id, role, username) dari token ke dalam request
        // Agar bisa dipakai di controller atau middleware selanjutnya
        req.user = decoded; 
        next();
    });
};

// --- 2. Middleware Cek Role Dokter (Proteksi Ekstra) ---
const verifyDoctor = (req, res, next) => {
    // Pastikan req.user ada (artinya sudah lolos verifyToken)
    if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'User tidak teridentifikasi.' });
    }

    // Normalisasi role ke huruf besar semua agar aman
    // Jadi 'dokter', 'Doctor', atau 'DOCTOR' dianggap sama
    const role = req.user.role.toUpperCase();

    if (role !== 'DOCTOR' && role !== 'DOKTER') {
        return res.status(403).json({ 
            message: 'Akses Ditolak! Fitur ini khusus untuk Dokter.' 
        });
    }

    next();
};

// --- 3. Ekspor Module ---
module.exports = {
    verifyToken,
    verifyDoctor
};