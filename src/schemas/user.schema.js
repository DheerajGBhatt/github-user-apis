import { z } from 'zod';

/**
 * Validation schemas using Zod
 * Validates GitHub usernames according to GitHub's rules
 */

/**
 * GitHub username validation rules:
 * - Cannot start or end with a hyphen
 * - Can only contain alphanumeric characters and hyphens
 * - Maximum 39 characters
 * - Minimum 1 character
 */
const usernameValidation = z
  .string()
  .min(1, 'Username is required')
  .max(39, 'GitHub username cannot exceed 39 characters')
  .regex(
    /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
    'Invalid GitHub username format. Must contain only alphanumeric characters and hyphens, and cannot start or end with a hyphen'
  );

/**
 * Schema for POST /users request body
 * Accepts an array of GitHub usernames
 */
export const rankUserSchema = z.object({
  body: z.object({
    usernames: z
      .array(usernameValidation)
      .min(1, 'At least one username is required')
      .max(100, 'Cannot process more than 100 users at once'),
  }),
});

/**
 * Schema for GET /users/:username/* path parameters
 */
export const usernameParamSchema = z.object({
  params: z.object({
    username: usernameValidation,
  }),
});
