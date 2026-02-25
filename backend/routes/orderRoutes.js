/**
 * routes/orderRoutes.js - Order Routes
 */

import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/pay', updateOrderToPaid);

// Admin routes
router.get('/', admin, getAllOrders);
router.get('/admin/stats', admin, getOrderStats);
router.put('/:id/deliver', admin, updateOrderToDelivered);
router.put('/:id/status', admin, updateOrderStatus);

export default router;
