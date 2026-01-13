const { ApiKey } = require('../models');
const crypto = require('crypto');

// Generate Key Baru
exports.generateKey = async (req, res) => {
  try {
    const userId = req.user.id; // Dari Token JWT
    const { label, permissions } = req.body; 

    const newKeyString = 'klinik_' + crypto.randomBytes(16).toString('hex');

    const newKey = await ApiKey.create({
      user_id: userId,
      key: newKeyString,
      label: label || 'Unnamed Key',
      permissions: permissions || [], // Simpan array izin
      status: 'active'
    });

    res.status(201).json({ message: "Key berhasil dibuat", data: newKey });
  } catch (error) {
    res.status(500).json({ message: "Gagal generate key", error: error.message });
  }
};

// List Key Saya
exports.getMyKeys = async (req, res) => {
  try {
    const userId = req.user.id;
    const keys = await ApiKey.findAll({ 
      where: { user_id: userId },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ data: keys });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};

// Hapus Key
exports.revokeKey = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await ApiKey.destroy({ where: { id, user_id: userId } });
    res.status(200).json({ message: "Key berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal hapus key", error: error.message });
  }
};