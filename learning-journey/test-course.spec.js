const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:5678';

test.describe('SDD Course Tests', () => {
  
  test('Index page loads and has correct structure', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai-workflows/`);
    
    // Check title
    await expect(page).toHaveTitle(/Spec-Driven Development/);
    
    // Check main heading
    const heading = page.locator('h1').first();
    await expect(heading).toContainText('Bienvenido al Curso');
    
    // Check navigation links exist
    const moduleLinks = page.locator('a[href$=".qmd"], a[href$=".html"]');
    const count = await moduleLinks.count();
    console.log(`Found ${count} module links`);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/index-page.png', fullPage: true });
  });

  test('All module pages are accessible', async ({ page }) => {
    const modules = [
      '/ai-workflows/00-contexto-historico.html',
      '/ai-workflows/01-intro-sdd.html',
      '/ai-workflows/01b-context-architecture.html',
      '/ai-workflows/01c-task-driven-development.html',
      '/ai-workflows/02-comparativa-herramientas.html',
      '/ai-workflows/03-sdd-kilocode.html',
      '/ai-workflows/04-sdd-opencode.html',
      '/ai-workflows/05-practica-sdd.html',
      '/ai-workflows/06-mcp-integration.html',
      '/ai-workflows/07-advanced-patterns.html'
    ];
    
    const errors = [];
    
    for (const module of modules) {
      try {
        const response = await page.goto(`${BASE_URL}${module}`);
        if (response.status() !== 200) {
          errors.push(`${module}: HTTP ${response.status()}`);
        } else {
          console.log(`✓ ${module}`);
        }
      } catch (e) {
        errors.push(`${module}: ${e.message}`);
      }
    }
    
    if (errors.length > 0) {
      console.log('\n❌ Errors found:');
      errors.forEach(e => console.log(`  - ${e}`));
    }
    
    expect(errors).toHaveLength(0);
  });

  test('Internal links between modules work', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai-workflows/`);
    
    // Get all internal links
    const links = await page.locator('a[href*="ai-workflows/"]').all();
    const brokenLinks = [];
    
    for (const link of links.slice(0, 20)) { // Check first 20 links
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('http')) {
        try {
          const response = await page.request.get(`${BASE_URL}${href.replace('.qmd', '.html')}`);
          if (response.status() !== 200) {
            brokenLinks.push(href);
          }
        } catch (e) {
          brokenLinks.push(`${href}: ${e.message}`);
        }
      }
    }
    
    if (brokenLinks.length > 0) {
      console.log('Broken links:', brokenLinks);
    }
    
    expect(brokenLinks).toHaveLength(0);
  });

  test('Check for console errors', async ({ page }) => {
    const consoleErrors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto(`${BASE_URL}/ai-workflows/`);
    await page.waitForLoadState('networkidle');
    
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
    
    // Filter out non-critical errors
    const criticalErrors = consoleErrors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('net::ERR_BLOCKED_BY_CLIENT')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('Module 1B and 1C exist and have correct next links', async ({ page }) => {
    // Check 01b
    await page.goto(`${BASE_URL}/ai-workflows/01b-context-architecture.html`);
    await expect(page.locator('h1')).toContainText('Context Architecture');
    
    // Should link to 01c
    const nextLink = page.locator('a[href*="01c-task-driven-development"]');
    await expect(nextLink).toBeVisible();
    
    // Check 01c
    await page.goto(`${BASE_URL}/ai-workflows/01c-task-driven-development.html`);
    await expect(page.locator('h1')).toContainText('Task-Driven Development');
    
    // Should link to 02
    const nextLink2 = page.locator('a[href*="02-comparativa-herramientas"]');
    await expect(nextLink2).toBeVisible();
  });
});
