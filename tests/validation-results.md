# Validation Results Summary

**Generated**: 2026-02-24
**Repository**: ~/apps/cursos

## Overview

The validation infrastructure was tested against the repository. Below are the findings from running all validators.

## Summary

| Category | Errors | Warnings |
|----------|--------|----------|
| Structure | 1 | 0 |
| Front Matter | 153 | 32 |
| Consistency | 0 | 1 |
| **Total** | **154** | **33** |

## Critical Issues

### 1. Duplicate Linux Challenge Numbering

**Error Type**: `DUPLICATE_NUMBERING`

Two Linux challenges share the same number `06`:
- `challenges/linux/retos/06-creacion-anita-temporal/`
- `challenges/linux/retos/06-transferencia-datos/`

**Resolution**: Renumber one of these challenges. Suggested:
- Rename `06-transferencia-datos` to `21-transferencia-datos` (next available number)

### 2. Missing Required Tags Field

**Error Type**: `MISSING_REQUIRED_FIELD`

The majority of challenge files (112 files) are missing the `tags` field in front matter.

**Affected Files**:
- All `challenges/devops/days/*.md` files (10 files)
- All `challenges/docker/challenges/*.md` files (6 files)
- All `challenges/linux/retos/*/README.md` files (20+ files)
- All `challenges/htb/**/*.md` files (30 files)
- All `challenges/ctf/**/*.md` files (11 files)

**Resolution**: Add tags to each file, e.g.:
```yaml
tags:
  - linux
  - users
```

### 3. Invalid Category Values

**Error Type**: `INVALID_CATEGORY`

Several files use subcategory names instead of valid top-level categories:

| Invalid Category | Valid Category | Count |
|-----------------|----------------|-------|
| `crypto` | `ctf` | 2 |
| `forensics` | `ctf` | 5 |
| `misc` | `ctf` | 1 |
| `pwn` | `ctf` | 1 |
| `reversing` | `ctf` | 1 |
| `web` | `ctf` | 1 |
| `htb` | `ctf` | 23 |
| `active-directory` | `ctf` | 1 |
| `privilege-escalation` | `ctf` | 1 |
| `web-security` | `ctf` | 1 |

**Resolution**: Either:
1. Change category to `ctf` and add `subcategory` field
2. Extend the schema to accept additional categories

### 4. Invalid Status Values

**Error Type**: `INVALID_STATUS`

Files using Spanish status `completado` instead of `completed`:

| File Pattern | Count |
|--------------|-------|
| `challenges/docker/challenges/*.md` | 6 |
| `challenges/ctf/forensics/*.md` | 2 |

**Resolution**: Replace `status: completado` with `status: completed`

### 5. Invalid Date Format

**Error Type**: `INVALID_DATE`

Files using DD-MM-YYYY format instead of YYYY-MM-DD:

| File | Invalid Date |
|------|--------------|
| `docker/certification-docker-kodekloud.md` | 18-02-2026 |
| `docker/challenges/reto-1-install-docker.md` | 25-01-2026 |
| `docker/challenges/reto-2-deploy-nginx.md` | 28-01-2026 |
| `docker/challenges/reto-3-delete-containers.md` | 30-01-2026 |
| `docker/challenges/reto-4-copy-files.md` | 30-01-2026 |
| `docker/challenges/reto-5-troubleshoot.md` | 30-01-2026 |
| `docker/challenges/reto-6-troubleshoot-volume-port.md` | 18-02-2026 |

**Resolution**: Reformat dates to ISO 8601 (YYYY-MM-DD)

## Warnings

### Outdated Year (2025)

32 files have dates from 2025 instead of 2026:

- `challenges/ctf/reto01/` - 2 files
- `challenges/ctf/reto02/` - 2 files
- `challenges/ctf/reto03/` - 2 files
- `challenges/linux/retos/01-creacion-usuarios/` - 1 file
- `challenges/linux/retos/02-gestion-grupos-xfusioncorp/` - 4 files
- `challenges/linux/retos/03-usuario-no-interactivo-xfusioncorp/` - 2 files
- `challenges/linux/retos/04-usuario-sin-home/` - 2 files
- `challenges/linux/retos/05-usuario-temporal/` - 1 file
- `challenges/linux/retos/06-creacion-anita-temporal/` - 2 files
- `challenges/linux/retos/06-transferencia-datos/` - 1 file
- `challenges/linux/retos/07-ssh-root-seguro/` through `20-disable-root-ssh-login/` - 14 files

### Missing Progress File

**Warning Type**: `MISSING_PROGRESS_FILE`

The consistency validator expects `progress/overview.md` to track completion but it was not found at the expected location.

## Next Steps

### Priority 1 - Immediate Fixes

1. **Renumber duplicate Linux challenge**
   - Rename `06-transferencia-datos` to `21-transferencia-datos`

2. **Fix status values**
   - Replace `completado` with `completed` in Docker and CTF files

3. **Fix date formats**
   - Convert DD-MM-YYYY to YYYY-MM-DD in Docker files

### Priority 2 - Schema Alignment

4. **Decide on category strategy**
   - Option A: Keep strict categories, add `subcategory` field
   - Option B: Extend schema to include `htb`, `forensics`, `crypto`, etc.

5. **Add missing tags**
   - Batch update files with appropriate tags

### Priority 3 - Documentation

6. **Update year values**
   - Review and update 2025 dates to 2026 where appropriate

7. **Create progress tracking**
   - Add `progress/overview.md` for consistency checks

## Validation Scripts

All validation commands are available via npm scripts:

```bash
npm run validate              # Structure validation
npm run validate:frontmatter  # Front matter validation
npm run validate:consistency  # Cross-file consistency
npm run validate:health       # Aggregated health report
npm run validate:all          # Run all validators
```

For JSON output (useful for CI/CD):

```bash
npm run validate -- --json
```

## Test Fixtures

Test fixtures are available in `tests/fixtures/validation/`:

- `valid/challenge.md` - Valid front matter example
- `invalid/missing-title.md` - Missing required field
- `invalid/bad-category.md` - Invalid category value
- `invalid/bad-date.md` - Invalid date format
- `structure/01-valid/` - Valid directory naming
- `structure/invalid-name/` - Invalid directory naming

---

*Generated by validation infrastructure v1.0*
