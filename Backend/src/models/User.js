const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
            // JANGAN CUMA unique: true
            // TAPI GANTI JADI OBJECT SEPERTI INI:
        unique: {
            args: true,
            msg: 'Email already exists',
            name: 'unique_email_constraint' // <--- KUNCI PENGAMANNYA
        },
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('DOCTOR', 'PATIENT'),
        defaultValue: 'PATIENT'
    },
    // --- TAMBAHAN DI SINI ---
    specialization: {
        type: DataTypes.STRING,
        allowNull: true // Penting! Harus true karena Pasien tidak punya spesialisasi
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true, // Boleh kosong
        defaultValue: null
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false, // Opsional, boleh kosong
        unique: {
            args: true,
            msg: 'Nomor telepon sudah digunakan!'
        },
        validate: {
            isNumeric: { msg: "Nomor telepon hanya boleh berisi angka!" },
            len: {
                args: [10, 13],
                msg: "Nomor telepon harus antara 10 - 13 digit!"
            }
        }
    }
    // ------------------------
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false 
});

module.exports = User;