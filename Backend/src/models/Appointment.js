const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Appointment = db.define('Appointment', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    patient_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    doctor_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    schedule_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    queue_number: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    }, 
    status: { 
        type: DataTypes.ENUM('BOOKED', 'WAITING', 'COMPLETED', 'CANCELLED'), 
        defaultValue: 'BOOKED' 
    },
    // --- TAMBAHAN BARU: WAKTU CHECK-IN (WAJIB DITAMBAH) ---
    check_in_time: {
        type: DataTypes.DATE, // Di MySQL ini akan menjadi DATETIME
        allowNull: true       // Boleh kosong (karena saat booking belum check-in)
    },
    // --- TAMBAHAN BARU: KOLOM KELUHAN ---
    symptoms: {
        type: DataTypes.TEXT, // Menggunakan TEXT agar bisa menampung tulisan panjang
        allowNull: true       // Boleh kosong (jika pasien tidak mengisi)
    }
}, { 
    tableName: 'appointments', 
    timestamps: true,
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
});

module.exports = Appointment;