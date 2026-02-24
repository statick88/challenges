import fs from "fs";
import path from "path";
import { parseFrontMatter } from "./utils/front-matter-parser.js";
import { consoleReport, jsonReport, exitWithCode } from "./utils/reporter.js";

const ROOT_DIR = path.resolve(process.cwd());
const isJson = process.argv.includes("--json");

function createResult() {
  return {
    success: true,
    errors: [],
    warnings: [],
    filesScanned: 0
  };
}

function countFilesInDir(dir, pattern) {
  if (!fs.existsSync(dir)) return 0;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let count = 0;

  entries.forEach(entry => {
    const name = entry.name;
    if (pattern) {
      if (pattern.test(name)) count++;
    } else if (entry.isFile() && name.endsWith(".md") && name !== "README.md") {
      count++;
    }
  });

  return count;
}

function validateProgressConsistency(result) {
  const progressFile = path.join(ROOT_DIR, "progress/overview.md");
  if (!fs.existsSync(progressFile)) {
    result.warnings.push({
      type: "MISSING_PROGRESS_FILE",
      message: "Progress overview file not found",
      file: progressFile,
      suggestion: "Create progress/overview.md to track completion"
    });
    return;
  }

  result.filesScanned++;
  const content = fs.readFileSync(progressFile, "utf-8");

  const linuxMatch = content.match(/Linux[:\s]+(\d+)/i);
  const dockerMatch = content.match(/Docker[:\s]+(\d+)/i);
  const devopsMatch = content.match(/DevOps[:\s]+(\d+)/i);
  const ctfMatch = content.match(/CTF[:\s]+(\d+)/i);

  const actualLinux = countFilesInDir(path.join(ROOT_DIR, "challenges/linux/retos"), /^\d{2}-/);
  const actualDocker = countFilesInDir(path.join(ROOT_DIR, "challenges/docker/challenges"), /^reto-\d/);
  const actualDevops = countFilesInDir(path.join(ROOT_DIR, "challenges/devops/days"), /^day-\d/);
  const actualCtf = countFilesInDir(path.join(ROOT_DIR, "challenges/ctf"));

  if (linuxMatch) {
    const claimed = parseInt(linuxMatch[1], 10);
    if (claimed !== actualLinux) {
      result.warnings.push({
        type: "PROGRESS_MISMATCH",
        message: `Linux challenge count mismatch`,
        file: progressFile,
        suggestion: `Overview claims ${claimed}, found ${actualLinux}`
      });
    }
  }

  if (dockerMatch) {
    const claimed = parseInt(dockerMatch[1], 10);
    if (claimed !== actualDocker) {
      result.warnings.push({
        type: "PROGRESS_MISMATCH",
        message: `Docker challenge count mismatch`,
        file: progressFile,
        suggestion: `Overview claims ${claimed}, found ${actualDocker}`
      });
    }
  }

  if (devopsMatch) {
    const claimed = parseInt(devopsMatch[1], 10);
    if (claimed !== actualDevops) {
      result.warnings.push({
        type: "PROGRESS_MISMATCH",
        message: `DevOps challenge count mismatch`,
        file: progressFile,
        suggestion: `Overview claims ${claimed}, found ${actualDevops}`
      });
    }
  }

  if (ctfMatch) {
    const claimed = parseInt(ctfMatch[1], 10);
    if (claimed !== actualCtf) {
      result.warnings.push({
        type: "PROGRESS_MISMATCH",
        message: `CTF challenge count mismatch`,
        file: progressFile,
        suggestion: `Overview claims ${claimed}, found ${actualCtf}`
      });
    }
  }
}

function validateCourseIndexing(result) {
  const learningJourneyDir = path.join(ROOT_DIR, "learning-journey/security");
  const indexFile = path.join(ROOT_DIR, "security/index.qmd");

  if (!fs.existsSync(learningJourneyDir)) {
    return;
  }

  if (!fs.existsSync(indexFile)) {
    result.warnings.push({
      type: "MISSING_INDEX",
      message: "Security index file not found",
      file: indexFile,
      suggestion: "Create security/index.qmd for course indexing"
    });
    return;
  }

  result.filesScanned++;
  const indexContent = fs.readFileSync(indexFile, "utf-8");

  const courses = fs.readdirSync(learningJourneyDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  courses.forEach(course => {
    if (!indexContent.includes(course)) {
      result.warnings.push({
        type: "MISSING_FROM_INDEX",
        message: `Course not found in index`,
        file: indexFile,
        suggestion: `Add ${course} to security/index.qmd`
      });
    }
  });
}

function validateCTFFlags(result) {
  const ctfDir = path.join(ROOT_DIR, "challenges/ctf");
  if (!fs.existsSync(ctfDir)) return;

  function scanCTFDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanCTFDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        result.filesScanned++;
        const frontMatter = parseFrontMatter(fullPath);
        if (!frontMatter) return;

        if (frontMatter.status === "completed" && !frontMatter.flag) {
          result.warnings.push({
            type: "MISSING_FLAG",
            message: "Completed CTF challenge missing flag field",
            file: fullPath,
            suggestion: "Add flag field to front matter"
          });
        }
      }
    });
  }

  scanCTFDir(ctfDir);
}

function main() {
  const result = createResult();
  const startTime = Date.now();

  validateProgressConsistency(result);
  validateCourseIndexing(result);
  validateCTFFlags(result);

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
  validateProgressConsistency,
  validateCourseIndexing,
  validateCTFFlags
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}