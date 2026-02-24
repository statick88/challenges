# Tasks: E2E Testing Infrastructure

## Phase 1: Foundation - Setup Playwright

- [ ] 1.1 Install Playwright in landing-page/
  ```bash
  cd landing-page && npm install -D @playwright/test
  ```

- [ ] 1.2 Create `landing-page/playwright.config.ts`
  - Configure baseURL with `/challenges/` prefix
  - Set up webServer to run `npm run preview`
  - Configure Chromium project
  - Enable trace on retry, screenshot on failure

- [ ] 1.3 Add test scripts to `landing-page/package.json`
  ```json
  {
    "scripts": {
      "test": "playwright test",
      "test:ui": "playwright test --ui",
      "test:debug": "playwright test --debug",
      "test:report": "playwright show-report"
    }
  }
  ```

- [ ] 1.4 Create `landing-page/tests/fixtures/test-helpers.ts`
  - Export `BASE_PATH` constant
  - Export `expectNoConsoleErrors(page)` function
  - Export `expectLinkWorks(page, selector)` function
  - Export `expectAssetLoads(page, src)` function

## Phase 2: Core Tests - Link Integrity

- [ ] 2.1 Create `landing-page/tests/e2e/links.spec.ts`
  - Test: Navigation links work from dashboard
  - Test: Breadcrumb links work on all detail pages
  - Test: Challenge card links work on all category pages
  - Test: Logo link returns to dashboard

- [ ] 2.2 Create `landing-page/tests/e2e/assets.spec.ts`
  - Test: Favicon loads on all pages
  - Test: Certificate images load
  - Test: All images in challenge pages load or are external

## Phase 3: Core Tests - Functionality

- [ ] 3.1 Create `landing-page/tests/e2e/modals.spec.ts`
  - Test: openModal function exists on window
  - Test: closeModal function exists on window
  - Test: Modal opens when clicking "Ver Solución" button
  - Test: Modal closes when clicking close button
  - Test: No JavaScript errors on page load

- [ ] 3.2 Create `landing-page/tests/e2e/css.spec.ts`
  - Test: Badge classes have proper styles (CTF page)
  - Test: Filter button classes have proper styles
  - Test: Custom CSS classes are defined

## Phase 4: Page-Specific Tests

- [ ] 4.1 Create `landing-page/tests/e2e/pages/home.spec.ts`
  - Test: Dashboard loads
  - Test: Stats display correctly
  - Test: All program cards are clickable

- [ ] 4.2 Create `landing-page/tests/e2e/pages/linux.spec.ts`
  - Test: Linux index page loads
  - Test: Challenge detail pages load
  - Test: No console errors

- [ ] 4.3 Create `landing-page/tests/e2e/pages/docker.spec.ts`
  - Test: Docker index page loads
  - Test: Certificate displays
  - Test: Stats grid displays

- [ ] 4.4 Create `landing-page/tests/e2e/pages/htb.spec.ts`
  - Test: HTB index page loads
  - Test: Challenge detail pages load
  - Test: Modal works on detail pages

## Phase 5: CI/CD Integration

- [ ] 5.1 Update `.github/workflows/deploy.yml`
  - Add step: Install Playwright browsers
  - Add step: Run E2E tests (before deploy)
  - Add step: Upload test results on failure

- [ ] 5.2 Add test status badge to README.md
  ```markdown
  ![E2E Tests](https://github.com/statick88/challenges/actions/workflows/deploy.yml/badge.svg)
  ```

- [ ] 5.3 Verify CI/CD pipeline
  - Push a change and verify tests run
  - Verify tests block deployment on failure
  - Verify tests pass before deployment

## Phase 6: Documentation

- [ ] 6.1 Create `landing-page/tests/README.md`
  - Document how to run tests locally
  - Document test structure
  - Document how to add new tests

- [ ] 6.2 Update `AGENTS.md` with testing guidelines
  - Add section on running tests before commit
  - Add section on test writing guidelines

---

## Task Dependencies

```
Phase 1 (Setup)
    │
    ├── 1.1 (install) ─────────────────────────────────────────┐
    ├── 1.2 (config) ──────────────────────────────────────────┤
    ├── 1.3 (scripts) ─────────────────────────────────────────┤
    └── 1.4 (helpers) ─────────────────────────────────────────┤
                                                               │
Phase 2 (Link Tests) ─────────────────────────────────────────┤
    │                                                          │
    ├── 2.1 (links) ───── depends on 1.4 ─────────────────────┤
    └── 2.2 (assets) ─── depends on 1.4 ─────────────────────┤
                                                               │
Phase 3 (Functionality Tests) ────────────────────────────────┤
    │                                                          │
    ├── 3.1 (modals) ─── depends on 1.4 ─────────────────────┤
    └── 3.2 (css) ────── depends on 1.4 ─────────────────────┤
                                                               │
Phase 4 (Page Tests) ─────────────────────────────────────────┤
    │                                                          │
    ├── 4.1 (home) ───── depends on 2.1, 3.1 ─────────────────┤
    ├── 4.2 (linux) ──── depends on 2.1, 3.1 ─────────────────┤
    ├── 4.3 (docker) ─── depends on 2.1, 2.2, 3.1 ────────────┤
    └── 4.4 (htb) ────── depends on 2.1, 3.1 ─────────────────┤
                                                               │
Phase 5 (CI/CD) ──────────────────────────────────────────────┤
    │                                                          │
    └── 5.1, 5.2, 5.3 ─ depend on all previous phases ────────┤
                                                               │
Phase 6 (Docs) ───────────────────────────────────────────────┘
```

---

## Estimated Time

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | 4 tasks | 30 minutes |
| Phase 2 | 2 tasks | 45 minutes |
| Phase 3 | 2 tasks | 45 minutes |
| Phase 4 | 4 tasks | 1 hour |
| Phase 5 | 3 tasks | 30 minutes |
| Phase 6 | 2 tasks | 15 minutes |
| **Total** | **17 tasks** | **3.5 hours** |

---

## Success Verification

After completing all tasks:

```bash
# Run tests locally
cd landing-page
npm run build
npm run preview &
npm test

# All tests should pass
# No console errors
# All assets load
```

### CI/CD Verification

1. Make a change that breaks a link
2. Verify CI fails with clear error message
3. Fix the change
4. Verify CI passes and deploys
