export function formatError(error) {
  const lines = [];
  lines.push(`  [ERROR] ${error.type}: ${error.message}`);
  lines.push(`    File: ${error.file}`);
  if (error.expected) lines.push(`    Expected: ${error.expected}`);
  if (error.actual) lines.push(`    Actual: ${error.actual}`);
  if (error.fix) lines.push(`    Fix: ${error.fix}`);
  return lines.join('\n');
}

export function formatWarning(warning) {
  const lines = [];
  lines.push(`  [WARN] ${warning.type}: ${warning.message}`);
  lines.push(`    File: ${warning.file}`);
  if (warning.suggestion) lines.push(`    Suggestion: ${warning.suggestion}`);
  return lines.join('\n');
}

export function consoleReport(result) {
  if (result.success) {
    console.log('✅ Validation passed');
  } else {
    console.log('❌ Validation failed');
  }

  if (result.errors.length > 0) {
    console.log('\nErrors:');
    result.errors.forEach((error) => {
      console.log(formatError(error));
    });
  }

  if (result.warnings.length > 0) {
    console.log('\nWarnings:');
    result.warnings.forEach((warning) => {
      console.log(formatWarning(warning));
    });
  }

  console.log(`\nFiles scanned: ${result.filesScanned}`);
  if (result.duration !== undefined) {
    console.log(`Duration: ${result.duration}ms`);
  }
}

export function jsonReport(result) {
  return JSON.stringify(result, null, 2);
}

export function exitWithCode(result) {
  if (result.errors.length > 0) {
    process.exit(1);
  }
  process.exit(0);
}
