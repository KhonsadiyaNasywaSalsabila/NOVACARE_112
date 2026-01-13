const sequelize = require('../config/database');
const User = require('./User');
const Schedule = require('./Schedule');
const Appointment = require('./Appointment');
const MedicalRecord = require('./MedicalRecord');
const ApiKey = require('./ApiKey');

// ==================================================
// DEFINISI RELASI (ASSOCIATIONS)
// ==================================================

// --- 1. Relasi User & Schedule ---
User.hasMany(Schedule, { foreignKey: 'doctor_id', as: 'schedules', onDelete: 'CASCADE' });
Schedule.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctor' });

// --- 2. Relasi User & Appointment ---
// Pasien
User.hasMany(Appointment, { foreignKey: 'patient_id', as: 'patientAppointments', onDelete: 'CASCADE' });
Appointment.belongsTo(User, { foreignKey: 'patient_id', as: 'patient' });
// Dokter
User.hasMany(Appointment, { foreignKey: 'doctor_id', as: 'doctorAppointments', onDelete: 'CASCADE' });
Appointment.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctor' });

// --- 3. Relasi Schedule & Appointment ---
Schedule.hasMany(Appointment, { foreignKey: 'schedule_id', as: 'appointments', onDelete: 'CASCADE' });
Appointment.belongsTo(Schedule, { foreignKey: 'schedule_id', as: 'schedule' });

// --- 4. Relasi Appointment & Medical Record (1:1) ---
Appointment.hasOne(MedicalRecord, { foreignKey: 'appointment_id', as: 'medicalRecord', onDelete: 'CASCADE' });
MedicalRecord.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });

// --- 5. Relasi Medical Record & User ---
// Dokter (Penulis Rekam Medis)
User.hasMany(MedicalRecord, { foreignKey: 'doctor_id', as: 'createdMedicalRecords' });
MedicalRecord.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctorUser' }); 
// Pasien (Pemilik Rekam Medis)
User.hasMany(MedicalRecord, { foreignKey: 'user_id', as: 'medicalRecords' });
MedicalRecord.belongsTo(User, { foreignKey: 'user_id', as: 'patient' });

// --- 6. Relasi User & API Key ---
User.hasMany(ApiKey, { foreignKey: 'user_id', as: 'apiKeys', onDelete: 'CASCADE' });
ApiKey.belongsTo(User, { foreignKey: 'user_id', as: 'creator' });

module.exports = { 
    sequelize, 
    User, 
    Schedule, 
    Appointment, 
    MedicalRecord,
    ApiKey 
};