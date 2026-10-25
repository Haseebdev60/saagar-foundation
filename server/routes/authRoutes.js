import express from 'express';
import { login, logout, getMe, getDashboardStats, updatePassword } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/auth.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', loginRateLimiter, login);
router.post('/logout', logout);
router.get('/me', protectAdmin, getMe);
router.get('/dashboard-stats', protectAdmin, getDashboardStats);
router.put('/update-password', protectAdmin, updatePassword);

export default router;
