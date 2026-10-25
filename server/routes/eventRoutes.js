import express from 'express';
import {
  getPublishedEvents,
  getEventByIdOrSlug,
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventsController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPublishedEvents);
router.get('/detail/:idOrSlug', getEventByIdOrSlug);

// Admin-only routes
router.get('/admin/all', protectAdmin, getAllEventsAdmin);
router.post('/', protectAdmin, createEvent);
router.put('/:id', protectAdmin, updateEvent);
router.delete('/:id', protectAdmin, deleteEvent);

export default router;
