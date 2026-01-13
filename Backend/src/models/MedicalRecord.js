const { DataTypes } = require('sequelize');
const db = require('../config/database');

const MedicalRecord = db.define('MedicalRecord', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    
    // --- RELASI UTAMA (FOREIGN KEYS) ---
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, // Wajib: Rekam medis harus punya pemilik (Pasien)
        references: {
            model: 'users', // Nama tabel referensi
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    appointment_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true, // PENTING: Boleh kosong untuk data historis/manual
        references: {
            model: 'appointments',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },

    // --- DATA MEDIS (SESUAI TAMPILAN FRONTEND) ---
    doctor: {
        type: DataTypes.STRING,
        allowNull: true // Nama dokter (Snapshot string agar tidak hilang jika user dokter dihapus)
    },
    poli: {
        type: DataTypes.STRING,
        allowNull: true
    },
    symptoms: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    }, 
    diagnosis: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
    treatment: {
        type: DataTypes.TEXT, // Tindakan medis
        allowNull: true
    },
    prescription: { 
        type: DataTypes.TEXT, // Resep obat
        allowNull: true 
    },
    notes: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    }
}, { 
    tableName: 'medical_records', 
    timestamps: true, 
    createdAt: 'created_at', // Mapping: Sequelize 'createdAt' -> DB 'created_at'
    updatedAt: 'updated_at'  // Mapping: Sequelize 'updatedAt' -> DB 'updated_at' 
});

module.exports = MedicalRecord;