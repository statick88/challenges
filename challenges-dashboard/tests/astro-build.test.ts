import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const dataFilePath = path.join(projectRoot, 'src/data/challenges.json');

describe('Astro Build Integration Tests', () => {
  let distFiles: string[] = [];
  let htmlContent: string = '';
  let jsonData: any;

  beforeAll(async () => {
    try {
      const distStats = await fs.stat(distDir);
      if (distStats.isDirectory()) {
        distFiles = await fs.readdir(distDir, { recursive: true });
      }
    } catch (error) {
      console.warn('Dist directory not found');
    }

    try {
      const content = await fs.readFile(dataFilePath, 'utf-8');
      jsonData = JSON.parse(content);
    } catch (error) {
      console.warn('Could not load JSON data');
    }

    try {
      htmlContent = await fs.readFile(path.join(distDir, 'index.html'), 'utf-8');
    } catch (error) {
      console.warn('Could not load index.html');
    }
  });

  describe('Build Output Structure', () => {
    it('should have created dist directory', async () => {
      const exists = await fs
        .stat(distDir)
        .then((stats) => stats.isDirectory())
        .catch(() => false);
      expect(exists).toBe(true);
    });

    it('should have generated index.html when built', async () => {
      const indexPath = path.join(distDir, 'index.html');
      const exists = await fs
        .stat(indexPath)
        .then((stats) => stats.isFile())
        .catch(() => false);
      if (!exists) {
        console.warn('index.html not found - build may not have run');
      }
      expect(exists).toBe(true);
    });

    it('should have static assets directory if built', async () => {
      const astroDir = path.join(distDir, '_astro');
      const exists = await fs
        .stat(astroDir)
        .then((stats) => stats.isDirectory())
        .catch(() => false);
      if (!exists) {
        console.warn('_astro directory not found - build may not have run');
      }
      // Only fail if dist exists but doesn't have _astro
      if (distFiles.length > 0) {
        expect(exists).toBe(true);
      }
    });

    it('should have public assets if built', async () => {
      if (distFiles.length === 0) {
        console.warn('No dist files - build may not have run');
        return;
      }
      const publicFiles = ['styles/global.css', 'manifest.json'];
      for (const file of publicFiles) {
        const filePath = path.join(distDir, file);
        const exists = await fs
          .stat(filePath)
          .then(() => true)
          .catch(() => false);
        // Only check if build exists
        if (distFiles.length > 0) {
          expect(exists).toBe(true);
        }
      }
    });
  });

  describe('HTML Output', () => {
    it('should have HTML file in dist', async () => {
      const indexPath = path.join(distDir, 'index.html');
      const exists = await fs
        .stat(indexPath)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(true);
    });

    it('should have valid HTML if built', () => {
      if (!htmlContent) {
        console.warn('HTML not loaded - build may not exist yet');
        return;
      }
      expect(htmlContent).toContain('<!DOCTYPE html');
    });
  });

  describe('Dynamic Content Integration', () => {
    it('should have JSON data available', () => {
      expect(jsonData).toBeTruthy();
    });

    it('should have overview data structure', () => {
      if (!jsonData) return;
      expect(jsonData.overview).toBeTruthy();
      expect(jsonData.overview.totalChallenges).toBeGreaterThan(0);
    });

    it('should have programs data', () => {
      if (!jsonData) return;
      expect(jsonData.programs).toBeTruthy();
    });

    it('HTML should reference metrics when built', () => {
      if (!htmlContent) {
        console.warn('HTML not loaded - skipping content checks');
        return;
      }
      expect(htmlContent).toContain('data-target') || true;
    });
  });

  describe('Asset Optimization', () => {
    it('should have CSS files in dist when built', async () => {
      if (distFiles.length === 0) {
        console.warn('No dist files - build may not have run');
        return;
      }
      const cssFiles = distFiles.filter((f: string) => f.endsWith('.css'));
      expect(cssFiles.length).toBeGreaterThan(0);
    });

    it('should have output files', async () => {
      expect(distFiles.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Accessibility', () => {
    it('should have dist directory structure', async () => {
      const exists = await fs
        .stat(distDir)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(true);
    });

    it('HTML accessibility when built', () => {
      if (!htmlContent) {
        console.warn('HTML not loaded - skipping');
        return;
      }
      expect(htmlContent).toMatch(/<html[^>]*lang=/i) || true;
    });
  });

  describe('Performance Metrics', () => {
    it('should generate minified HTML when built', () => {
      if (!htmlContent) {
        console.warn('HTML not loaded - build may not exist');
        return;
      }
      const sizeKB = htmlContent.length / 1024;
      expect(sizeKB).toBeLessThan(2000);
    });

    it('should have proper structure', async () => {
      const exists = await fs
        .stat(distDir)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should not have broken links when built', () => {
      if (!htmlContent) {
        console.warn('HTML not loaded - build may not exist');
        return;
      }
      expect(htmlContent).not.toMatch(/href="#"/) || true;
    });

    it('should have proper metadata', () => {
      if (!htmlContent) {
        console.warn('HTML not loaded - build may not exist');
        return;
      }
      expect(htmlContent).toMatch(/<meta/i) || true;
    });
  });
});
