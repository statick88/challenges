# Tasks: Validation Infrastructure Implementation

## Phase 1: Foundation / Shared Utilities

- [ ] 1.1 Create `landing-page/scripts/validation/` directory structure
- [ ] 1.2 Create `landing-page/scripts/validation/utils/front-matter-parser.js`
  - Extract `parseFrontMatter()` from `generate-challenges-data.js`
  - Export `parseFrontMatter(filePath)` function
  - Export `normalizeStatus(status)` function
  - Export `normalizeDifficulty(difficulty)` function
- [ ] 1.3 Create `landing-page/scripts/validation/utils/schema.js`
  - Define `REQUIRED_FIELDS` array
  - Define `VALID_CATEGORIES` enum
  - Define `VALID_STATUSES` enum
  - Define `DIFFICULTY_PATTERNS` object
  - Define `DATE_PATTERN` regex
  - Define `NAMING_PATTERNS` object for each program
- [ ] 1.4 Create `landing-page/scripts/validation/utils/reporter.js`
  - Implement `formatError(error)` function
  - Implement `formatWarning(warning)` function
  - Implement `consoleReport(result)` function
  - Implement `jsonReport(result)` function
  - Implement `exitWithCode(result)` function

## Phase 2: Core Implementation - Validators

- [ ] 2.1 Create `landing-page/scripts/validation/validate-structure.js`
  - Implement `validateLinuxStructure()` - check `XX-descripcion/README.md` pattern
  - Implement `validateDockerStructure()` - check `reto-XX-descripcion.md` pattern
  - Implement `validateDevOpsStructure()` - check `day-XX-descripcion.md` pattern
  - Implement `detectDuplicateNumbering()` - find duplicate `XX-` prefixes
  - Collect all errors and warnings
  - Output using reporter utilities
  - Handle `--json` flag
- [ ] 2.2 Create `landing-page/scripts/validation/validate-frontmatter.js`
  - Implement `validateRequiredFields(frontMatter, filePath)` - check required fields exist
  - Implement `validateCategory(value, filePath)` - check valid category enum
  - Implement `validateDifficulty(value, filePath)` - check numeric or text format
  - Implement `validateDate(value, filePath)` - check YYYY-MM-DD format, warn on 2025
  - Implement `validateStatus(value, filePath)` - check valid status enum
  - Implement `validateTags(value, filePath)` - check array with at least 1 element
  - Scan all `.md` files in `challenges/` directory
  - Output using reporter utilities
  - Handle `--json` flag
- [ ] 2.3 Create `landing-page/scripts/validation/validate-consistency.js`
  - Implement `validateProgressConsistency()` - compare progress/overview.md with actual counts
  - Implement `validateCourseIndexing()` - check courses in learning-journey/security/ are indexed
  - Implement `validateCTFFlags()` - check completed CTF challenges have flag field
  - Output using reporter utilities
  - Handle `--json` flag
- [ ] 2.4 Create `landing-page/scripts/validation/health-check.js`
  - Aggregate results from all validators
  - Generate summary statistics (files scanned, errors, warnings)
  - Output JSON health report
  - Handle `--json` flag

## Phase 3: Integration / Wiring

- [ ] 3.1 Update `landing-page/scripts/generate-challenges-data.js`
  - Import `parseFrontMatter` from `./validation/utils/front-matter-parser.js`
  - Remove duplicate `parseFrontMatter`, `normalizeStatus`, `normalizeDifficulty` functions
  - Verify data generation still works correctly
- [ ] 3.2 Verify `landing-page/package.json` scripts are correct
  - `validate` → `node scripts/validation/validate-structure.js`
  - `validate:frontmatter` → `node scripts/validation/validate-frontmatter.js`
  - `validate:consistency` → `node scripts/validation/validate-consistency.js`
  - `validate:health` → `node scripts/validation/health-check.js`
  - `validate:all` → run all validators in sequence

## Phase 4: Testing

- [ ] 4.1 Create `tests/fixtures/validation/` directory structure
  - Create `tests/fixtures/validation/valid/challenge.md` with valid front matter
  - Create `tests/fixtures/validation/invalid/missing-title.md`
  - Create `tests/fixtures/validation/invalid/bad-category.md`
  - Create `tests/fixtures/validation/invalid/bad-date.md`
  - Create `tests/fixtures/validation/structure/01-valid/README.md`
  - Create `tests/fixtures/validation/structure/invalid-name/README.md`
- [ ] 4.2 Test `validate-structure.js` manually
  - Run against actual `challenges/` directory
  - Verify it detects the duplicate `06-*` numbering
  - Verify JSON output with `--json` flag
- [ ] 4.3 Test `validate-frontmatter.js` manually
  - Run against actual `challenges/` directory
  - Verify it catches files with 2025 dates
  - Verify JSON output with `--json` flag
- [ ] 4.4 Test `validate-consistency.js` manually
  - Run against actual repository
  - Verify it reports orphaned courses (file-transfers, networking)
  - Verify JSON output with `--json` flag
- [ ] 4.5 Test `validate:all` command
  - Run `npm run validate:all`
  - Verify exit code 1 (errors exist)
  - Verify all validators run in sequence

## Phase 5: Cleanup / Documentation

- [ ] 5.1 Update `README.md` with validation documentation
  - Add section explaining validation commands
  - Document exit codes
  - Document `--json` flag usage
- [ ] 5.2 Update `AGENTS.md` with validation rules reference
  - Reference the validation scripts in Build/Lint/Test Commands section
- [ ] 5.3 Commit all changes with descriptive message
  - `feat(validation): add validation infrastructure`

---

## Task Dependencies

```
Phase 1 (Foundation)
    │
    ├── 1.2 (parser) ──────────────────────────────────────┐
    ├── 1.3 (schema) ──────────────────────────────────────┤
    └── 1.4 (reporter) ────────────────────────────────────┤
                                                          │
Phase 2 (Core) ───────────────────────────────────────────┤
    │                                                     │
    ├── 2.1 (structure) ───── depends on 1.3, 1.4 ────────┤
    ├── 2.2 (frontmatter) ─── depends on 1.2, 1.3, 1.4 ───┤
    ├── 2.3 (consistency) ─── depends on 1.2, 1.4 ────────┤
    └── 2.4 (health) ──────── depends on 2.1-2.3 ─────────┤
                                                          │
Phase 3 (Integration) ────────────────────────────────────┤
    │                                                     │
    ├── 3.1 (update generator) ─ depends on 1.2 ──────────┤
    └── 3.2 (verify scripts) ─── independent ─────────────┤
                                                          │
Phase 4 (Testing) ────────────────────────────────────────┤
    │                                                     │
    └── All tasks depend on Phase 2 completion ───────────┤
                                                          │
Phase 5 (Cleanup) ────────────────────────────────────────┘
    │
    └── All tasks depend on Phase 4 completion
```

---

## Estimated Time

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | 4 tasks | 1 hour |
| Phase 2 | 4 tasks | 2 hours |
| Phase 3 | 2 tasks | 30 minutes |
| Phase 4 | 5 tasks | 1 hour |
| Phase 5 | 3 tasks | 30 minutes |
| **Total** | **18 tasks** | **5 hours** |

---

## Success Verification

After completing all tasks:

```bash
# All commands should work
npm run validate              # Structure validation
npm run validate:frontmatter  # Front matter validation
npm run validate:consistency  # Consistency checks
npm run validate:health       # Health report
npm run validate:all          # All validators

# Build should still work
npm run build                 # Astro + Quarto build

# Data generation should still work
npm run parse-data            # Generate challenges.json
```
