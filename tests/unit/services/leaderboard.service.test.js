import { describe, test, expect, beforeEach } from '@jest/globals';
import { LeaderboardService } from '../../../src/services/leaderboard.service.js';

/**
 * LeaderboardService Tests
 *
 * These tests verify the leaderboard functionality.
 * Focus on implementing the getTop() method which sorts users by score descending.
 *
 * Key Requirements:
 * - getTop(limit) should return top N users sorted by score (highest first)
 * - Should handle edge cases: empty leaderboard, limit > total users
 * - Default limit should be 10
 */
describe('LeaderboardService', () => {
  let leaderboardService;

  beforeEach(() => {
    leaderboardService = new LeaderboardService();
  });

  describe('getTop - Core Functionality', () => {
    test('returns users sorted by score in descending order', () => {
      leaderboardService.addOrUpdate('user1', 10);
      leaderboardService.addOrUpdate('user2', 50);
      leaderboardService.addOrUpdate('user3', 30);
      leaderboardService.addOrUpdate('user4', 40);

      const top3 = leaderboardService.getTop(3);

      expect(top3).toHaveLength(3);
      expect(top3[0]).toEqual({ username: 'user2', score: 50 });
      expect(top3[1]).toEqual({ username: 'user4', score: 40 });
      expect(top3[2]).toEqual({ username: 'user3', score: 30 });
    });

    test('returns all users when requested limit exceeds total users', () => {
      leaderboardService.addOrUpdate('user1', 10);
      leaderboardService.addOrUpdate('user2', 20);

      const top10 = leaderboardService.getTop(10);

      expect(top10).toHaveLength(2);
      expect(top10[0].score).toBeGreaterThanOrEqual(top10[1].score);
    });

    test('returns empty array when leaderboard is empty', () => {
      const top = leaderboardService.getTop();
      expect(top).toEqual([]);
    });

    test('uses default limit of 10 when no limit specified', () => {
      // Add 15 users
      for (let i = 1; i <= 15; i++) {
        leaderboardService.addOrUpdate(`user${i}`, i);
      }

      const top = leaderboardService.getTop();

      expect(top).toHaveLength(10);
      expect(top[0].score).toBe(15);
      expect(top[9].score).toBe(6);
    });

    test('maintains sort order when multiple users have same score', () => {
      leaderboardService.addOrUpdate('user1', 50);
      leaderboardService.addOrUpdate('user2', 50);
      leaderboardService.addOrUpdate('user3', 30);

      const top = leaderboardService.getTop();

      expect(top[0].score).toBe(50);
      expect(top[1].score).toBe(50);
      expect(top[2].score).toBe(30);
    });
  });

  describe('Other LeaderboardService Methods', () => {
    test('addOrUpdate creates new entry and returns it', () => {
      const result = leaderboardService.addOrUpdate('octocat', 42);

      expect(result).toEqual({ username: 'octocat', score: 42 });
      expect(leaderboardService.getScore('octocat')).toBe(42);
    });

    test('addOrUpdate overwrites existing user score', () => {
      leaderboardService.addOrUpdate('octocat', 42);
      const result = leaderboardService.addOrUpdate('octocat', 100);

      expect(result).toEqual({ username: 'octocat', score: 100 });
      expect(leaderboardService.getScore('octocat')).toBe(100);
    });

    test('getScore retrieves stored score', () => {
      leaderboardService.addOrUpdate('octocat', 42);
      expect(leaderboardService.getScore('octocat')).toBe(42);
    });

    test('getScore returns 0 for non-existent user', () => {
      expect(leaderboardService.getScore('nonexistent')).toBe(0);
    });

    test('size returns correct number of users', () => {
      expect(leaderboardService.size()).toBe(0);

      leaderboardService.addOrUpdate('user1', 10);
      expect(leaderboardService.size()).toBe(1);

      leaderboardService.addOrUpdate('user2', 20);
      expect(leaderboardService.size()).toBe(2);

      leaderboardService.addOrUpdate('user1', 30);
      expect(leaderboardService.size()).toBe(2);
    });
  });
});
