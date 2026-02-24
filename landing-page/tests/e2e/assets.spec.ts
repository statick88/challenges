import { test, expect } from '@playwright/test';
import { BASE_PATH, getAllAssetSrcs } from '../fixtures/test-helpers';

test.describe('Static Asset Loading', () => {
  test('favicon loads on all main pages', async ({ page }) => {
    const pages = [
      BASE_PATH,
      `${BASE_PATH}linux/`,
      `${BASE_PATH}docker/`,
      `${BASE_PATH}devops/`,
      `${BASE_PATH}ctf/`,
      `${BASE_PATH}htb/`,
    ];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      const faviconLink = page.locator('link[rel="icon"]');
      const href = await faviconLink.getAttribute('href');
      
      expect(href, `${pagePath} should have favicon`).toBeTruthy();
      
      const response = await page.request.get(href!);
      expect(response.status(), `Favicon ${href} should load`).toBe(200);
    }
  });

  test('certificate images load on Docker page', async ({ page }) => {
    await page.goto(`${BASE_PATH}docker/`);
    
    // Find certificate images
    const certImages = page.locator('img[src*="certificate"]');
    const count = await certImages.count();
    
    if (count > 0) {
      const src = await certImages.first().getAttribute('src');
      expect(src, 'Certificate image should have src').toBeTruthy();
      
      const response = await page.request.get(src!);
      expect(response.status(), `Certificate ${src} should load`).toBe(200);
    }
  });

  test('all images on dashboard have valid srcs', async ({ page }) => {
    await page.goto(BASE_PATH);
    
    const imgs = await page.locator('img').all();
    
    for (const img of imgs) {
      const src = await img.getAttribute('src');
      if (src && src.startsWith('/challenges/')) {
        const response = await page.request.get(src);
        expect(response.status(), `Image ${src} should load`).toBe(200);
      }
    }
  });

  test('CSS files load correctly', async ({ page }) => {
    await page.goto(BASE_PATH);
    
    const stylesheets = await page.locator('link[rel="stylesheet"]').all();
    
    for (const sheet of stylesheets) {
      const href = await sheet.getAttribute('href');
      if (href && href.startsWith('/challenges/')) {
        const response = await page.request.get(href);
        expect(response.status(), `Stylesheet ${href} should load`).toBe(200);
      }
    }
  });

  test('certificate download links work', async ({ page }) => {
    await page.goto(`${BASE_PATH}docker/`);
    
    const pdfLinks = page.locator('a[href*=".pdf"]');
    const count = await pdfLinks.count();
    
    if (count > 0) {
      const href = await pdfLinks.first().getAttribute('href');
      expect(href, 'PDF link should have href').toBeTruthy();
      expect(href, 'PDF link should start with /challenges/').toMatch(/^\/challenges\//);
    }
  });
});
