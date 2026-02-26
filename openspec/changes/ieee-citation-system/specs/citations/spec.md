# IEEE Citation System Specification

## Purpose

Define the requirements for implementing IEEE-style citations across the learning-journey documentation site.

---

## Requirements

### Requirement: Bibliography File Structure

The system SHALL provide properly structured BibTeX files for all content sections.

#### Scenario: Main bibliography file exists

- GIVEN the learning-journey directory
- WHEN a user needs to reference common sources
- THEN `references.bib` SHALL exist at the root level
- AND it SHALL contain shared entries (HTTP specs, Linux standards, etc.)

#### Scenario: Section-specific bibliography files exist

- GIVEN a content section (security, foundations, containers)
- WHEN that section has domain-specific references
- THEN `{section}/references.bib` SHALL exist
- AND it SHALL contain only section-specific entries

---

### Requirement: Citation Format

The system SHALL use IEEE citation style consistently.

#### Scenario: Inline citations render correctly

- GIVEN a .qmd file with `[@citationkey]` syntax
- WHEN Quarto renders the page
- THEN the citation SHALL appear as `[1]` in the text
- AND it SHALL link to the references section

#### Scenario: Reference entries render in IEEE format

- GIVEN a bibliography entry
- WHEN the references section renders
- THEN it SHALL follow IEEE format:
  - Author(s). "Title." Publication, Year.
  - URL SHALL be hyperlinked
  - Access date for online sources

---

### Requirement: Technical Reference Citations

The system SHALL provide proper citations for technical references.

#### Scenario: CVE references link to NVD

- GIVEN content mentions a CVE identifier
- WHEN rendered
- THEN it SHALL link to `https://nvd.nist.gov/vuln/detail/CVE-XXXX-XXXXX`

#### Scenario: RFC references link to IETF

- GIVEN content mentions an RFC number
- WHEN rendered
- THEN it SHALL link to `https://datatracker.ietf.org/doc/html/rfcXXXX`

#### Scenario: MITRE ATT&CK techniques link to framework

- GIVEN content mentions a technique ID (T1XXX)
- WHEN rendered
- THEN it SHALL link to `https://attack.mitre.org/techniques/T1XXX/`

---

### Requirement: Quarto Configuration

The system SHALL configure Quarto for IEEE citations.

#### Scenario: IEEE style is configured

- GIVEN _quarto.yml configuration
- WHEN Quarto processes any .qmd file
- THEN IEEE citation style SHALL be applied
- AND `link-citations: true` SHALL be set

#### Scenario: Bibliography is referenced

- GIVEN a .qmd file with citations
- WHEN the file has no explicit bibliography field
- THEN it SHALL use the project-level bibliography
- OR section-level bibliography if closer

---

### Requirement: Content Coverage

Citations SHALL be added to content that references external sources.

#### Scenario: Security content has citations

- GIVEN security/*.qmd files
- WHEN content references:
  - CVE identifiers
  - RFC documents
  - MITRE ATT&CK techniques
  - Tool documentation
  - Security research
- THEN appropriate citations SHALL exist

#### Scenario: Tool documentation is cited

- GIVEN content about a tool (Docker, Nmap, Ansible)
- WHEN the tool is described
- THEN official documentation SHALL be cited

---

## Bibliography Entries Schema

### Online Source
```bibtex
@online{key,
  author    = {Author Name},
  title     = {Title of Resource},
  year      = {YYYY},
  month     = {mon},
  url       = {https://example.com},
  urldate   = {YYYY-MM-DD},
  publisher = {Publisher Name}
}
```

### Technical Report (RFC)
```bibtex
@techreport{key,
  author      = {Author(s)},
  title       = {Title},
  institution = {IETF},
  type        = {RFC},
  number      = {XXXX},
  year        = {YYYY},
  url         = {https://datatracker.ietf.org/doc/html/rfcXXXX}
}
```

### CVE Entry
```bibtex
@online{cveXXXX,
  author    = {{NVD}},
  title     = {CVE-XXXX-XXXXX: Description},
  year      = {YYYY},
  url       = {https://nvd.nist.gov/vuln/detail/CVE-XXXX-XXXXX},
  publisher = {National Vulnerability Database}
}
```

---

## Sections Priority

| Priority | Section | Files | Key References |
|----------|---------|-------|----------------|
| 1 | security | ~95 | CVE, RFC, MITRE, HTB |
| 2 | foundations | 8 | Linux, SSH, NIST |
| 3 | containers | 5 | Docker, OCI |
| 4 | devops-practices | 1 | Ansible, CI/CD |
