import { env } from '../config/env.js';

/**
 * Global error handler middleware
 * Catches all errors and formats them into consistent JSON responses
 */
export const errorHandler = (err, req, res, next) => {
  // Log error in development
  if (env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Handle operational errors (errors we know about)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Handle unexpected errors
  console.error('Unexpected error:', err);
  res.status(500).json({
    error: 'Internal server error',
    ...(env.NODE_ENV === 'development' && { details: err.message }),
  });
};

/**
 * 404 Not Found handler
 * Catches requests to undefined routes
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
};
