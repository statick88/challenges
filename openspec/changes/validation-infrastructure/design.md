# Design: Validation Infrastructure Implementation

## Technical Approach

Build a modular validation system following existing patterns from `generate-challenges-data.js`. Each validator is an independent Node.js ES module that can run standalone or as part of `validate:all`. The system reuses the existing `parseFrontMatter()` function and extends it with schema-based validation.

---

## Architecture Decisions

### Decision: Module Structure

**Choice**: Create 4 independent validator modules + 1 shared utilities module

**Alternatives considered**:
- Single monolithic validator (rejected: harder to maintain, test, and run selectively)
- Class-based validators (rejected: over-engineering for simple file validation)

**Rationale**: Follows existing pattern in `scripts/` where each script is a standalone module. Enables running individual validators for faster feedback and easier debugging.

```
landing-page/scripts/
├── validation/
│   ├── utils/
│   │   ├── front-matter-parser.js  ← Shared parser (extracted from generate-challenges-data.js)
│   │   ├── reporter.js             ← Shared reporting utilities
│   │   └── schema.js               ← JSON schema definitions
│   ├── validate-structure.js       ← Structure validation
│   ├── validate-frontmatter.js     ← Front matter validation
│   ├── validate-consistency.js     ← Cross-file consistency
│   └── health-check.js             ← Health report
├── generate-challenges-data.js     ← Existing (will import from utils/)
└── generate-all-challenges.js      ← Existing
```

---

### Decision: Validation Output Format

**Choice**: Console output by default, JSON output with `--json` flag

**Alternatives considered**:
- JSON only (rejected: not human-friendly for CLI)
- Console only (rejected: harder to integrate with CI/CD)

**Rationale**: Following npm conventions, most tools support both human-readable and machine-parseable output. The `--json` flag enables CI integration while default output is readable.

```javascript
// Default output
✅ Structure validation passed
❌ Front matter validation failed
   [ERROR] MISSING_FIELD: Required field 'title' not found
     File: challenges/linux/retos/07-test/README.md
     Expected: title field in front matter
     Fix: Add 'title: "Your Title"' to front matter

// JSON output (--json flag)
{
  "success": false,
  "errors": [
    {
      "type": "MISSING_FIELD",
      "message": "Required field 'title' not found",
      "file": "challenges/linux/retos/07-test/README.md",
      "expected": "title field in front matter",
      "fix": "Add 'title: \"Your Title\"' to front matter"
    }
  ],
  "warnings": [],
  "filesScanned": 42
}
```

---

### Decision: Exit Codes

**Choice**: Standard Unix exit codes (0 = success, 1 = errors, 2 = warnings only)

**Alternatives considered**:
- Custom exit codes per error type (rejected: over-engineering)
- Always exit 0 with error in output (rejected: breaks CI/CD integration)

**Rationale**: Standard exit codes enable proper CI/CD integration. GitHub Actions, GitLab CI, and other systems interpret non-zero exits as failure.

| Condition | Exit Code |
|-----------|-----------|
| No errors, no warnings | 0 |
| No errors, warnings only | 0 |
| Errors found | 1 |
| Fatal system error | 2 |

---

### Decision: Shared Parser Extraction

**Choice**: Extract `parseFrontMatter()` from `generate-challenges-data.js` into shared utility

**Alternatives considered**:
- Duplicate the function (rejected: DRY violation, maintenance burden)
- Leave in place and import (rejected: circular dependency risk)

**Rationale**: The parser is useful for both data generation and validation. Extracting to a shared module ensures consistency and single source of truth.

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        VALIDATION FLOW                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  npm run validate:all                                                │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ validate-structure.js                                        │   │
│  │  • Scan challenges/ directories                             │   │
│  │  • Check naming patterns                                    │   │
│  │  • Detect duplicate numbering                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ validate-frontmatter.js                                      │   │
│  │  • Parse YAML front matter                                  │   │
│  │  • Validate against schema                                  │   │
│  │  • Check required fields                                    │   │
│  │  • Validate field values                                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ validate-consistency.js                                      │   │
│  │  • Compare progress/ with actual counts                     │   │
│  │  • Check course indexing                                    │   │
│  │  • Verify CTF flags for completed challenges                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ health-check.js                                              │   │
│  │  • Aggregate all results                                    │   │
│  │  • Generate health report                                   │   │
│  │  • Output JSON summary                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Output                                                       │   │
│  │  • Console report (default)                                 │   │
│  │  • JSON report (--json flag)                                │   │
│  │  • Exit code (0/1/2)                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `landing-page/scripts/validation/utils/front-matter-parser.js` | Create | Extracted parser from generate-challenges-data.js |
| `landing-page/scripts/validation/utils/reporter.js` | Create | Console and JSON output formatting |
| `landing-page/scripts/validation/utils/schema.js` | Create | Front matter schema definitions |
| `landing-page/scripts/validation/validate-structure.js` | Create | Structure validation logic |
| `landing-page/scripts/validation/validate-frontmatter.js` | Create | Front matter validation logic |
| `landing-page/scripts/validation/validate-consistency.js` | Create | Cross-file consistency checks |
| `landing-page/scripts/validation/health-check.js` | Create | Health report generation |
| `landing-page/scripts/generate-challenges-data.js` | Modify | Import parser from utils/ |

