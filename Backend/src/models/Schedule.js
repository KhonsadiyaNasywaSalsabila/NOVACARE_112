const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Schedule = db.define('Schedule', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    doctor_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    }, // Format: YYYY-MM-DD
    shift_start: { 
        type: DataTypes.TIME, 
        allowNull: false 
    }, // Jam mulai
    shift_end: { 
        type: DataTypes.TIME, 
        allowNull: false 
    },   // Jam selesai
    quota: { 
        type: DataTypes.INTEGER, 
        defaultValue: 10 
    },    // Batas pasien
    is_active: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    }
}, { 
    tableName: 'schedules', 
    timestamps: true 
});

module.exports = Schedule;