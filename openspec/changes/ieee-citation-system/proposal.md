# Proposal: IEEE Citation System for Learning Journey

## Intent

Implement a comprehensive IEEE-style citation system across all learning-journey content sections to enhance academic credibility, provide proper attribution, and enable readers to verify sources. The ai-workflows section already demonstrates this pattern and should be extended to all sections.

## Scope

### In Scope
- Create section-level BibTeX files (security/, foundations/, containers/, devops-practices/)
- Update Quarto configuration for IEEE citation style
- Add citations to existing content that references external sources
- Create a main project-level references.bib for shared entries
- Update all index.qmd files with bibliography references
- Add citation markers for CVEs, RFCs, MITRE ATT&CK, tool documentation

### Out of Scope
- Automatic citation extraction from URLs
- Integration with reference managers (Zotero, Mendeley)
- PDF generation with proper bibliography

## Approach

1. Create shared `learning-journey/references.bib` with common entries
2. Create section-specific `.bib` files for domain-specific references
3. Update `_quarto.yml` with IEEE CSL and bibliography settings
4. Add citations to content files in priority order:
   - Security (95 files, most references to CVEs, RFCs, MITRE)
   - Foundations (8 files)
   - Containers (5 files)
   - DevOps (1 file)
5. Verify HTML output has proper hyperlinked citations

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `learning-journey/references.bib` | New | Main bibliography file |
| `learning-journey/security/references.bib` | New | Security-specific references |
| `learning-journey/foundations/references.bib` | New | Linux fundamentals references |
| `learning-journey/containers/references.bib` | New | Docker/container references |
| `learning-journey/_quarto.yml` | Modified | Add bibliography config |
| ~110 `.qmd` files | Modified | Add citation markers |
| `learning-journey/ieee.csl` | New | IEEE citation style |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Broken URLs over time | Medium | Use web.archive.org for stable references |
| Inconsistent citation style | Low | Use automated CSL validation |
| Missing required fields | Low | Validate .bib files before commit |

## Rollback Plan

Remove bibliography fields from _quarto.yml and delete .bib files. Content remains readable without citations.

## Dependencies

- Quarto 1.4+ (already installed)
- IEEE CSL file (download from Zotero style repository)

## Success Criteria

- [ ] All sections have bibliography files
- [ ] CVE references link to NVD
- [ ] RFC references link to IETF
- [ ] MITRE ATT&CK techniques link to attack.mitre.org
- [ ] HTML output shows hyperlinked citations
- [ ] References section renders correctly at end of each page
