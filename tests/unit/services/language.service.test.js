import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { LanguageService } from '../../../src/services/language.service.js';

/**
 * LanguageService Tests
 *
 * These tests verify language analysis and aggregation functionality.
 * Focus on implementing methods that work with language byte counts and percentages.
 *
 * Key Requirements:
 * - aggregateLanguages() should sum byte counts across repositories
 * - calculatePercentages() should convert totals to percentage strings (format: "XX.XX%")
 * - getLanguageDistribution() should orchestrate the full workflow
 *
 * IMPORTANT: Use Promise.all() in getLanguageDistribution() to fetch repo languages in parallel
 */
describe('LanguageService', () => {
  let languageService;
  let mockGithubService;

  beforeEach(() => {
    mockGithubService = {
      getUserRepos: jest.fn(),
      getRepoLanguages: jest.fn(),
    };
    languageService = new LanguageService(mockGithubService);
  });

  describe('aggregateLanguages - Summing byte counts', () => {
    test('combines byte counts from multiple repositories', () => {
      const languageData = [
        { JavaScript: 1000, Python: 500 },
        { JavaScript: 2000, TypeScript: 1500 },
        { Python: 300 },
      ];

      const result = languageService.aggregateLanguages(languageData);

      expect(result).toEqual({
        JavaScript: 3000,
        Python: 800,
        TypeScript: 1500,
      });
    });

    test('returns empty object when given empty array', () => {
      const result = languageService.aggregateLanguages([]);
      expect(result).toEqual({});
    });

    test('gracefully skips null or undefined entries', () => {
      const languageData = [
        { JavaScript: 1000 },
        null,
        undefined,
        { Python: 500 },
      ];

      const result = languageService.aggregateLanguages(languageData);

      expect(result).toEqual({
        JavaScript: 1000,
        Python: 500,
      });
    });

    test('handles single repository data correctly', () => {
      const languageData = [{ JavaScript: 1000, CSS: 200 }];

      const result = languageService.aggregateLanguages(languageData);

      expect(result).toEqual({
        JavaScript: 1000,
        CSS: 200,
      });
    });
  });

  describe('calculatePercentages - Converting to percentage strings', () => {
    test('calculates correct percentages for multiple languages', () => {
      const languageTotals = {
        JavaScript: 7000,
        TypeScript: 3000,
      };

      const result = languageService.calculatePercentages(languageTotals);

      expect(result).toEqual({
        JavaScript: '70.00%',
        TypeScript: '30.00%',
      });
    });

    test('returns 100% for single language', () => {
      const languageTotals = { JavaScript: 1000 };

      const result = languageService.calculatePercentages(languageTotals);

      expect(result).toEqual({
        JavaScript: '100.00%',
      });
    });

    test('returns empty object when no languages provided', () => {
      const languageTotals = {};

      const result = languageService.calculatePercentages(languageTotals);

      expect(result).toEqual({});
    });

    test('formats all percentages with exactly 2 decimal places', () => {
      const languageTotals = {
        JavaScript: 33,
        Python: 33,
        TypeScript: 34,
      };

      const result = languageService.calculatePercentages(languageTotals);

      // All values should have .XX% format
      expect(result.JavaScript).toMatch(/^\d+\.\d{2}%$/);
      expect(result.Python).toMatch(/^\d+\.\d{2}%$/);
      expect(result.TypeScript).toMatch(/^\d+\.\d{2}%$/);

      expect(result).toEqual({
        JavaScript: '33.00%',
        Python: '33.00%',
        TypeScript: '34.00%',
      });
    });

    test('handles very small percentages accurately', () => {
      const languageTotals = {
        JavaScript: 9999,
        Shell: 1,
      };

      const result = languageService.calculatePercentages(languageTotals);

      expect(result.JavaScript).toBe('99.99%');
      expect(result.Shell).toBe('0.01%');
    });
  });

  describe('getLanguageDistribution - Full workflow orchestration', () => {
    test('returns empty object when user has no repositories', async () => {
      mockGithubService.getUserRepos.mockResolvedValue([]);

      const result = await languageService.getLanguageDistribution('testuser');

      expect(result).toEqual({});
      expect(mockGithubService.getUserRepos).toHaveBeenCalledWith('testuser');
      expect(mockGithubService.getRepoLanguages).not.toHaveBeenCalled();
    });

    test('fetches language data for all repositories and calculates distribution', async () => {
      const mockRepos = [
        { name: 'repo1', owner: { login: 'testuser' } },
        { name: 'repo2', owner: { login: 'testuser' } },
        { name: 'repo3', owner: { login: 'testuser' } },
      ];

      mockGithubService.getUserRepos.mockResolvedValue(mockRepos);
      mockGithubService.getRepoLanguages
        .mockResolvedValueOnce({ JavaScript: 1000 })
        .mockResolvedValueOnce({ Python: 500 })
        .mockResolvedValueOnce({ JavaScript: 500, TypeScript: 1000 });

      const result = await languageService.getLanguageDistribution('testuser');

      expect(mockGithubService.getRepoLanguages).toHaveBeenCalledTimes(3);
      expect(result).toEqual({
        JavaScript: '50.00%',
        Python: '16.67%',
        TypeScript: '33.33%',
      });
    });

    test('continues processing even if individual repos fail', async () => {
      const mockRepos = [
        { name: 'repo1', owner: { login: 'testuser' } },
        { name: 'repo2', owner: { login: 'testuser' } },
      ];

      mockGithubService.getUserRepos.mockResolvedValue(mockRepos);
      mockGithubService.getRepoLanguages
        .mockResolvedValueOnce({ JavaScript: 1000 })
        .mockRejectedValueOnce(new Error('API Error'));

      const result = await languageService.getLanguageDistribution('testuser');

      expect(result).toEqual({
        JavaScript: '100.00%',
      });
    });

    test('handles null or undefined repos response', async () => {
      mockGithubService.getUserRepos.mockResolvedValue(null);

      const result = await languageService.getLanguageDistribution('testuser');

      expect(result).toEqual({});
    });
  });
});
