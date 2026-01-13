const { User } = require('../models/index');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1. REGISTER USER BARU

const { Op } = require('sequelize'); // Import Operator untuk pengecekan ganda

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        // 1. Validasi Input (Sebaiknya dilakukan di validateRequest.js)
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "Semua field termasuk Nomor Telepon wajib diisi!" });
        }

        // 2. Cek Duplikasi Email ATAU Nomor Telepon secara proaktif
        const existingUser = await User.findOne({ 
            where: { 
                [Op.or]: [{ email }, { phone }] 
            } 
        });

        if (existingUser) {
            const field = existingUser.email === email ? 'Email' : 'Nomor Telepon';
            return res.status(400).json({ message: `${field} sudah terdaftar!` });
        }

        // 3. Validasi Format Telepon Dasar (Hanya Angka)
        if (!/^\d+$/.test(phone)) {
            return res.status(400).json({ message: "Nomor telepon hanya boleh berisi angka!" });
        }

        // 4. Logika Role Otomatis tetap sama
        let role = 'PATIENT'; 
        let specialization = null;
        if (email.toLowerCase().endsWith('@care.com')) {
            role = 'DOCTOR';
            specialization = 'Umum';
        }

        // 5. Enkripsi Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Simpan ke Database
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,         
            specialization,
            phone
        });

        res.status(201).json({ 
            success: true,
            message: 'Registrasi berhasil!', 
            data: { id: newUser.id, name: newUser.name, role: newUser.role }
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};
// 2. LOGIN USER
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari User
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'Email tidak ditemukan' });

        // Cek Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Password salah!' });

        // Buat Token (Payload standar)
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // Return data lengkap user agar Frontend langsung update UI
        res.json({ 
            message: 'Login berhasil', 
            token, 
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email,
                image: user.image,
                specialization: user.specialization
            } 
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 3. GET ME (Dipanggil saat Refresh Halaman)
exports.getMe = async (req, res) => {
    try {
        // req.user.id didapat dari middleware 'verifyToken'
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } // Jangan kirim password
        });

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.status(200).json({
            success: true,
            data: user // Kirim objek user lengkap (name, role, dll)
        });
    } catch (error) {
        console.error("Error getMe:", error);
        res.status(500).json({ message: 'Gagal mengambil data user', error: error.message });
    }
};

// 4. HAPUS USER
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan!' });
        }

        await user.destroy();
        res.json({ message: 'User berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
};