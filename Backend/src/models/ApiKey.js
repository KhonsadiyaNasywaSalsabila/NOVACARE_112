const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sesuaikan dengan path koneksi DB Anda

const ApiKey = sequelize.define('ApiKey', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
    // Relasi foreign key diatur di models/index.js
  },
  label: {
    type: DataTypes.STRING, 
    allowNull: true,
    comment: 'Nama pemilik key, misal: Apotek K24'
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  permissions: {
    type: DataTypes.JSON, 
    allowNull: true,
    defaultValue: [] // Contoh isi: ["read_resep", "read_jadwal"]
  }
}, {
  tableName: 'api_keys',
  timestamps: true
});

module.exports = ApiKey;