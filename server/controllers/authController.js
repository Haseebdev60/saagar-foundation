import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { ContactSubmission } from '../models/ContactSubmission.js';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'saagar_foundation_secret_key_2026_secure_jwt';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id);

    // Set secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
  });
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ isPublished: true });
    const totalSubmissions = await ContactSubmission.countDocuments();
    const unreadSubmissions = await ContactSubmission.countDocuments({ status: 'unread' });

    res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        publishedEvents,
        totalSubmissions,
        unreadSubmissions,
      },
    });
  } catch (error) {
    next(error);
  }
};
