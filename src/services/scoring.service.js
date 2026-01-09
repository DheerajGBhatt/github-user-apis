/**
 * Scoring Service
 * Calculates developer impact score based on GitHub events
 */
export class ScoringService {
  /**
   * Calculate total impact score from GitHub events
   * @param {Array} events - Array of GitHub event objects
   * @returns {number} Total impact score
   */
  calculateImpactScore(events) {
    if (!Array.isArray(events)) {
      return 0
    }

    let score = 0
    for (const event of events) {
      score += this.getEventPoints(event)
    }

    return score
  }

  /**
   * Get points for a single GitHub event
   * @param {Object} event - GitHub event object
   * @returns {number} Points for this event
   */
  getEventPoints(event) {
    // TODO: Implement scoring logic based on event type
    // Event types and their points:
    // - PushEvent: 1 point
    // - PullRequestEvent (opened): 5 points
    // - PullRequestEvent (merged): 10 points
    // - PullRequestReviewEvent: 3 points
    // - Other events: 0 points
    // Hint: Check event.type and event.payload for details
  }
}

// Singleton instance
export const scoringService = new ScoringService()
