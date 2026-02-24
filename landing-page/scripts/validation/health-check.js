import fs from "fs";
import path from "path";
import { validateLinuxStructure, validateDockerStructure, validateDevOpsStructure, detectDuplicateNumbering } from "./validate-structure.js";
import { validateRequiredFields, validateCategory, validateDifficulty, validateDate, validateStatus, validateTags } from "./validate-frontmatter.js";
import { validateProgressConsistency, validateCourseIndexing, validateCTFFlags } from "./validate-consistency.js";
import { consoleReport, jsonReport, exitWithCode } from "./utils/reporter.js";
import { parseFrontMatter } from "./utils/front-matter-parser.js";

const isJson = process.argv.includes("--json");
const ROOT_DIR = path.resolve(process.cwd(), "challenges");

function runStructureValidator() {
  const result = {
    errors: [],
    warnings: [],
    filesScanned: 0,
    scanned: { linux: [], docker: [], devops: [] }
  };

  validateLinuxStructure(result);
  validateDockerStructure(result);
  validateDevOpsStructure(result);
  detectDuplicateNumbering(result);

  return {
    errors: result.errors,
    warnings: result.warnings,
    filesScanned: result.filesScanned
  };
}

function runFrontmatterValidator() {
  const result = {
    errors: [],
    warnings: [],
    filesScanned: 0,
    byCategory: { linux: 0, docker: 0, devops: 0, ctf: 0 }
  };

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

  const files = scanMarkdownFiles(ROOT_DIR);
  result.filesScanned = files.length;

  files.forEach(file => {
    const frontMatter = parseFrontMatter(file);
    if (!frontMatter) {
      result.errors.push({
        type: "PARSE_ERROR",
        message: "Could not parse front matter",
        file
      });
      return;
    }

    validateRequiredFields(frontMatter, file, result);
    if (frontMatter.category) {
      validateCategory(frontMatter.category, file, result);
    }
    if (frontMatter.difficulty) {
      validateDifficulty(frontMatter.difficulty, file, result);
    }
    if (frontMatter.date) {
      validateDate(frontMatter.date, file, result);
    }
    if (frontMatter.status) {
      validateStatus(frontMatter.status, file, result);
    }
    if (frontMatter.tags) {
      validateTags(frontMatter.tags, file, result);
    }
  });

  return {
    errors: result.errors,
    warnings: result.warnings,
    filesScanned: result.filesScanned
  };
}

function runConsistencyValidator() {
  const result = {
    errors: [],
    warnings: [],
    filesScanned: 0
  };

  validateProgressConsistency(result);
  validateCourseIndexing(result);
  validateCTFFlags(result);

  return {
    errors: result.errors,
    warnings: result.warnings,
    filesScanned: result.filesScanned
  };
}

function healthCheck() {
  const startTime = Date.now();

  const structureResults = runStructureValidator();
  const frontmatterResults = runFrontmatterValidator();
  const consistencyResults = runConsistencyValidator();

  const allErrors = [
    ...structureResults.errors,
    ...frontmatterResults.errors,
    ...consistencyResults.errors
  ];

  const allWarnings = [
    ...structureResults.warnings,
    ...frontmatterResults.warnings,
    ...consistencyResults.warnings
  ];

  const totalFiles = structureResults.filesScanned + frontmatterResults.filesScanned + consistencyResults.filesScanned;

  const byCategory = {
    structure: {
      errors: structureResults.errors.length,
      warnings: structureResults.warnings.length
    },
    frontmatter: {
      errors: frontmatterResults.errors.length,
      warnings: frontmatterResults.warnings.length
    },
    consistency: {
      errors: consistencyResults.errors.length,
      warnings: consistencyResults.warnings.length
    }
  };

  const summary = {
    timestamp: new Date().toISOString(),
    totalFiles,
    totalErrors: allErrors.length,
    totalWarnings: allWarnings.length,
    byCategory,
    success: allErrors.length === 0,
    duration: Date.now() - startTime
  };

  if (isJson) {
    console.log(JSON.stringify({
      ...summary,
      errors: allErrors,
      warnings: allWarnings
    }, null, 2));
  } else {
    console.log("=== Health Check Report ===");
    console.log(`Timestamp: ${summary.timestamp}`);
    console.log(`\nSummary:`);
    console.log(`  Total files scanned: ${totalFiles}`);
    console.log(`  Total errors: ${allErrors.length}`);
    console.log(`  Total warnings: ${allWarnings.length}`);
    console.log(`\nBy Category:`);
    console.log(`  Structure: ${byCategory.structure.errors} errors, ${byCategory.structure.warnings} warnings`);
    console.log(`  Frontmatter: ${byCategory.frontmatter.errors} errors, ${byCategory.frontmatter.warnings} warnings`);
    console.log(`  Consistency: ${byCategory.consistency.errors} errors, ${byCategory.consistency.warnings} warnings`);

    if (allErrors.length > 0) {
      console.log("\nErrors:");
      allErrors.slice(0, 10).forEach(err => {
        console.log(`  [ERROR] ${err.type}: ${err.message}`);
        console.log(`    File: ${err.file}`);
      });
      if (allErrors.length > 10) {
        console.log(`  ... and ${allErrors.length - 10} more errors`);
      }
    }

    if (allWarnings.length > 0) {
      console.log("\nWarnings:");
      allWarnings.slice(0, 10).forEach(warn => {
        console.log(`  [WARN] ${warn.type}: ${warn.message}`);
        console.log(`    File: ${warn.file}`);
      });
      if (allWarnings.length > 10) {
        console.log(`  ... and ${allWarnings.length - 10} more warnings`);
      }
    }

    console.log(`\nStatus: ${summary.success ? "✅ PASSED" : "❌ FAILED"}`);
  }

  exitWithCode({ errors: allErrors, warnings: [] });
}

healthCheck();