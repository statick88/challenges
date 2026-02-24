import { test, expect } from '@playwright/test';
import { BASE_PATH, expectNoConsoleErrors, getAllInternalLinks } from '../fixtures/test-helpers';

test.describe('Link Integrity', () => {
  test('dashboard page loads without errors', async ({ page }) => {
    await page.goto(BASE_PATH);
    await expectNoConsoleErrors(page);
    await expect(page).toHaveTitle(/Tech Challenges/);
  });

  test('navigation links work from dashboard', async ({ page }) => {
    await page.goto(BASE_PATH);
    
    const categories = ['linux', 'docker', 'devops', 'ctf', 'htb'];
    
    for (const category of categories) {
      const navLink = page.locator(`a[href="/challenges/${category}/"]`).first();
      await expect(navLink).toBeVisible();
      
      await navLink.click();
      await expect(page).toHaveURL(new RegExp(`/${category}/`));
      await expectNoConsoleErrors(page);
      
      // Go back to dashboard for next test
      await page.goto(BASE_PATH);
    }
  });

  test('logo link returns to dashboard', async ({ page }) => {
    // Go to a subpage first
    await page.goto(`${BASE_PATH}linux/`);
    
    // Click logo
    const logoLink = page.locator('a[href="/challenges/"]').first();
    await expect(logoLink).toBeVisible();
    await logoLink.click();
    
    await expect(page).toHaveURL(BASE_PATH);
  });

  test('all internal links on dashboard are valid', async ({ page }) => {
    await page.goto(BASE_PATH);
    
    const links = await getAllInternalLinks(page);
    expect(links.length, 'Should have internal links').toBeGreaterThan(0);
    
    for (const href of links.slice(0, 10)) { // Test first 10 links
      const response = await page.request.get(href);
      expect(response.status(), `Link ${href} should return 200`).toBe(200);
    }
  });

  test('breadcrumb links work on Linux detail pages', async ({ page }) => {
    await page.goto(`${BASE_PATH}linux/01-creacion-usuarios/`);
    
    // Check breadcrumb exists
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    
    // Click Challenges link
    const challengesLink = page.locator('a[href="/challenges"]');
    if (await challengesLink.count() > 0) {
      await challengesLink.first().click();
      await expect(page).toHaveURL(BASE_PATH);
    }
  });

  test('favicon loads correctly', async ({ page }) => {
    await page.goto(BASE_PATH);
    
    const response = await page.request.get('/challenges/favicon.svg');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image');
  });
});

test.describe('Category Pages', () => {
  const categories = ['linux', 'docker', 'devops', 'ctf', 'htb'];
  
  for (const category of categories) {
    test(`${category} index page loads`, async ({ page }) => {
      await page.goto(`${BASE_PATH}${category}/`);
      await expectNoConsoleErrors(page);
      await expect(page.locator('h1')).toBeVisible();
    });
  }
});
