/**
 * middleware/errorMiddleware.js - Centralized Error Handling
 */

/**
 * notFound - Handles 404 errors for undefined routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * errorHandler - Global error handler with environment-aware stack traces
 */
export const errorHandler = (err, req, res, next) => {
  // Sometimes Express sets status 200 even with an error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
    });
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Resource not found (invalid ID format)',
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only include stack trace in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
