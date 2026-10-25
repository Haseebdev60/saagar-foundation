import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// In standalone production mode, serve the static frontend dist folder
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start standalone server
const startServer = async () => {
  try {
    await connectDB();
    try {
      await seedDatabase();
    } catch (seedErr) {
      console.warn('[Seed] Notice during seed check:', seedErr.message);
    }

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`[Saagar Foundation API Server] Running on http://localhost:${PORT}`);
      console.log(`[Environment] ${process.env.NODE_ENV || 'development'}`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('[Server Error] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
