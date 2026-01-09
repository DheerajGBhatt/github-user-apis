import axios from "axios"
import { env } from "../config/env.js"
import { NotFoundError, RateLimitError } from "../utils/errors.js"

/**
 * GitHub Service
 * Handles all communication with the GitHub REST API
 */
export class GitHubService {
  constructor() {
    this.baseURL = env.GITHUB_API_BASE_URL
    this.token = env.GITHUB_TOKEN

    // Create axios instance with default config
    // TODO: Configure axios instance with baseURL and headers
    this.client = axios.create()
  }

  /**
   * Fetch data from GitHub API
   * @param {string} endpoint - API endpoint (e.g., '/users/octocat/events')
   * @returns {Promise<*>} API response data
   */
  async fetch(endpoint) {
    try {
      const response = await this.client.get(endpoint)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Get last 50 public events for a user
   * @param {string} username - GitHub username
   * @returns {Promise<Array>} Array of event objects
   */
  async getUserEvents(username) {
    // TODO: Implement fetching user events from GitHub API
    // Endpoint: /users/{username}/events/public?per_page=50
  }

  /**
   * Get all public repositories for a user
   * @param {string} username - GitHub username
   * @returns {Promise<Array>} Array of repository objects
   */
  async getUserRepos(username) {
    // TODO: Implement fetching user repositories from GitHub API
    // Endpoint: /users/{username}/repos?per_page=100&type=public
  }

  /**
   * Get language statistics for a repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Object>} Object with language names and byte counts
   */
  async getRepoLanguages(owner, repo) {
    // TODO: Implement fetching repository language statistics from GitHub API
    // Endpoint: /repos/{owner}/{repo}/languages
  }

  /**
   * Handle GitHub API errors
   * @param {Error} error - Axios error object
   * @throws {NotFoundError|RateLimitError|Error}
   */
  handleError(error) {
    // TODO: Implement error handling
    // Handle different HTTP status codes:
    // - 404: NotFoundError
    // - 403: RateLimitError (if rate limit exceeded)
    // - 401: Authentication error
    // - Network errors: Connection issues
  }
}

// Singleton instance
export const githubService = new GitHubService()
