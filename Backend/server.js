const express = require('express');
const cors = require('cors');
// Pastikan path ini benar sesuai struktur folder Anda (apakah ./src atau langsung ./config)
const db = require('./src/config/database'); 
require('dotenv').config();
const path = require('path');

// --- 1. IMPORT ROUTES ---
const authRoutes = require('./src/routes/authRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const patientRoutes = require('./src/routes/patientRoutes');

// [BARU] Route untuk Manajemen API Key (Internal) & Akses Mitra (Eksternal)
const apiKeyRoutes = require('./src/routes/apiKeyRoutes');
const partnerRoutes = require('./src/routes/partnerRoutes');



// --- 2. IMPORT MODELS UNTUK SYNC ---
// Tambahkan 'ApiKey' di sini agar tabelnya dibuat otomatis oleh Sequelize
const { User, Schedule, Appointment, MedicalRecord, ApiKey } = require('./src/models/index');

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // Penting agar file HTML simulasi bisa mengakses API
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// --- 3. DAFTAR ROUTES (ENDPOINTS) ---

// Route Auth & User Biasa
app.use('/api/v1/auth', authRoutes);     
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/doctor', doctorRoutes);

// [BARU] Route Internal: Untuk Dokter/Admin membuat & menghapus Key
// URL: POST http://localhost:3009/api/v1/keys/generate
app.use('/api/v1/keys', apiKeyRoutes);

// [BARU] Route Eksternal: Untuk Pihak Apotek/Mitra mengambil data
// URL: GET http://localhost:3009/api/v1/partners/resep/:no_rm
app.use('/api/v1/partners', partnerRoutes);


// --- DATABASE SYNC ---
db.authenticate()
    .then(() => {
        console.log('✅ Database terkoneksi!');
        
        // Gunakan { alter: true } agar jika ada tabel baru (ApiKey), 
        // database otomatis menyesuaikan tanpa menghapus data lama.
        return db.sync({ alter: true }); 
    })
    .then(() => {
        console.log('✅ Tabel tersinkronisasi!');
        console.log('   - Users, Schedules, Appointments, MedicalRecords, ApiKeys');
    })
    .catch(err => console.error('❌ Gagal konek database:', err));

// --- JALANKAN SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`   - API Key Management: /api/v1/keys`);
    console.log(`   - Partner Access:     /api/v1/partners`);
});