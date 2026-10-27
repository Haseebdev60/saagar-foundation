import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import founderRoutes from './routes/founderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy for Vercel / reverse proxy deployment
app.set('trust proxy', 1);

// Security and middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Allowed origins for CORS — restrict to known domains
const ALLOWED_ORIGINS = [
  'https://saagar-contact-work.vercel.app',
  'https://saagarfoundation.org',
  'https://www.saagarfoundation.org',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, mobile apps)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.some((allowed) => origin === allowed || origin.endsWith('.vercel.app'))) {
        return callback(null, true);
      }
      callback(new Error('CORS: Origin not allowed'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Connect to MongoDB
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[DB Error in Request]:', err.message);
    return res.status(500).json({ success: false, message: 'Database connection failed', error: err.message });
  }
});

// Static uploads directory (for non-serverless local development)
if (!process.env.VERCEL) {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// Router to support both /api/... and direct serverless rewrites
const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    organization: 'Saagar Foundation',
    mission: 'People first. Kindness always.',
  });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/events', eventRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/donation-info', donationRoutes);
apiRouter.use('/founder-info', founderRoutes);
apiRouter.use('/upload', uploadRoutes);

// Mount API routes under /api prefix only
app.use('/api', apiRouter);

// For Vercel serverless: requests rewritten to /api already match above
// No longer exposing routes on root / to prevent unintended access

// Central error handler
app.use(errorHandler);

export default app;
