import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import tutorialRoutes from './routes/tutorials';
import progressRoutes from './routes/progress';
import dsaRoutes from './routes/dsa';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/tutorials/create', tutorialRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tutorial-platform')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app; 