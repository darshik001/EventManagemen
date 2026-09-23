const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserStore } = require('../models/User');

const generateToken = (id, role = 'user') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'super_secret_book_app_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/user/auth/register
const registerUser = async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;

    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields: fullName, email, mobile, password' });
    }

    // Check existing email or mobile
    const existingEmail = await UserStore.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const existingMobile = await UserStore.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({ success: false, message: 'User with this mobile number already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserStore.create({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      profileImage: '',
      theme: 'light',
      language: 'english',
      subscription: {
        planId: 'free_plan',
        planTitle: 'Free Plan',
        status: 'active',
        startDate: new Date().toISOString()
      }
    });

    const token = generateToken(user._id || user.id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id || user.id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
        theme: user.theme,
        language: user.language,
        subscription: user.subscription,
        token
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server registration error', error: error.message });
  }
};

// @desc    Login user with Email OR Mobile and Password
// @route   POST /api/user/auth/login
const loginUser = async (req, res) => {
  try {
    const { loginId, email, mobile, password } = req.body;
    const identifier = loginId || email || mobile;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Email/Mobile and Password' });
    }

    // Find user by email or mobile
    let user = await UserStore.findOne({ email: identifier });
    if (!user) {
      user = await UserStore.findOne({ mobile: identifier });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials: User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials: Incorrect password' });
    }

    const token = generateToken(user._id || user.id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id || user.id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
        theme: user.theme,
        language: user.language,
        subscription: user.subscription,
        token
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server login error', error: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/user/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your registered Email' });
    }

    const user = await UserStore.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email address' });
    }

    // Generate standard 6-digit OTP code for reset
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();

    return res.status(200).json({
      success: true,
      message: 'Password reset OTP generated successfully',
      data: {
        email: user.email,
        resetOtp,
        note: 'Use this OTP to reset your password via the Change Password endpoint'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Forgot password error', error: error.message });
  }
};

// @desc    Change Password
// @route   POST /api/user/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { email, newPassword, oldPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email and newPassword' });
    }

    const user = await UserStore.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Old password does not match' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await UserStore.findByIdAndUpdate(user._id || user.id, { password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please login with your new password.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Change password error', error: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/user/auth/logout
const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  changePassword,
  logoutUser
};
