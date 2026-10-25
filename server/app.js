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

// Security and middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
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
    return res.status(500).json({ success: false, message: 'Database connection failed' });
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

// Mount on both /api and root so serverless requests always match
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Central error handler
app.use(errorHandler);

export default app;
