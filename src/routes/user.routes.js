import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { validate } from '../middleware/validator.js';
import {
  rankUserSchema,
  usernameParamSchema,
} from '../schemas/user.schema.js';

const router = express.Router();

/**
 * POST /users
 * Rank multiple GitHub users and calculate their impact scores
 * Request body: { "usernames": ["octocat", "torvalds", "gaearon"] }
 * Response: {
 *   "leaderboard": [
 *     { "username": "torvalds", "score": 150 },
 *     { "username": "octocat", "score": 42 },
 *     { "username": "gaearon", "score": 38 }
 *   ],
 *   "failed": [{ "username": "nonexistent", "error": "User not found" }]
 * }
 */
router.post(
  '/',
  validate(rankUserSchema),
  userController.rankUser.bind(userController)
);

/**
 * GET /users/:username/projects
 * Get all public repositories for a user
 * Response: [{ "name": "repo", "stargazers_count": 123, "primary_language": "JavaScript" }]
 */
router.get(
  '/:username/projects',
  validate(usernameParamSchema),
  userController.getProjects.bind(userController)
);

/**
 * GET /users/:username/languages
 * Get language distribution across all user's repositories
 * Response: { "JavaScript": "70.00%", "TypeScript": "30.00%" }
 */
router.get(
  '/:username/languages',
  validate(usernameParamSchema),
  userController.getLanguages.bind(userController)
);

export default router;
