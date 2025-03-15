import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      // Use a fallback connection string for development
      console.warn('MONGODB_URI is not defined in environment variables, using fallback local connection');
      await mongoose.connect('mongodb://localhost:27017/tutorialhub');
      console.log('MongoDB Connected to local database');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    // Don't exit process here, let the application handle the error
    throw error;
  }
};

export default connectDB; 