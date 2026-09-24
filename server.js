const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan')
require('dotenv').config();

const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'))
// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '📖 Book App API Server is running smoothly!',
    version: '1.0.0',
    endpoints: {
      userApi: '/api/user',
      adminApi: '/api/admin'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📡 User API: https://eventmanagemen-production.up.railway.app/api/user`);
  console.log(`🛡️ Admin API: https://eventmanagemen-production.up.railway.app/api/admin`);
});
