const jwt = require('jsonwebtoken');
const { UserStore } = require('../models/User');

const protectUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_book_app_jwt_key_2026');
      
      const user = await UserStore.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found or unauthorized' });
      }
      
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protectUser };
