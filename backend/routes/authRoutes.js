/**
 * routes/authRoutes.js - Authentication Routes
 */

import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes (require JWT)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin routes
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;
