# Proposal: E2E Testing Infrastructure with Playwright

## Intent

Implement automated E2E tests to prevent the following issues from reaching production:
- Broken links (incorrect base paths for GitHub Pages)
- Missing CSS classes that cause UI elements to display incorrectly
- JavaScript errors (undefined functions like closeModal)
- Missing static assets (404 errors for images, certificates, favicons)

## Scope

### In Scope
- Set up Playwright testing framework
- Create tests for all page routes
- Test all internal links resolve correctly
- Test all static assets load without 404
- Test all interactive elements (buttons, modals) work
- Test CSS classes are applied correctly
- Integrate with GitHub Actions CI/CD

### Out of Scope
- Visual regression testing (separate proposal)
- Performance testing
- Accessibility testing (separate proposal)

## Approach

1. Install Playwright in landing-page/
2. Create test structure mirroring page structure
3. Write tests for each category of issue found:
   - Link integrity tests
   - Asset loading tests
   - Modal functionality tests
   - CSS class existence tests
4. Add to CI/CD pipeline
5. Block merges on test failures

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `landing-page/package.json` | Modified | Add Playwright dependencies and test scripts |
| `landing-page/playwright.config.ts` | New | Playwright configuration |
| `landing-page/tests/` | New | E2E test files |
| `.github/workflows/deploy.yml` | Modified | Add test step before build |
| `openspec/specs/testing/` | New | Test specifications |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tests slow down CI/CD | Medium | Use parallel test execution, limit to critical paths |
| Flaky tests | Medium | Use proper wait strategies, avoid brittle selectors |
| Maintenance burden | Low | Follow page object pattern, keep tests focused |

## Rollback Plan

Remove test step from CI/CD and delete `landing-page/tests/` directory.

## Dependencies

- Node.js 20.x (already required)
- Playwright browser binaries

## Success Criteria

- [ ] All pages load without JavaScript errors
- [ ] All internal links resolve correctly
- [ ] All static assets return 200
- [ ] All modals open and close correctly
- [ ] CI/CD blocks on test failure
- [ ] Test suite completes in under 2 minutes
