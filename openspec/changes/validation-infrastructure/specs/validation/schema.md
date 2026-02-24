# Front Matter Schema Specification

## Purpose

Define the JSON schema for validating front matter in challenge and course markdown files.

---

## Challenge Front Matter Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Challenge Front Matter",
  "type": "object",
  "required": ["title", "category", "difficulty", "tags", "date", "status"],
  "properties": {
    "title": {
      "type": "string",
      "minLength": 1,
      "description": "Descriptive challenge title"
    },
    "category": {
      "type": "string",
      "enum": ["linux", "docker", "devops", "ctf"],
      "description": "Challenge category/program"
    },
    "difficulty": {
      "oneOf": [
        {"type": "integer", "minimum": 1, "maximum": 5},
        {"type": "string", "enum": ["easy", "medium", "hard"]}
      ],
      "description": "Difficulty level"
    },
    "tags": {
      "type": "array",
      "items": {"type": "string"},
      "minItems": 1,
      "description": "Relevant technical tags"
    },
    "date": {
      "type": "string",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
      "description": "ISO 8601 date format"
    },
    "status": {
      "type": "string",
      "enum": ["completed", "in_progress", "ready"],
      "description": "Challenge completion status"
    },
    "duration": {
      "type": "string",
      "pattern": "^\\d+ (minutes?|hours?)$",
      "description": "Estimated completion time"
    },
    "platform": {
      "type": "string",
      "enum": ["picoCTF", "HTB", "custom"],
      "description": "CTF platform (CTF challenges only)"
    },
    "flag": {
      "type": "string",
      "description": "CTF flag value (CTF challenges only)"
    },
    "author": {
      "type": "string",
      "description": "Original author"
    }
  },
  "additionalProperties": false
}
```

---

## Quarto Course Front Matter Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Quarto Course Front Matter",
  "type": "object",
  "required": ["title"],
  "properties": {
    "title": {
      "type": "string",
      "minLength": 1,
      "description": "Course or section title"
    },
    "subtitle": {
      "type": "string",
      "description": "Optional subtitle"
    },
    "author": {
      "type": "string",
      "description": "Author name"
    },
    "date": {
      "type": "string",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
      "description": "ISO 8601 date format"
    },
    "categories": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Content categories"
    },
    "description": {
      "type": "string",
      "description": "Course description"
    },
    "difficulty": {
      "type": "string",
      "enum": ["easy", "medium", "hard", "beginner", "intermediate", "advanced"],
      "description": "Difficulty level"
    }
  }
}
```

---

## Validation Rules by Category

### Linux Challenges

| Field | Required | Constraints |
|-------|----------|-------------|
| title | Yes | Non-empty string |
| category | Yes | MUST be `linux` |
| difficulty | Yes | 1-5 or easy/medium/hard |
| tags | Yes | At least 1 tag |
| date | Yes | YYYY-MM-DD format |
| status | Yes | completed/in_progress/ready |

### Docker Challenges

| Field | Required | Constraints |
|-------|----------|-------------|
| title | Yes | Non-empty string |
| category | Yes | MUST be `docker` |
| difficulty | Yes | 1-5 or easy/medium/hard |
| tags | Yes | At least 1 tag |
| date | Yes | YYYY-MM-DD format |
| status | Yes | completed/in_progress/ready |

### DevOps Challenges

| Field | Required | Constraints |
|-------|----------|-------------|
| title | Yes | Non-empty string |
| category | Yes | MUST be `devops` |
| difficulty | Yes | 1-5 or easy/medium/hard |
| tags | Yes | At least 1 tag |
| date | Yes | YYYY-MM-DD format |
| status | Yes | completed/in_progress/ready |

### CTF Challenges

| Field | Required | Constraints |
|-------|----------|-------------|
| title | Yes | Non-empty string |
| category | Yes | MUST be `ctf` |
| difficulty | Yes | 1-5 or easy/medium/hard |
| tags | Yes | At least 1 tag |
| date | Yes | YYYY-MM-DD format |
| status | Yes | completed/in_progress/ready |
| platform | Conditional | Required if status is `completed` |
| flag | Conditional | Required if status is `completed` |
