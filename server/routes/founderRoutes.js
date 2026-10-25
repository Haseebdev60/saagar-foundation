import express from 'express';
import { getFounderInfo, updateFounderInfo } from '../controllers/founderController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getFounderInfo);
router.put('/', protectAdmin, updateFounderInfo);

export default router;
