import { githubService } from "./github.service.js"

/**
 * Language Service
 * Analyzes language distribution across a user's repositories
 * Uses Promise.all() for efficient parallel API calls (Senior Signal)
 */
export class LanguageService {
  constructor(githubServiceInstance = githubService) {
    this.githubService = githubServiceInstance
  }

  /**
   * Get language distribution for a user across all their repositories
   * @param {string} username - GitHub username
   * @returns {Promise<Object>} Object with language percentages (e.g., {"JavaScript": "70.00%"})
   */
  async getLanguageDistribution(username) {
    // TODO: Implement language distribution analysis
    // Step 1: Fetch all repositories for the user
    // Step 2: Use Promise.all() to fetch language data for all repos in parallel
    // Step 3: Aggregate the language totals using aggregateLanguages()
    // Step 4: Calculate percentages using calculatePercentages()
    // Bonus: Handle errors gracefully (individual repo failures shouldn't crash everything)
  }

  /**
   * Aggregate language byte counts from multiple repositories
   * @param {Array<Object>} languageDataArray - Array of language objects from repos
   * @returns {Object} Aggregated language totals
   */
  aggregateLanguages(languageDataArray) {
    const totals = {}

    // TODO: Sum up byte counts for each language across all repos
    // Example input: [{ JavaScript: 1000, Python: 500 }, { JavaScript: 2000, Ruby: 300 }]
    // Expected output: { JavaScript: 3000, Python: 500, Ruby: 300 }

    return totals
  }

  /**
   * Calculate percentage distribution of languages
   * @param {Object} languageTotals - Object with language names and byte counts
   * @returns {Object} Object with language percentages
   */
  calculatePercentages(languageTotals) {
    const percentages = {}

    // TODO: Convert byte counts to percentage strings
    // Example input: { JavaScript: 7000, Python: 3000 }
    // Expected output: { JavaScript: "70.00%", Python: "30.00%" }
    // Hint: Calculate total bytes first, then compute each language's percentage

    return percentages
  }
}

// Singleton instance
export const languageService = new LanguageService()
