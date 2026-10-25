import express from 'express';
import { getDonationInfo, updateDonationInfo } from '../controllers/donationController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDonationInfo);
router.put('/', protectAdmin, updateDonationInfo);

export default router;
