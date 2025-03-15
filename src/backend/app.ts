import express from 'express';
import adminRoutes from './routes/admin';
import dotenv from 'dotenv';
import dsaRoutes from './routes/dsa.routes';
dotenv.config();
// ... other imports

const app = express();

// ... other middleware and routes

app.use('/api/admin', adminRoutes);
app.use('/api/dsa', dsaRoutes);

// ... start the server 