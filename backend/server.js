/**
 * server.js - Main Entry Point
 * MERN E-Commerce Application
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import colors from 'colors';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports 
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Middleware and DB imports 
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

// Load environment variables 
dotenv.config();

// Connect to MongoDB (Auto-seeding now happens inside this function) 
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads 
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes); 
app.use('/api/upload', uploadRoutes); 

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ── Error Handling Middleware ─────────────────────────────────────────────────
app.use(notFound); 
app.use(errorHandler); 

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

export default app;