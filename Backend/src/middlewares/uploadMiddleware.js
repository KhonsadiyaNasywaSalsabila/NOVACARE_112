// src/middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder ini sudah dibuat: Backend/public/uploads/doctors
    cb(null, 'public/uploads/doctors'); 
  },
  filename: (req, file, cb) => {
    // Nama file unik: id-dokter-timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doctor-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter hanya gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Hanya format JPG dan PNG yang diizinkan!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 } // Limit 2MB
});

module.exports = upload;