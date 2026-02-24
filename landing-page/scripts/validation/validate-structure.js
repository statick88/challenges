import fs from "fs";
import path from "path";
import { NAMING_PATTERNS } from "./utils/schema.js";
import { consoleReport, jsonReport, exitWithCode } from "./utils/reporter.js";

const ROOT_DIR = path.resolve(process.cwd(), "..", "challenges");
const isJson = process.argv.includes("--json");

function createResult() {
  return {
    success: true,
    errors: [],
    warnings: [],
    filesScanned: 0,
    scanned: { linux: [], docker: [], devops: [] }
  };
}

function validateLinuxStructure(result) {
  const linuxDir = path.join(ROOT_DIR, "linux/retos");
  if (!fs.existsSync(linuxDir)) {
    result.errors.push({
      type: "MISSING_DIRECTORY",
      message: "Linux challenges directory not found",
      file: linuxDir
    });
    return;
  }

  const entries = fs.readdirSync(linuxDir, { withFileTypes: true });
  result.filesScanned += entries.length;
  const seenNumbers = new Map();

  entries.forEach(entry => {
    if (!entry.isDirectory()) return;
    const match = entry.name.match(/^(\d{2})-/);
    if (!match) {
      result.errors.push({
        type: "INVALID_NAMING",
        message: `Directory does not match pattern ${NAMING_PATTERNS.linux.dir}`,
        file: path.join(linuxDir, entry.name),
        expected: "XX-description format",
        actual: entry.name
      });
      return;
    }

    const num = match[1];
    if (seenNumbers.has(num)) {
      result.errors.push({
        type: "DUPLICATE_NUMBERING",
        message: `Duplicate numbering: ${num}`,
        file: path.join(linuxDir, entry.name),
        actual: `Also used by ${seenNumbers.get(num)}`
      });
    } else {
      seenNumbers.set(num, entry.name);
    }

    const readmePath = path.join(linuxDir, entry.name, "README.md");
    if (!fs.existsSync(readmePath)) {
      result.errors.push({
        type: "MISSING_README",
        message: "README.md not found in challenge directory",
        file: path.join(linuxDir, entry.name),
        expected: "README.md"
      });
    }

    result.scanned.linux.push(entry.name);
  });
}

function validateDockerStructure(result) {
  const dockerDir = path.join(ROOT_DIR, "docker/challenges");
  if (!fs.existsSync(dockerDir)) {
    result.errors.push({
      type: "MISSING_DIRECTORY",
      message: "Docker challenges directory not found",
      file: dockerDir
    });
    return;
  }

  const entries = fs.readdirSync(dockerDir, { withFileTypes: true });
  result.filesScanned += entries.length;
  const seenNumbers = new Map();

  entries.forEach(entry => {
    if (!entry.isFile() || !entry.name.endsWith(".md")) return;
    if (entry.name === "README.md") return;

    const match = entry.name.match(/^reto-(\d{1,2})-/);
    if (!match) {
      if (entry.name.endsWith(".md")) {
        result.warnings.push({
          type: "INVALID_NAMING",
          message: `File does not match pattern ${NAMING_PATTERNS.docker.file}`,
          file: path.join(dockerDir, entry.name),
          suggestion: "Use reto-XX-description.md format"
        });
      }
      return;
    }

    const num = match[1].padStart(2, "0");
    if (seenNumbers.has(num)) {
      result.errors.push({
        type: "DUPLICATE_NUMBERING",
        message: `Duplicate numbering: reto-${num}`,
        file: path.join(dockerDir, entry.name),
        actual: `Also used by ${seenNumbers.get(num)}`
      });
    } else {
      seenNumbers.set(num, entry.name);
    }

    result.scanned.docker.push(entry.name);
  });
}

function validateDevOpsStructure(result) {
  const devopsDir = path.join(ROOT_DIR, "devops/days");
  if (!fs.existsSync(devopsDir)) {
    result.errors.push({
      type: "MISSING_DIRECTORY",
      message: "DevOps challenges directory not found",
      file: devopsDir
    });
    return;
  }

  const entries = fs.readdirSync(devopsDir, { withFileTypes: true });
  result.filesScanned += entries.length;
  const seenNumbers = new Map();

  entries.forEach(entry => {
    if (!entry.isFile() || !entry.name.endsWith(".md")) return;
    if (entry.name === "README.md") return;

    const match = entry.name.match(/^day-(\d{1,2})-/);
    if (!match) {
      if (entry.name.endsWith(".md")) {
        result.warnings.push({
          type: "INVALID_NAMING",
          message: `File does not match pattern ${NAMING_PATTERNS.devops.file}`,
          file: path.join(devopsDir, entry.name),
          suggestion: "Use day-XX-description.md format"
        });
      }
      return;
    }

    const num = match[1].padStart(2, "0");
    if (seenNumbers.has(num)) {
      result.errors.push({
        type: "DUPLICATE_NUMBERING",
        message: `Duplicate numbering: day-${num}`,
        file: path.join(devopsDir, entry.name),
        actual: `Also used by ${seenNumbers.get(num)}`
      });
    } else {
      seenNumbers.set(num, entry.name);
    }

    result.scanned.devops.push(entry.name);
  });
}

function detectDuplicateNumbering(result) {
  const allNumbers = new Map();

  result.scanned.linux.forEach(name => {
    const match = name.match(/^(\d{2})-/);
    if (match) {
      const key = `linux-${match[1]}`;
      allNumbers.set(key, (allNumbers.get(key) || 0) + 1);
    }
  });

  result.scanned.docker.forEach(name => {
    const match = name.match(/^reto-(\d{1,2})-/);
    if (match) {
      const key = `docker-${match[1].padStart(2, "0")}`;
      allNumbers.set(key, (allNumbers.get(key) || 0) + 1);
    }
  });

  result.scanned.devops.forEach(name => {
    const match = name.match(/^day-(\d{1,2})-/);
    if (match) {
      const key = `devops-${match[1].padStart(2, "0")}`;
      allNumbers.set(key, (allNumbers.get(key) || 0) + 1);
    }
  });

  return allNumbers;
}

function main() {
  const result = createResult();
  const startTime = Date.now();

  validateLinuxStructure(result);
  validateDockerStructure(result);
  validateDevOpsStructure(result);
  detectDuplicateNumbering(result);

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
  validateLinuxStructure,
  validateDockerStructure,
  validateDevOpsStructure,
  detectDuplicateNumbering
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}