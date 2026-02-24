# Validation Specification

## Purpose

Define the validation infrastructure for the Cursos learning platform. This spec describes the requirements for automated quality checks that run before deployment to ensure content consistency, correct metadata, and overall repository health.

---

## Requirements

### Requirement: Structure Validation

The system SHALL validate directory and file naming conventions across all content areas.

#### Scenario: Linux challenge naming validation

- GIVEN a Linux challenge directory in `challenges/linux/retos/`
- WHEN the validator runs
- THEN it SHALL check the directory name matches pattern `XX-descripcion/`
- AND it SHALL verify a `README.md` exists inside
- AND it SHALL report any deviations with file path and expected pattern

#### Scenario: Docker challenge naming validation

- GIVEN a Docker challenge file in `challenges/docker/challenges/`
- WHEN the validator runs
- THEN it SHALL check the file name matches pattern `reto-XX-descripcion.md`
- AND it SHALL report any deviations

#### Scenario: DevOps day naming validation

- GIVEN a DevOps challenge file in `challenges/devops/days/`
- WHEN the validator runs
- THEN it SHALL check the file name matches pattern `day-XX-descripcion.md`
- AND it SHALL report any deviations

#### Scenario: Duplicate numbering detection

- GIVEN challenge directories or files in any program
- WHEN the validator runs
- THEN it SHALL detect duplicate numbering (e.g., two `06-*` directories)
- AND it SHALL report an error with both conflicting paths

---

### Requirement: Front Matter Validation

The system SHALL validate YAML front matter in all markdown content files.

#### Scenario: Required fields presence

- GIVEN a markdown file with front matter in challenges/
- WHEN the validator runs
- THEN it SHALL verify required fields exist: `title`, `category`, `difficulty`, `tags`, `date`, `status`
- AND it SHALL report missing fields with file path

#### Scenario: Category value validation

- GIVEN a challenge file with a `category` field
- WHEN the validator runs
- THEN it SHALL verify the value is one of: `linux`, `docker`, `devops`, `ctf`
- AND it SHALL report invalid values with allowed options

#### Scenario: Difficulty format validation

- GIVEN a challenge file with a `difficulty` field
- WHEN the validator runs
- THEN it SHALL accept numeric values 1-5
- OR it SHALL accept text values: `easy`, `medium`, `hard`
- AND it SHALL report invalid values

#### Scenario: Date format validation

- GIVEN a challenge file with a `date` field
- WHEN the validator runs
- THEN it SHALL verify the format matches `YYYY-MM-DD`
- AND it SHALL warn if date is in the past or uses wrong year (2025 vs 2026)

#### Scenario: Status value validation

- GIVEN a challenge file with a `status` field
- WHEN the validator runs
- THEN it SHALL verify the value is one of: `completed`, `in_progress`, `ready`
- AND it SHALL report invalid values

#### Scenario: Tags array validation

- GIVEN a challenge file with a `tags` field
- WHEN the validator runs
- THEN it SHALL verify tags is an array
- AND it SHALL verify at least one tag exists
- AND it SHALL warn about empty tag values

---

### Requirement: Cross-File Consistency

The system SHALL validate consistency between related files across the repository.

#### Scenario: Progress tracking consistency

- GIVEN `progress/overview.md` claims completion percentage for a program
- WHEN the validator runs
- THEN it SHALL count actual completed challenges in that program
- AND it SHALL warn if the claimed percentage differs from actual

#### Scenario: Course indexing consistency

- GIVEN a course directory exists in `learning-journey/security/`
- WHEN the validator runs
- THEN it SHALL check if the course appears in `security/index.qmd`
- AND it SHALL report orphaned courses not in the index

#### Scenario: CTF flag presence validation

- GIVEN a CTF challenge with `status: completed`
- WHEN the validator runs
- THEN it SHALL verify a `flag` field exists in front matter
- AND it SHALL warn about missing flags for completed CTF challenges

---

### Requirement: Health Check Report

The system SHALL produce a comprehensive health report of the repository.

#### Scenario: Health report generation

- GIVEN the validation infrastructure is installed
- WHEN health-check.js runs
- THEN it SHALL produce a JSON report with:
  - Total files scanned per category
  - Errors found (critical issues)
  - Warnings found (non-critical issues)
  - Summary statistics

#### Scenario: Exit code handling

- GIVEN any validation script runs
- WHEN errors are found
- THEN the script SHALL exit with code 1
- WHEN only warnings are found
- THEN the script SHALL exit with code 0
- WHEN no issues are found
- THEN the script SHALL exit with code 0

#### Scenario: JSON output format

- GIVEN any validation script runs with `--json` flag
- WHEN the validator completes
- THEN it SHALL output results as valid JSON
- AND the JSON SHALL include: `success`, `errors`, `warnings`, `files_scanned`

---

### Requirement: Unified Validation Runner

The system SHALL provide a single command to run all validations.

#### Scenario: Run all validations

- GIVEN the user runs `npm run validate:all`
- WHEN the command executes
- THEN it SHALL run structure validation first
- AND it SHALL run front matter validation second
- AND it SHALL run consistency validation third
- AND it SHALL run health check last
- AND it SHALL exit with code 1 if any validation fails

#### Scenario: Validation script isolation

- GIVEN a user runs a single validation script (e.g., `npm run validate`)
- WHEN only that script runs
- THEN it SHALL not depend on other validation scripts
- AND it SHALL produce its own report

---

## Error Messages

The system SHALL produce clear, actionable error messages.

### Requirement: Error message format

All error messages SHALL follow this format:

```
[ERROR] {error_type}: {description}
  File: {file_path}
  Expected: {expected_value}
  Actual: {actual_value}
  Fix: {suggested_fix}
```

#### Scenario: Missing required field error

- GIVEN front matter validation finds a missing `title` field
- WHEN reporting the error
- THEN the message SHALL include:
  - Error type: "MISSING_FIELD"
  - File path
  - Expected: "title field in front matter"
  - Fix: "Add 'title: \"Your Title\"' to front matter"

---

## Non-Functional Requirements

### Requirement: Performance

- The validation scripts SHALL complete within 30 seconds for repositories under 500 files
- The validation scripts SHALL use async file operations where beneficial

### Requirement: Maintainability

- Each validation script SHALL be a separate module
- Shared utilities (parsing, reporting) SHALL be in a common module
- Configuration (patterns, schemas) SHALL be externalized to JSON files
