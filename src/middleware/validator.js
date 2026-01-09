import { ZodError } from 'zod';

/**
 * Validation middleware using Zod schemas
 * @param {Object} schema - Zod schema object
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request data against schema
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors for better readability
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          error: 'Validation failed',
          details: formattedErrors,
        });
      }
      next(error);
    }
  };
};
