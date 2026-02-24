# E2E Testing Specification

## Purpose

Define the requirements for automated end-to-end testing of the Tech Challenges Dashboard to prevent broken links, missing assets, and JavaScript errors from reaching production.

---

## Requirements

### Requirement: Link Integrity

The system SHALL validate all internal links resolve correctly.

#### Scenario: Navigation links work from any page

- GIVEN a user is on any page in the application
- WHEN they click any navigation link in the header
- THEN the page SHALL load without 404 error
- AND the URL SHALL start with `/challenges/`

#### Scenario: Breadcrumb links work

- GIVEN a user is on a challenge detail page
- WHEN they click any breadcrumb link
- THEN the page SHALL load without 404 error

#### Scenario: Challenge card links work

- GIVEN a user is on a category index page (linux, docker, devops, ctf, htb)
- WHEN they click any challenge card
- THEN the challenge detail page SHALL load without 404 error

---

### Requirement: Static Asset Loading

The system SHALL validate all static assets load successfully.

#### Scenario: Favicon loads on all pages

- GIVEN a user visits any page
- WHEN the browser requests the favicon
- THEN the response SHALL be 200 OK
- AND the content type SHALL be `image/svg+xml`

#### Scenario: Certificate images load

- GIVEN a user is on the Docker challenges page
- WHEN the page loads the certificate image
- THEN the image SHALL return 200 OK
- AND the URL SHALL be `/challenges/certificates/kodekloud-docker-certificate.png`

#### Scenario: All images in markdown content load

- GIVEN a user is on any challenge detail page
- WHEN the page contains an `<img>` element
- THEN the image SHALL return 200 OK or the src SHALL be an external URL

---

### Requirement: JavaScript Function Availability

The system SHALL validate all interactive elements work without JavaScript errors.

#### Scenario: Modal open function exists

- GIVEN a page has a "Ver Solución" or "Ver Detalles" button
- WHEN the button has an onclick attribute calling `openModal`
- THEN `window.openModal` SHALL be a function

#### Scenario: Modal close function exists

- GIVEN a modal is open
- WHEN the close button has an onclick attribute calling `closeModal`
- THEN `window.closeModal` SHALL be a function

#### Scenario: No console errors on page load

- GIVEN a user visits any page
- WHEN the page finishes loading
- THEN there SHALL be no JavaScript errors in the console

---

### Requirement: CSS Class Application

The system SHALL validate CSS classes are defined for all elements that use them.

#### Scenario: Badge classes are styled

- GIVEN the CTF page displays achievement badges
- WHEN a badge has class `badge-unlocked` or `badge-locked`
- THEN the computed style SHALL include non-default values
- AND the badge SHALL be visible and readable

#### Scenario: Filter button classes are styled

- GIVEN any page has filter buttons
- WHEN a button has class `filter-btn`, `category-filter-btn`, or `difficulty-filter-btn`
- THEN the computed style SHALL include proper background and border

#### Scenario: No elements have unstyled custom classes

- GIVEN any page element has a custom class (not Tailwind utility)
- WHEN the page loads
- THEN the CSS for that class SHALL be defined in a stylesheet

---

### Requirement: Page Load Performance

The system SHALL validate pages load within acceptable time.

#### Scenario: Page load time is acceptable

- GIVEN a user visits any page
- WHEN the page finishes loading
- THEN the load time SHALL be under 5 seconds
- AND there SHALL be no timeout errors

---

## Test Structure

```
landing-page/tests/
├── e2e/
│   ├── links.spec.ts           # Link integrity tests
│   ├── assets.spec.ts          # Static asset loading tests
│   ├── modals.spec.ts          # JavaScript function tests
│   ├── css.spec.ts             # CSS class application tests
│   └── pages/
│       ├── home.spec.ts        # Dashboard page tests
│       ├── linux.spec.ts       # Linux challenges tests
│       ├── docker.spec.ts      # Docker challenges tests
│       ├── devops.spec.ts      # DevOps challenges tests
│       ├── ctf.spec.ts         # CTF challenges tests
│       └── htb.spec.ts         # HTB challenges tests
├── fixtures/
│   └── test-helpers.ts         # Shared test utilities
└── playwright.config.ts        # Configuration
```

---

## Error Messages

Tests SHALL produce clear error messages in this format:

```
[E2E_ERROR] {error_type}: {description}
  Page: {url}
  Element: {selector}
  Expected: {expected}
  Actual: {actual}
  Fix: {suggested_fix}
```

---

## CI/CD Integration

Tests SHALL run on:
- Every push to main/master
- Every pull request
- Before deployment step

Tests SHALL block deployment if:
- Any test fails
- Console has JavaScript errors
- Any asset returns 404
