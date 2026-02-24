# Design: E2E Testing Infrastructure with Playwright

## Technical Approach

Use Playwright for E2E testing because it provides:
- Cross-browser testing (Chromium, Firefox, WebKit)
- Built-in assertions and auto-waiting
- Screenshot and trace on failure
- Parallel test execution
- Integration with GitHub Actions

The test suite will run against the built Astro site served locally during CI/CD, simulating the production environment.

---

## Architecture Decisions

### Decision: Test Against Built Site

**Choice**: Run tests against `npm run build` output served by `npm run preview`

**Alternatives considered**:
- Test against dev server (rejected: doesn't match production build)
- Test against deployed site (rejected: too late to catch issues)

**Rationale**: Testing against the built output catches build-time issues and matches what users will see in production.

---

### Decision: Use Page Object Model

**Choice**: Create page objects for each major page type

**Alternatives considered**:
- Inline selectors in tests (rejected: harder to maintain)
- Custom test framework (rejected: over-engineering)

**Rationale**: Page objects centralize selectors and make tests more readable and maintainable.

---

### Decision: Fail CI on Console Errors

**Choice**: Configure Playwright to fail tests on JavaScript console errors

**Alternatives considered**:
- Log errors but don't fail (rejected: allows broken code to merge)
- Manual error checking (rejected: error-prone)

**Rationale**: JavaScript errors indicate broken functionality and should never reach production.

---

## Test Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CI/CD PIPELINE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. npm ci                                                       │
│         │                                                        │
│         ▼                                                        │
│  2. npm run build                                                │
│         │                                                        │
│         ▼                                                        │
│  3. npm run preview &                                            │
│     npx playwright test                                          │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ TEST SUITE                                               │   │
│  │                                                          │   │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │   │
│  │ │ Link Tests  │ │ Asset Tests │ │ Modal Tests │        │   │
│  │ │             │ │             │ │             │        │   │
│  │ │ - Nav links │ │ - Favicon   │ │ - openModal │        │   │
│  │ │ - Breadcrumbs│ │ - Certs    │ │ - closeModal│        │   │
│  │ │ - Cards     │ │ - Images    │ │ - No errors │        │   │
│  │ └─────────────┘ └─────────────┘ └─────────────┘        │   │
│  │                                                          │   │
│  │ ┌─────────────┐ ┌─────────────┐                         │   │
│  │ │ CSS Tests   │ │ Page Tests  │                         │   │
│  │ │             │ │             │                         │   │
│  │ │ - Badges    │ │ - Dashboard │                         │   │
│  │ │ - Filters   │ │ - Linux     │                         │   │
│  │ │ - Custom    │ │ - Docker    │                         │   │
│  │ │   classes   │ │ - DevOps    │                         │   │
│  │ └─────────────┘ └─────────────┘                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                        │
│         ▼                                                        │
│  4. All tests pass?                                              │
│         │                                                        │
│    ┌────┴────┐                                                   │
│    │         │                                                   │
│   YES        NO                                                  │
│    │         │                                                   │
│    ▼         ▼                                                   │
│  Deploy    Fail CI                                               │
│            (block merge)                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `landing-page/package.json` | Modify | Add Playwright dependencies and test scripts |
| `landing-page/playwright.config.ts` | Create | Playwright configuration with GitHub Pages base URL |
| `landing-page/tests/e2e/links.spec.ts` | Create | Link integrity tests |
| `landing-page/tests/e2e/assets.spec.ts` | Create | Static asset loading tests |
| `landing-page/tests/e2e/modals.spec.ts` | Create | JavaScript function tests |
| `landing-page/tests/e2e/css.spec.ts` | Create | CSS class application tests |
| `landing-page/tests/fixtures/test-helpers.ts` | Create | Shared test utilities |
| `.github/workflows/deploy.yml` | Modify | Add test step before deploy |

---

## Interfaces / Contracts

### Playwright Configuration

```typescript
// landing-page/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4322/challenges/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4322/challenges/',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Test Helper Utilities

```typescript
// landing-page/tests/fixtures/test-helpers.ts
import { Page, expect } from '@playwright/test';

export const BASE_PATH = '/challenges/';

export async function expectNoConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  await page.waitForLoadState('networkidle');
  expect(errors).toHaveLength(0);
}

export async function expectLinkWorks(page: Page, selector: string) {
  const link = page.locator(selector);
  const href = await link.getAttribute('href');
  expect(href).toBeTruthy();
  expect(href).toMatch(/^\/challenges\//);
  
  const response = await page.request.get(href!);
  expect(response.status()).toBe(200);
}

export async function expectAssetLoads(page: Page, src: string) {
  const response = await page.request.get(src);
  expect(response.status()).toBe(200);
}
```

### Example Test

```typescript
// landing-page/tests/e2e/links.spec.ts
import { test, expect } from '@playwright/test';
import { BASE_PATH, expectNoConsoleErrors } from '../fixtures/test-helpers';

test.describe('Link Integrity', () => {
  test('navigation links work from dashboard', async ({ page }) => {
    await page.goto(BASE_PATH);
    
    // Test each nav link
    const navLinks = ['linux', 'docker', 'devops', 'ctf', 'htb'];
    for (const link of navLinks) {
      await page.click(`a[href="/challenges/${link}/"]`);
      await expect(page).toHaveURL(new RegExp(`/${link}/`));
      await expectNoConsoleErrors(page);
    }
  });
  
  test('favicon loads', async ({ page }) => {
    await page.goto(BASE_PATH);
    const response = await page.request.get('/challenges/favicon.svg');
    expect(response.status()).toBe(200);
  });
});
```

---

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| E2E | All user flows | Playwright tests |
| E2E | Static assets | HTTP request tests |
| E2E | JavaScript errors | Console listener |
| Integration | Build output | Verify dist/ structure |

---

## CI/CD Integration

Add to `.github/workflows/deploy.yml`:

```yaml
- name: Install Playwright Browsers
  working-directory: ./landing-page
  run: npx playwright install --with-deps chromium

- name: Run E2E Tests
  working-directory: ./landing-page
  run: npx playwright test

- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: landing-page/playwright-report/
```

---

## Performance Considerations

| Scenario | Expected Time |
|----------|--------------|
| Full test suite | < 2 minutes |
| Single page test | < 5 seconds |
| Asset check | < 1 second |

Strategies to maintain speed:
- Run only Chromium in CI (not all browsers)
- Use parallel test execution
- Only test critical paths
- Skip visual regression in CI

---

## Open Questions

- [ ] Should we test mobile viewports? → **Answer: Yes, add mobile project**
- [ ] Should we test dark/light theme toggle? → **Deferred: Separate proposal**
- [ ] Should we add visual regression tests? → **Deferred: Separate proposal**
