import express from 'express';
import userRoutes from './routes/user.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { validateEnv } from './config/env.js';

/**
 * Create and configure Express application
 */
export function createApp() {
  const app = express();

  // Validate environment variables on startup
  validateEnv();

  // Built-in middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use('/users', userRoutes);

  // 404 handler - must be after all routes
  app.use(notFoundHandler);

  // Global error handler - must be last
  app.use(errorHandler);

  return app;
}
