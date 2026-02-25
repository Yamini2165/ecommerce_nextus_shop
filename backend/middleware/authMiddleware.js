/**
 * middleware/authMiddleware.js - JWT Authentication & Authorization
 */

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * protect - Verifies JWT token and attaches user to request
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization header for Bearer token
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

/**
 * admin - Restricts access to admin users only
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

/**
 * generateToken - Creates a signed JWT token
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};
