import express from 'express';
import {
  submitContact,
  getSubmissionsAdmin,
  updateSubmissionStatus,
  deleteSubmission,
} from '../controllers/contactController.js';
import { protectAdmin } from '../middleware/auth.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public submission
router.post('/', contactRateLimiter, submitContact);

// Admin-only management
router.get('/admin/all', protectAdmin, getSubmissionsAdmin);
router.patch('/admin/:id', protectAdmin, updateSubmissionStatus);
router.delete('/admin/:id', protectAdmin, deleteSubmission);

export default router;
