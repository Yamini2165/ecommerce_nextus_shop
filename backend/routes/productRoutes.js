/**
 * routes/productRoutes.js - Product Routes
 */

import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategories,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Private routes
router.post('/:id/reviews', protect, createProductReview);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
