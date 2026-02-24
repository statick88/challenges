# Proposal: Content Index Synchronization

## Intent

Ensure all courses in `learning-journey/security/` are properly indexed and navigable. Currently, three courses exist as directories with content but are not listed in `security/index.qmd`, making them undiscoverable for users.

## Scope

### In Scope
- Update `security/index.qmd` to include:
  - File Transfers course (exists, not indexed)
  - Networking Fundamentals course (exists, minimal index)
  - RSA Encryption course (already added but verify positioning)
- Fix broken link to `06-data-transfer.html` in foundations/index.qmd
- Remove duplicate chapter listings in foundations/index.qmd
- Standardize course card format across all entries

### Out of Scope
- Content quality improvements within courses
- Adding new courses
- Translations (es/ directory)

## Approach

1. Scan all subdirectories in `learning-journey/security/`
2. Extract metadata from each course's index.qmd
3. Generate standardized course cards following existing pattern
4. Insert courses into security/index.qmd in logical order
5. Fix foundations duplicate listings and broken links
6. Run Quarto build to verify navigation works

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `learning-journey/security/index.qmd` | Modified | Add missing course entries |
| `learning-journey/foundations/index.qmd` | Modified | Fix duplicates and broken links |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Navigation order confusion | Low | Follow difficulty progression order |
| Duplicate entries | Low | Verify each course is added once |
| Build failure | Low | Test build before commit |

## Rollback Plan

Git revert the changes to index.qmd files. Content is only being added/modified, not deleted.

## Dependencies

- Quarto CLI for build verification
- Existing course metadata in each index.qmd

## Success Criteria

- [ ] All courses in `learning-journey/security/` appear in security/index.qmd
- [ ] No broken links in Quarto build
- [ ] Foundations duplicate listings removed
- [ ] `npm run build` succeeds
- [ ] `quarto render` from learning-journey/ succeeds
