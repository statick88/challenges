import fs from "fs";
import path from "path";
import { parseFrontMatter } from "./utils/front-matter-parser.js";
import {
  REQUIRED_FIELDS,
  VALID_CATEGORIES,
  VALID_STATUSES,
  DIFFICULTY_PATTERNS,
  DATE_PATTERN
} from "./utils/schema.js";
import { consoleReport, jsonReport, exitWithCode } from "./utils/reporter.js";

const ROOT_DIR = path.resolve(process.cwd(), "challenges");
const isJson = process.argv.includes("--json");

function createResult() {
  return {
    success: true,
    errors: [],
    warnings: [],
    filesScanned: 0,
    byCategory: { linux: 0, docker: 0, devops: 0, ctf: 0 }
  };
}

function validateRequiredFields(frontMatter, filePath, result) {
  const missing = [];
  REQUIRED_FIELDS.forEach(field => {
    if (!frontMatter[field] || frontMatter[field] === "") {
      missing.push(field);
    }
  });

  if (missing.length > 0) {
    result.errors.push({
      type: "MISSING_REQUIRED_FIELD",
      message: `Missing required fields: ${missing.join(", ")}`,
      file: filePath,
      expected: REQUIRED_FIELDS.join(", "),
      actual: `Missing: ${missing.join(", ")}`
    });
    return false;
  }
  return true;
}

function validateCategory(value, filePath, result) {
  if (!VALID_CATEGORIES.includes(value.toLowerCase())) {
    result.errors.push({
      type: "INVALID_CATEGORY",
      message: `Invalid category: ${value}`,
      file: filePath,
      expected: VALID_CATEGORIES.join(", "),
      actual: value
    });
    return false;
  }
  return true;
}

function validateDifficulty(value, filePath, result) {
  const num = parseInt(value, 10);
  const isNumericValid = !isNaN(num) && num >= DIFFICULTY_PATTERNS.numeric.min && num <= DIFFICULTY_PATTERNS.numeric.max;
  const isTextValid = DIFFICULTY_PATTERNS.text.includes(value.toLowerCase());

  if (!isNumericValid && !isTextValid) {
    result.errors.push({
      type: "INVALID_DIFFICULTY",
      message: `Invalid difficulty: ${value}`,
      file: filePath,
      expected: "1-5 or easy/medium/hard",
      actual: value
    });
    return false;
  }
  return true;
}

function validateDate(value, filePath, result) {
  if (!DATE_PATTERN.test(value)) {
    result.errors.push({
      type: "INVALID_DATE",
      message: `Invalid date format: ${value}`,
      file: filePath,
      expected: "YYYY-MM-DD",
      actual: value
    });
    return false;
  }

  const year = value.split("-")[0];
  if (year === "2025") {
    result.warnings.push({
      type: "OUTDATED_YEAR",
      message: `Date year is 2025, consider updating`,
      file: filePath,
      suggestion: "Update to current year"
    });
  }
  return true;
}

function validateStatus(value, filePath, result) {
  if (!VALID_STATUSES.includes(value.toLowerCase())) {
    result.errors.push({
      type: "INVALID_STATUS",
      message: `Invalid status: ${value}`,
      file: filePath,
      expected: VALID_STATUSES.join(", "),
      actual: value
    });
    return false;
  }
  return true;
}

function validateTags(value, filePath, result) {
  if (!Array.isArray(value)) {
    if (typeof value === "string" && value.trim()) {
      return true;
    }
    result.errors.push({
      type: "INVALID_TAGS",
      message: "Tags must be an array with at least 1 element",
      file: filePath,
      expected: "Array with min 1 element",
      actual: typeof value
    });
    return false;
  }

  if (value.length < 1) {
    result.errors.push({
      type: "INVALID_TAGS",
      message: "Tags array must have at least 1 element",
      file: filePath,
      expected: "Array with min 1 element",
      actual: "Empty array"
    });
    return false;
  }
  return true;
}

function scanMarkdownFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanMarkdownFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      if (entry.name !== "README.md" || dir !== ROOT_DIR) {
        files.push(fullPath);
      }
    }
  });

  return files;
}

function validateFile(filePath, result) {
  const frontMatter = parseFrontMatter(filePath);
  if (!frontMatter) {
    result.errors.push({
      type: "PARSE_ERROR",
      message: "Could not parse front matter",
      file: filePath
    });
    return;
  }

  validateRequiredFields(frontMatter, filePath, result);

  if (frontMatter.category) {
    if (validateCategory(frontMatter.category, filePath, result)) {
      const cat = frontMatter.category.toLowerCase();
      if (result.byCategory[cat] !== undefined) {
        result.byCategory[cat]++;
      }
    }
  }

  if (frontMatter.difficulty) {
    validateDifficulty(frontMatter.difficulty, filePath, result);
  }

  if (frontMatter.date) {
    validateDate(frontMatter.date, filePath, result);
  }

  if (frontMatter.status) {
    validateStatus(frontMatter.status, filePath, result);
  }

  if (frontMatter.tags) {
    validateTags(frontMatter.tags, filePath, result);
  }
}

function main() {
  const result = createResult();
  const startTime = Date.now();

  const files = scanMarkdownFiles(ROOT_DIR);
  result.filesScanned = files.length;

  files.forEach(file => validateFile(file, result));

  result.duration = Date.now() - startTime;
  result.success = result.errors.length === 0;

  if (isJson) {
    console.log(jsonReport(result));
  } else {
    consoleReport(result);
  }

  exitWithCode(result);
}

export {
  validateRequiredFields,
  validateCategory,
  validateDifficulty,
  validateDate,
  validateStatus,
  validateTags
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}