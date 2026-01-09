/**
 * Leaderboard Service
 * Maintains an in-memory leaderboard of user scores
 */
export class LeaderboardService {
  constructor() {
    this.leaderboard = new Map() // username -> score
  }

  /**
   * Add or update a user's score in the leaderboard
   * @param {string} username - GitHub username
   * @param {number} score - User's impact score
   * @returns {Object} Object with username and score
   */
  addOrUpdate(username, score) {
    this.leaderboard.set(username, score)
    return { username, score }
  }

  /**
   * Get a user's score from the leaderboard
   * @param {string} username - GitHub username
   * @returns {number} User's score or 0 if not found
   */
  getScore(username) {
    return this.leaderboard.get(username) || 0
  }

  /**
   * Get the top N users from the leaderboard
   * @param {number} limit - Number of top users to return (default: 10)
   * @returns {Array} Array of {username, score} objects sorted by score descending
   */
  getTop(limit = 10) {
    // TODO: Implement getting top N users
    // 1. Convert Map to array of entries
    // 2. Sort by score in descending order (highest scores first)
    // 3. Take only the first 'limit' entries
    // 4. Transform to array of {username, score} objects
  }

  /**
   * Get all leaderboard entries
   * @returns {Array} Array of {username, score} objects
   */
  getAll() {
    return Array.from(this.leaderboard.entries()).map(([username, score]) => ({
      username,
      score,
    }))
  }

  /**
   * Clear the leaderboard
   */
  clear() {
    this.leaderboard.clear()
  }

  /**
   * Get the total number of users in the leaderboard
   * @returns {number} Number of users
   */
  size() {
    return this.leaderboard.size
  }
}

// Singleton instance
export const leaderboardService = new LeaderboardService()
