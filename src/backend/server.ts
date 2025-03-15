import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
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

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
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
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});
//return message if server directely requested in browser
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
    } catch (error: any) {
      if (error.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}`);
        port++;
      } else {
        console.error('Failed to start server:', error);
        process.exit(1);
      }
    }
  }
  
  console.error(`Could not find an available port after ${maxPortAttempts} attempts`);
  process.exit(1);
};

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app; 