---

## Interfaces / Contracts

### ValidationResult

```typescript
interface ValidationError {
  type: string;           // e.g., "MISSING_FIELD", "INVALID_VALUE"
  message: string;        // Human-readable description
  file: string;           // Relative path to file
  expected?: string;      // What was expected
  actual?: string;        // What was found
  fix?: string;           // Suggested fix
}

interface ValidationWarning {
  type: string;
  message: string;
  file: string;
  suggestion?: string;
}

interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  filesScanned: number;
  duration?: number;      // milliseconds
}
```

### Naming Patterns

```javascript
const PATTERNS = {
  linux: {
    dir: /^\d{2}-[a-z0-9-]+$/,
    file: "README.md"
  },
  docker: {
    file: /^reto-\d{1,2}-[a-z0-9-]+\.md$/
  },
  devops: {
    file: /^day-\d{1,2}-[a-z0-9-]+\.md$/
  },
  ctf: {
    dir: /^\d{2}-[a-z0-9-]+$/,
    file: "README.md"
  }
};
```

### Front Matter Schema

```javascript
const SCHEMA = {
  required: ['title', 'category', 'difficulty', 'tags', 'date', 'status'],
  category: {
    enum: ['linux', 'docker', 'devops', 'ctf']
  },
  difficulty: {
    numeric: { min: 1, max: 5 },
    text: ['easy', 'medium', 'hard']
  },
  status: {
    enum: ['completed', 'in_progress', 'ready', 'blocked']
  },
  date: {
    pattern: /^\d{4}-\d{2}-\d{2}$/
  }
};
```

---

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Parser functions | Jest test with sample front matter strings |
| Unit | Pattern matching | Jest test with valid/invalid filenames |
| Unit | Schema validation | Jest test with valid/invalid front matter objects |
| Integration | End-to-end validation | Run against test fixtures in `tests/fixtures/` |
| E2E | npm run validate:all | Run in CI pipeline, check exit codes |

### Test Fixtures Structure

```
tests/
├── fixtures/
│   ├── valid/
│   │   └── challenge.md      ← Valid front matter
│   ├── invalid/
│   │   ├── missing-title.md  ← Missing required field
│   │   ├── bad-category.md   ← Invalid category value
│   │   └── bad-date.md       ← Invalid date format
│   └── structure/
│       ├── 01-valid/
│       │   └── README.md
│       └── invalid-name/     ← Wrong naming pattern
└── validation.test.js
```

---

## Migration / Rollout

No migration required. The validation scripts are additive - they don't modify any existing files or data. The rollout is:

1. Create validation scripts
2. Test locally with `npm run validate:all`
3. Fix any issues found in existing content
4. Add to CI/CD pipeline (separate change)

---

## Open Questions

- [ ] Should we auto-fix common issues (e.g., normalize date format)? → **Answer: No, validation only. Auto-fix is a separate feature.**
- [ ] Should warnings cause CI failure? → **Answer: No, warnings exit 0, errors exit 1.**
- [ ] Should we validate Quarto .qmd files too? → **Deferred: Different schema, separate change.**

---

## Performance Considerations

| Scenario | Expected Performance |
|----------|---------------------|
| < 100 files | < 5 seconds |
| 100-500 files | < 15 seconds |
| > 500 files | < 30 seconds |

The current repository has ~100 markdown files, so validation should complete in under 5 seconds.

---

## Dependencies

No new npm packages required. The validation scripts use only Node.js built-in modules:
- `fs` - File system operations
- `path` - Path handling
- `process` - Exit codes, arguments
