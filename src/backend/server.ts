import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';
import tutorialRoutes from './routes/tutorials';
import typingRoutes from './routes/typing';
import dsaRoutes from './routes/dsa.routes';

import progressRoutes from './routes/progress';
import communityRoutes from './routes/community';
import dashboardRoutes from './routes/dashboard';
import connectDB from './config/database';
import { AddressInfo } from 'net';

dotenv.config();

const app = express();

// Connect to MongoDB asynchronously
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB on startup:', err);
});

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection error in request handler:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to database'
    });
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/typing', typingRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: { statusCode?: number; status?: string; message?: string }, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  console.error('Express Error Handler caught:', err);
  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message || 'Something went wrong!'
  });
});

// Return message if server directly requested in browser
app.get('/', (req, res) => {
  res.send('Server is running');
});

const startServer = async () => {
  let port = parseInt(process.env.PORT || '3001');
  const maxPortAttempts = 10;
  
  for (let attempt = 0; attempt < maxPortAttempts; attempt++) {
    try {
      const server = app.listen(port, () => {
        const address = server.address() as AddressInfo;
        console.log(`Server running on port ${address.port}`);
      });
      return server;
    } catch (error: unknown) {
      if ((error as { code?: string }).code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}`);
        port++;
      } else {
        console.error('Failed to start server:', error);
        process.exit(1);
      }
    }
  }
  console.log('Server started on port: ' + process.env.PORT);
  console.error(`Could not find an available port after ${maxPortAttempts} attempts`);
  process.exit(1);
};

// Start standalone HTTP server only if not in test environment and not on Vercel Serverless
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  startServer();
}

export default app; 