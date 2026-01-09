import { describe, test, expect, beforeEach } from '@jest/globals';
import { ScoringService } from '../../../src/services/scoring.service.js';

/**
 * ScoringService Tests
 *
 * These tests verify the scoring logic for GitHub events.
 * Use these as specifications for implementing the calculateImpactScore method.
 *
 * Scoring Rules:
 * - PushEvent: 1 point
 * - PullRequestEvent (opened): 5 points
 * - PullRequestEvent (merged): 10 points
 * - PullRequestReviewEvent: 3 points
 * - Unknown events: 0 points
 */
describe('ScoringService', () => {
  let scoringService;

  beforeEach(() => {
    scoringService = new ScoringService();
  });

  describe('calculateImpactScore', () => {
    test('returns 0 when given empty array', () => {
      const events = [];
      expect(scoringService.calculateImpactScore(events)).toBe(0);
    });

    test('returns 0 when given invalid input (not an array)', () => {
      expect(scoringService.calculateImpactScore(null)).toBe(0);
      expect(scoringService.calculateImpactScore(undefined)).toBe(0);
      expect(scoringService.calculateImpactScore('invalid')).toBe(0);
    });

    test('awards 1 point for a PushEvent', () => {
      const events = [{ type: 'PushEvent' }];
      expect(scoringService.calculateImpactScore(events)).toBe(1);
    });

    test('correctly sums points from multiple PushEvents', () => {
      const events = [
        { type: 'PushEvent' },
        { type: 'PushEvent' },
        { type: 'PushEvent' },
      ];
      expect(scoringService.calculateImpactScore(events)).toBe(3);
    });

    test('awards 5 points when pull request is opened', () => {
      const events = [
        {
          type: 'PullRequestEvent',
          payload: {
            action: 'opened',
            pull_request: { merged: false },
          },
        },
      ];
      expect(scoringService.calculateImpactScore(events)).toBe(5);
    });

    test('awards 10 points when pull request is merged', () => {
      const events = [
        {
          type: 'PullRequestEvent',
          payload: {
            pull_request: { merged: true },
          },
        },
      ];
      expect(scoringService.calculateImpactScore(events)).toBe(10);
    });

    test('awards 10 points for merged PR even if action is "opened"', () => {
      const events = [
        {
          type: 'PullRequestEvent',
          payload: {
            action: 'opened',
            pull_request: { merged: true },
          },
        },
      ];
      expect(scoringService.calculateImpactScore(events)).toBe(10);
    });

    test('awards 3 points for reviewing a pull request', () => {
      const events = [{ type: 'PullRequestReviewEvent' }];
      expect(scoringService.calculateImpactScore(events)).toBe(3);
    });

    test('correctly calculates total score from diverse event types', () => {
      const events = [
        { type: 'PushEvent' },
        { type: 'PushEvent' },
        {
          type: 'PullRequestEvent',
          payload: { action: 'opened', pull_request: { merged: false } },
        },
        { type: 'PullRequestReviewEvent' },
        {
          type: 'PullRequestEvent',
          payload: { pull_request: { merged: true } },
        },
      ];
      // 1 + 1 + 5 + 3 + 10 = 20
      expect(scoringService.calculateImpactScore(events)).toBe(20);
    });

    test('ignores events that are not scored (IssuesEvent, ForkEvent, etc)', () => {
      const events = [
        { type: 'IssuesEvent' },
        { type: 'ForkEvent' },
        { type: 'WatchEvent' },
      ];
      expect(scoringService.calculateImpactScore(events)).toBe(0);
    });

    test('handles events missing type property gracefully', () => {
      const events = [{ payload: {} }, {}];
      expect(scoringService.calculateImpactScore(events)).toBe(0);
    });

    test('awards 0 points when PR is closed without being merged', () => {
      const events = [
        {
          type: 'PullRequestEvent',
          payload: {
            action: 'closed',
            pull_request: { merged: false },
          },
        },
      ];
      expect(scoringService.calculateImpactScore(events)).toBe(0);
    });
  });
});
