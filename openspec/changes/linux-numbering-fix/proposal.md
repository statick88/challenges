# Proposal: Linux Challenge Numbering Fix & Status Audit

## Intent

Fix duplicate numbering in Linux challenges directory and synchronize progress tracking across files. Currently two directories are numbered `06-*`, causing confusion in ordering and potential data generation errors.

## Scope

### In Scope
- Renumber `06-transferencia-datos` to `07-transferencia-datos`
- Renumber all subsequent challenges (07→08, 08→09, etc.)
- Update `progress/overview.md` to reflect actual completion status (currently shows 100% but Linux is 43%)
- Standardize date format from 2025 to 2026 across affected files
- Update any cross-references in README files

### Out of Scope
- Content changes within challenge files
- Adding new challenges
- Docker/DevOps numbering (they don't have this issue)

## Approach

1. List all directories in `challenges/linux/retos/` sorted
2. Identify the correct order based on content
3. Create migration script for batch renaming
4. Execute renaming with git mv to preserve history
5. Update progress/overview.md with accurate metrics
6. Update date format in files with 2025 dates
7. Run validate:all after changes
8. Commit with clear message explaining renumbering

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `challenges/linux/retos/06-transferencia-datos/` | Renamed | Move to 07-* |
| `challenges/linux/retos/07-*/` | Renamed | Renumber to 08-* |
| `challenges/linux/retos/08-*/` | Renamed | Renumber to 09-* |
| ... | ... | Continue pattern |
| `progress/overview.md` | Modified | Update accurate completion metrics |
| ~32 .md files | Modified | Change date from 2025 to 2026 |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking existing links | Medium | Use git mv to preserve history |
| Missing a directory | Low | Verify count before and after |
| Incomplete date update | Low | Use grep to find all 2025 dates |

## Rollback Plan

Use `git revert` on the commit. All changes are renames and text edits, fully reversible.

## Dependencies

- Git for version control
- Node.js for validation scripts
- Bash for renaming script

## Success Criteria

- [ ] No duplicate numbering in `challenges/linux/retos/`
- [ ] Sequential numbering from 01 to N
- [ ] `progress/overview.md` shows accurate Linux completion (43%)
- [ ] All dates use 2026 format
- [ ] `npm run parse-data` generates correct challenge data
- [ ] `npm run build` succeeds
- [ ] Git history preserved (use git mv, not rm+add)
