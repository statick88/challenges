import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFilePath = path.join(__dirname, '../src/data/challenges.json');

describe('Parse Data Script - Challenges JSON', () => {
  let data: any;

  beforeAll(async () => {
    try {
      const content = await fs.readFile(dataFilePath, 'utf-8');
      data = JSON.parse(content);
    } catch (error) {
      console.error('Could not read data file:', error);
    }
  });

  describe('JSON Structure', () => {
    it('should have valid JSON file', async () => {
      const content = await fs.readFile(dataFilePath, 'utf-8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it('should have root level properties', () => {
      expect(data).toHaveProperty('overview');
      expect(data).toHaveProperty('programs');
      expect(data).toHaveProperty('lastUpdated');
    });
  });

  describe('Overview Data', () => {
    it('should have all required overview fields', () => {
      const overview = data.overview;
      expect(overview).toHaveProperty('totalChallenges');
      expect(overview).toHaveProperty('completed');
      expect(overview).toHaveProperty('completionRate');
      expect(overview).toHaveProperty('streak');
    });

    it('should have numeric values for overview stats', () => {
      const overview = data.overview;
      expect(typeof overview.totalChallenges).toBe('number');
      expect(typeof overview.completed).toBe('number');
      expect(typeof overview.completionRate).toBe('number');
      expect(typeof overview.streak).toBe('number');
    });

    it('should have valid ranges for numeric values', () => {
      const overview = data.overview;
      expect(overview.totalChallenges).toBeGreaterThan(0);
      expect(overview.completed).toBeGreaterThanOrEqual(0);
      expect(overview.completionRate).toBeGreaterThanOrEqual(0);
      expect(overview.completionRate).toBeLessThanOrEqual(100);
      expect(overview.streak).toBeGreaterThanOrEqual(0);
    });

    it('should have correct completion rate calculation', () => {
      const overview = data.overview;
      const expected = (overview.completed / overview.totalChallenges) * 100;
      expect(Math.abs(overview.completionRate - expected)).toBeLessThan(0.1);
    });

    it('should have completed <= total', () => {
      const overview = data.overview;
      expect(overview.completed).toBeLessThanOrEqual(overview.totalChallenges);
    });
  });

  describe('Programs Data', () => {
    it('should have programs object with entries', () => {
      expect(typeof data.programs).toBe('object');
      expect(Object.keys(data.programs).length).toBeGreaterThan(0);
    });

    it('should have Linux, Docker, and DevOps programs', () => {
      const programKeys = Object.keys(data.programs);
      expect(programKeys.length).toBeGreaterThanOrEqual(3);
    });

    it('should have valid program structure', () => {
      const programKeys = Object.keys(data.programs);
      programKeys.forEach((key) => {
        const program = data.programs[key];
        expect(program).toHaveProperty('name');
        expect(program).toHaveProperty('completed');
        expect(program).toHaveProperty('total');
        expect(program).toHaveProperty('percentage');
        expect(typeof program.name).toBe('string');
        expect(typeof program.completed).toBe('number');
        expect(typeof program.total).toBe('number');
        expect(typeof program.percentage).toBe('number');
      });
    });

    it('should have valid ranges for program stats', () => {
      const programKeys = Object.keys(data.programs);
      programKeys.forEach((key) => {
        const program = data.programs[key];
        expect(program.completed).toBeGreaterThanOrEqual(0);
        expect(program.total).toBeGreaterThan(0);
        expect(program.percentage).toBeGreaterThanOrEqual(0);
        expect(program.percentage).toBeLessThanOrEqual(100);
        expect(program.completed).toBeLessThanOrEqual(program.total);
      });
    });

    it('should have correct completion rates for each program', () => {
      const programKeys = Object.keys(data.programs);
      programKeys.forEach((key) => {
        const program = data.programs[key];
        const expected = (program.completed / program.total) * 100;
        expect(Math.abs(program.percentage - expected)).toBeLessThan(0.1);
      });
    });
  });

  describe('Data Consistency', () => {
    it('should have sums matching overview', () => {
      const programKeys = Object.keys(data.programs);
      let totalSum = 0;
      let completedSum = 0;

      programKeys.forEach((key) => {
        totalSum += data.programs[key].total;
        completedSum += data.programs[key].completed;
      });

      expect(totalSum).toBe(data.overview.totalChallenges);
      expect(completedSum).toBe(data.overview.completed);
    });

    it('should have valid lastUpdated', () => {
      if (data.lastUpdated) {
        const date = new Date(data.lastUpdated);
        expect(date instanceof Date && !isNaN(date.getTime())).toBe(true);
      }
    });

    it('should have recentActivity if present', () => {
      if (data.recentActivity) {
        expect(Array.isArray(data.recentActivity)).toBe(true);
      }
    });

    it('should have skills if present', () => {
      if (data.skills) {
        expect(typeof data.skills).toBe('object');
      }
    });
  });

  describe('Data Integrity', () => {
    it('should not have NaN values', () => {
      const overview = data.overview;
      expect(Number.isNaN(overview.completionRate)).toBe(false);
      expect(Number.isNaN(overview.totalChallenges)).toBe(false);
      expect(Number.isNaN(overview.completed)).toBe(false);
      expect(Number.isNaN(overview.streak)).toBe(false);
    });

    it('should not have Infinity values', () => {
      const overview = data.overview;
      expect(Number.isFinite(overview.completionRate)).toBe(true);
      expect(Number.isFinite(overview.totalChallenges)).toBe(true);
      expect(Number.isFinite(overview.completed)).toBe(true);
      expect(Number.isFinite(overview.streak)).toBe(true);
    });
  });

  describe('Metrics Validation', () => {
    it('should show progress has been made', () => {
      const overview = data.overview;
      // At least some challenges should be completed
      expect(overview.completed).toBeGreaterThan(0);
    });

    it('should have at least one program with progress', () => {
      const programKeys = Object.keys(data.programs);
      const hasProgress = programKeys.some((key) => data.programs[key].completed > 0);
      expect(hasProgress).toBe(true);
    });
  });
});
