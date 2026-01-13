const { ApiKey } = require('../models'); // Sesuaikan path ke models

const verifyApiKey = (requiredPermission = null) => {
  return async (req, res, next) => {
    try {
      // 1. Ambil Key dari Header (Case Insensitive untuk keamanan)
      // Client bisa kirim 'x-api-key', 'X-Api-Key', atau 'X-API-KEY'
      const key = req.headers['x-api-key'] || req.headers['X-API-KEY'] || req.query.api_key;

      if (!key) {
        return res.status(401).json({ message: "Akses ditolak. API Key tidak ditemukan." });
      }

      // 2. Cek Validitas Key di Database
      // Asumsi: Di database Anda kolom status adalah 'active' atau boolean is_active
      // Sesuaikan 'where' ini dengan struktur tabel ApiKey Anda
      const apiKeyData = await ApiKey.findOne({ 
        where: { 
            key: key, 
            status: 'active' // Pastikan kolom di DB namanya 'status' dan isinya 'active'
            // Jika pakai boolean: is_active: true 
        } 
      });

      if (!apiKeyData) {
        return res.status(403).json({ message: "API Key tidak valid atau tidak aktif." });
      }

      // 3. Cek Izin (Permissions) - HANYA JIKA DIPERLUKAN
      if (requiredPermission) {
        let userPerms = [];

        // Parsing permissions dengan aman
        try {
            if (Array.isArray(apiKeyData.permissions)) {
                userPerms = apiKeyData.permissions;
            } else if (typeof apiKeyData.permissions === 'string') {
                userPerms = JSON.parse(apiKeyData.permissions);
            }
        } catch (e) {
            console.error("Error parsing permissions:", e);
            userPerms = [];
        }

        // Cek apakah permission yang diminta ada di daftar permission user
        if (!userPerms.includes(requiredPermission)) {
          return res.status(403).json({ 
            message: `Akses terlarang. Key Anda tidak memiliki izin: '${requiredPermission}'` 
          });
        }
      }

      // 4. Simpan info partner ke request (agar bisa dibaca di controller)
      req.partner = apiKeyData;
      
      next();

    } catch (error) {
      console.error("API Key Middleware Error:", error);
      res.status(500).json({ message: "Server Error saat validasi Key" });
    }
  };
};

module.exports = verifyApiKey;