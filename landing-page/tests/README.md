# E2E Tests for Tech Challenges Dashboard

This directory contains end-to-end tests using [Playwright](https://playwright.dev/).

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI (interactive mode)
npm run test:ui

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report
```

## Test Structure

```
tests/
├── e2e/
│   ├── links.spec.ts      # Link integrity tests
│   ├── assets.spec.ts     # Static asset loading tests
│   └── modals.spec.ts     # Modal functionality tests
└── fixtures/
    └── test-helpers.ts    # Shared test utilities
```

## Test Categories

### Link Integrity Tests (`links.spec.ts`)
- Dashboard page loads without errors
- Navigation links work from dashboard
- Logo link returns to dashboard
- All internal links are valid
- Breadcrumb links work

### Asset Loading Tests (`assets.spec.ts`)
- Favicon loads on all pages
- Certificate images load
- All images have valid sources

### Modal Functionality Tests (`modals.spec.ts`)
- `openModal` function exists
- `closeModal` function exists
- Modal opens and closes correctly
- No JavaScript errors on any page

## Writing New Tests

1. Create a new `*.spec.ts` file in `tests/e2e/`
2. Import test helpers from `../fixtures/test-helpers`
3. Follow the existing patterns

Example:
```typescript
import { test, expect } from '@playwright/test';
import { BASE_PATH } from '../fixtures/test-helpers';

test.describe('My Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto(BASE_PATH);
    // Your test code
  });
});
```

## CI/CD Integration

Tests run automatically in GitHub Actions before deployment:
1. Build the site
2. Run Playwright tests
3. If tests pass → Deploy
4. If tests fail → Block deployment

## Debugging Failed Tests

1. Check the `playwright-report/` artifact in GitHub Actions
2. Run locally with `npm run test:ui`
3. Use `test.only()` to run a single test
