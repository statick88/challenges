# Proposal: Validation Infrastructure Implementation

## Intent

Create the missing validation scripts referenced in `package.json` to enable `npm run validate:all`. Currently, running validation commands fails because the scripts don't exist, leaving the project without automated quality checks before deployment.

## Scope

### In Scope
- Create `landing-page/scripts/validation/` directory structure
- Implement `validate-structure.js` - Check directory and file naming conventions
- Implement `validate-frontmatter.js` - Validate YAML front matter against schema
- Implement `validate-consistency.js` - Cross-file consistency checks
- Implement `health-check.js` - Overall repository health report
- Define JSON schema for front matter validation
- Add exit codes for CI/CD integration

### Out of Scope
- GitHub Actions integration (separate proposal)
- Auto-fix capabilities for validation errors
- Performance optimization for large file sets

## Approach

1. Analyze existing `generate-challenges-data.js` for patterns
2. Define front matter schema based on AGENTS.md specification
3. Implement each validator as independent module
4. Create unified validation runner
5. Generate JSON reports for debugging
6. Update package.json with correct script paths

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `landing-page/scripts/validation/` | New | Create 4 new validation scripts |
| `landing-page/package.json` | Modified | Update script paths if needed |
| `openspec/specs/validation-schema.json` | New | Define front matter schema |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| False positives in validation | Medium | Provide clear error messages with fix suggestions |
| Performance on large repos | Low | Use async file operations |
| Breaking existing workflow | Low | Test thoroughly before merge |

## Rollback Plan

Delete `landing-page/scripts/validation/` directory and restore original package.json if validation scripts cause issues. All changes are additive.

## Dependencies

- Node.js 20.x (already required)
- Existing `fs` and `path` modules
- `marked` library (already installed)

## Success Criteria

- [ ] `npm run validate:structure` runs successfully
- [ ] `npm run validate:frontmatter` catches invalid front matter
- [ ] `npm run validate:consistency` reports cross-file issues
- [ ] `npm run validate:health` produces health report
- [ ] `npm run validate:all` executes all validations
- [ ] Exit codes are non-zero on failure for CI integration
