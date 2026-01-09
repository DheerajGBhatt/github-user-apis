import { githubService } from '../services/github.service.js';
import { scoringService } from '../services/scoring.service.js';
import { languageService } from '../services/language.service.js';
import { leaderboardService } from '../services/leaderboard.service.js';

/**
 * User Controller
 * Handles HTTP requests and orchestrates service calls
 */
export class UserController {
  constructor(
    githubServiceInstance = githubService,
    scoringServiceInstance = scoringService,
    languageServiceInstance = languageService,
    leaderboardServiceInstance = leaderboardService
  ) {
    this.githubService = githubServiceInstance;
    this.scoringService = scoringServiceInstance;
    this.languageService = languageServiceInstance;
    this.leaderboardService = leaderboardServiceInstance;
  }

  /**
   * POST /users
   * Rank multiple users and calculate their impact scores
   * Returns a leaderboard sorted by score descending
   */
  async rankUser(req, res, next) {
    try {
      const { usernames } = req.body;

      // Process all users in parallel
      const userResults = await Promise.all(
        usernames.map(async (username) => {
          try {
            // Fetch last 50 public events from GitHub
            const events = await this.githubService.getUserEvents(username);

            // Calculate impact score
            const score = this.scoringService.calculateImpactScore(events);

            // Update leaderboard
            this.leaderboardService.addOrUpdate(username, score);

            return { username, score, success: true };
          } catch (error) {
            // If a user fails, include error info but continue processing others
            return {
              username,
              score: 0,
              success: false,
              error: error.message,
            };
          }
        })
      );

      // Filter successful results and sort by score descending
      const leaderboard = userResults
        .filter((result) => result.success)
        .sort((a, b) => b.score - a.score);

      // Include failed users separately
      const failed = userResults
        .filter((result) => !result.success)
        .map(({ username, error }) => ({ username, error }));

      // Return 201 Created with leaderboard
      res.status(201).json({
        leaderboard,
        failed: failed.length > 0 ? failed : undefined,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /users/:username/projects
   * Get all public repositories for a user
   */
  async getProjects(req, res, next) {
    try {
      const { username } = req.params;

      // Fetch repositories from GitHub
      const repos = await this.githubService.getUserRepos(username);

      // Map to required fields only
      const projects = repos.map((repo) => ({
        name: repo.name,
        stargazers_count: repo.stargazers_count,
        primary_language: repo.language,
      }));

      res.json(projects);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /users/:username/languages
   * Get language distribution for a user
   */
  async getLanguages(req, res, next) {
    try {
      const { username } = req.params;

      // Get language distribution (uses Promise.all internally)
      const languages = await this.languageService.getLanguageDistribution(
        username
      );

      res.json(languages);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /leaderboard
   * Get top users from the leaderboard (bonus endpoint)
   */
  async getLeaderboard(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const topUsers = this.leaderboardService.getTop(limit);

      res.json({
        count: topUsers.length,
        users: topUsers,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Singleton instance
export const userController = new UserController();
