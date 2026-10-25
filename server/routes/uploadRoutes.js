import express from 'express';
import { uploadMiddleware, handleImageUpload } from '../controllers/uploadController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protectAdmin, uploadMiddleware.single('image'), handleImageUpload);

export default router;
