const jwt = require('jsonwebtoken');
const { AdminStore } = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_book_app_jwt_key_2026');
      
      if (decoded.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied: Admin role required' });
      }

      const admin = await AdminStore.findById(decoded.id);
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Admin account not found' });
      }

      req.admin = admin;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Admin session expired or invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no admin token provided' });
  }
};

module.exports = { protectAdmin };
