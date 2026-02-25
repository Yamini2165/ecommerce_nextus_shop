/**
 * routes/uploadRoutes.js - File Upload Routes
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // Unique filename: fieldname-timestamp.ext
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({
    success: true,
    data: {
      url: `/${req.file.path}`,
      filename: req.file.filename,
    },
  });
});

export default router;
