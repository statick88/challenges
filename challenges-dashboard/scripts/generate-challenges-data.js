import fs from "fs/promises";
import path from "path";

// ====== CONSTANTS ======
const MOCK_DATA = {
  overview: {
    totalChallenges: 123,
    completed: 9,
    completionRate: 7.3,
    streak: 6,
  },
  linux: {
    total: 18,
    completed: 4,
    percentage: 22.2,
  },
  docker: {
    total: 5,
    completed: 1,
    percentage: 20.0,
  },
  devops: {
    total: 100,
    completed: 4,
    percentage: 4.0,
  },
  recentActivity: [
    "Day 16 - Setting up monitoring infrastructure",
    "Day 15 - CI/CD pipeline implementation",
    "Day 14 - Docker container optimization",
    "Day 13 - Linux user management",
    "Day 12 - Network configuration",
    "Day 11 - Security hardening",
    "Day 10 - Backup strategies",
    "Day 9 - Performance tuning",
  ],
  skills: [
    "User Management",
    "Docker Containers",
    "Shell Scripting",
    "Network Configuration",
    "Security Hardening",
    "Monitoring",
    "CI/CD Pipelines",
    "Performance Tuning",
    "Backup Strategies",
  ],
};

const PROGRAM_CONFIG = {
  linux: {
    name: "Linux",
    icon: "🐧",
    color: "blue",
    keywords: ["linux", "user", "system"],
  },
  docker: {
    name: "Docker",
    icon: "🐳",
    color: "cyan",
    keywords: ["docker", "container"],
  },
  devops: {
    name: "DevOps",
    icon: "⚙️",
    color: "purple",
    keywords: ["devops", "script", "pipeline"],
  },
};

const REGEX_PATTERNS = {
  // Be permissive about spacing/alignment and the emoji used in non-essential columns.
  // Captures: total, completed, inProgress, remaining, percentage
  linux:
    /\|\s*🐧\s*\*\*Linux Challenges\*\*\s*\|\s*(\d+)\s*\|\s*(\d+)\s*✅\s*\|\s*(\d+)\s*🔓\s*\|\s*(\d+)\s*🔒\s*\|\s*\*\*([\d.]+)%\*\*\s*\|/,
  docker:
    /\|\s*🐳\s*\*\*Docker Challenges\*\*\s*\|\s*(\d+)\s*\|\s*(\d+)\s*✅\s*\|\s*(\d+)\s*[^|]+\|\s*(\d+)\s*[^|]+\|\s*\*\*([\d.]+)%\*\*\s*\|/,
  devops:
    /\|\s*⚙️\s*\*\*100 Days DevOps\*\*\s*\|\s*(\d+)\s*\|\s*(\d+)\s*✅\s*\|\s*(\d+)\s*🔄\s*\|\s*(\d+)\s*[^|]+\|\s*\*\*([\d.]+)%\*\*\s*\|/,
  total:
    /\|\s*\*\*TOTAL\*\*\s*\|\s*\*\*(\d+)\*\*\s*\|\s*\*\*(\d+)\*\*\s*✅\s*\|\s*\*\*(\d+)\*\*\s*🔓\s*\|\s*\*\*(\d+)\*\*\s*[^|]+\|\s*\*\*([\d.]+)%\*\*\s*\|/,
  activity: /\|\s*\d+-\d+-\d+\s*\|\s*[^|]+\|\s*([^|]+)/g,
  skillsSection: /## 🛠️ Technical Skills Coverage[\s\S]*?##/,
  skillCell: /\|\s*\*\*([^*]+)\*\*\s*\|/g,
  date: /\d+-\d+-\d+/,
};

// Función para generar datos de ejemplo cuando no existe el archivo
function generateMockData() {
  return MOCK_DATA;
}

// ====== PARSING UTILITIES ======

/**
 * Extracts program metrics from content using provided regex pattern
 * @param {string} content - The markdown content to parse
 * @param {RegExp} pattern - Regex pattern to match program data
 * @returns {object} Program data with total, completed, inProgress, percentage
 */
function extractProgramMetrics(content, pattern) {
  const match = content.match(pattern);
  if (!match) return { total: 0, completed: 0, inProgress: 0, percentage: 0 };

  return {
    total: parseInt(match[1]) || 0,
    completed: parseInt(match[2]) || 0,
    inProgress: parseInt(match[3]) || 0,
    percentage: parseFloat(match[5]) || 0,
  };
}

/**
 * Extracts overall metrics from content
 * @param {string} content - The markdown content to parse
 * @returns {object} Overall metrics with totals and completion rate
 */
function extractOverallMetrics(content) {
  const match = content.match(REGEX_PATTERNS.total);
  if (!match)
    return {
      totalChallenges: 0,
      completed: 0,
      inProgress: 0,
      remaining: 0,
      completionRate: 0,
    };

  return {
    totalChallenges: parseInt(match[1]) || 0,
    completed: parseInt(match[2]) || 0,
    inProgress: parseInt(match[3]) || 0,
    remaining: parseInt(match[4]) || 0,
    completionRate: parseFloat(match[5]) || 0,
  };
}

/**
 * Extracts recent activity entries from content
 * @param {string} content - The markdown content to parse
 * @returns {array} Array of activity strings (max 8)
 */
function extractRecentActivity(content) {
  const activityMatches = [...content.matchAll(REGEX_PATTERNS.activity)];
  return activityMatches.map((match) => match[1].trim()).slice(0, 8);
}

/**
 * Extracts unique dates from activity matches to calculate streak
 * @param {array} activityMatches - RegExpMatchArray from content.matchAll()
 * @returns {number} Number of unique dates (streak)
 */
function calculateStreak(activityMatches) {
  const uniqueDates = [
    ...new Set(
      activityMatches.map((match) => {
        const dateMatch = match[0].match(REGEX_PATTERNS.date);
        return dateMatch ? dateMatch[0] : "";
      }),
    ),
  ].filter((date) => date);

  return uniqueDates.length;
}

/**
 * Extracts technical skills from content
 * @param {string} content - The markdown content to parse
 * @returns {array} Array of skill names
 */
function extractSkills(content) {
  const skillsSection = content.match(REGEX_PATTERNS.skillsSection);
  if (!skillsSection) return [];

  const skillMatches = [...skillsSection[0].matchAll(REGEX_PATTERNS.skillCell)];
  return skillMatches.map((match) => match[1].trim());
}

/**
 * Main parser function that reads and extracts all data from overview file
 * @param {string} filePath - Path to overview.md file
 * @returns {object|null} Parsed data object or null on error
 */
async function parseOverviewFile(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const activityMatches = [...content.matchAll(REGEX_PATTERNS.activity)];

    return {
      linux: extractProgramMetrics(content, REGEX_PATTERNS.linux),
      docker: extractProgramMetrics(content, REGEX_PATTERNS.docker),
      devops: extractProgramMetrics(content, REGEX_PATTERNS.devops),
      overview: {
        ...extractOverallMetrics(content),
        streak: calculateStreak(activityMatches),
      },
      recentActivity: extractRecentActivity(content),
      skills: extractSkills(content),
    };
  } catch (error) {
    console.error(`Error parsing overview file:`, error);
    return null;
  }
}

// ====== DATA TRANSFORMATION ======

/**
 * Determines the program for an activity string
 * @param {string} activity - Activity description
 * @returns {string} Program identifier (linux, docker, or devops)
 */
function detectActivityProgram(activity) {
  const lowerActivity = activity.toLowerCase();

  for (const [program, config] of Object.entries(PROGRAM_CONFIG)) {
    if (config.keywords.some((keyword) => lowerActivity.includes(keyword))) {
      return program;
    }
  }

  return "devops"; // Default fallback
}

/**
 * Filters skills for a specific program
 * @param {array} skills - All skills array
 * @param {string} program - Program identifier
 * @returns {array} Filtered skills for program
 */
function filterSkillsForProgram(skills, program) {
  const config = PROGRAM_CONFIG[program];
  return skills.filter((skill) =>
    config.keywords.some((keyword) => skill.toLowerCase().includes(keyword)),
  );
}

/**
 * Creates a program data object
 * @param {string} program - Program identifier
 * @param {object} data - Parsed data object
 * @returns {object} Formatted program data
 */
function createProgramData(program, data) {
  const config = PROGRAM_CONFIG[program];
  const programData = data[program];

  return {
    name: config.name,
    icon: config.icon,
    color: config.color,
    total: programData.total,
    completed: programData.completed,
    percentage: programData.percentage,
    recentActivity: data.recentActivity.filter(
      (activity) => detectActivityProgram(activity) === program,
    ),
    skills: filterSkillsForProgram(data.skills, program),
  };
}

/**
 * Transforms raw parsed data into final challenges data format
 * @param {object} data - Raw parsed data from overview.md
 * @returns {object} Formatted challenges data ready for output
 */
function transformChallengesData(data) {
  return {
    lastUpdated: new Date().toISOString(),
    overview: {
      totalChallenges: data.overview.totalChallenges,
      completed: data.overview.completed,
      completionRate: data.overview.completionRate,
      streak: data.overview.streak,
    },
    programs: {
      linux: createProgramData("linux", data),
      docker: createProgramData("docker", data),
      devops: createProgramData("devops", data),
    },
    recentActivity: data.recentActivity.map((activity) => ({
      program: detectActivityProgram(activity),
      activity,
      icon: PROGRAM_CONFIG[detectActivityProgram(activity)].icon,
    })),
    skills: data.skills,
  };
}

// ====== FILE OPERATIONS ======

/**
 * Logs a summary of generated metrics
 * @param {object} data - Raw parsed data object
 */
function logMetricsSummary(data) {
  console.log("✅ Challenges data generated successfully!");
  console.log(
    `📊 Total: ${data.overview.completed}/${data.overview.totalChallenges} (${data.overview.completionRate}%)`,
  );
  console.log(`🔥 Current streak: ${data.overview.streak} days`);
  console.log(
    `🐧 Linux: ${data.linux.completed}/${data.linux.total} (${data.linux.percentage}%)`,
  );
  console.log(
    `🐳 Docker: ${data.docker.completed}/${data.docker.total} (${data.docker.percentage}%)`,
  );
  console.log(
    `⚙️ DevOps: ${data.devops.completed}/${data.devops.total} (${data.devops.percentage}%)`,
  );
}

/**
 * Writes challenges data to JSON file
 * @param {object} challengesData - Data to write
 * @param {string} outputPath - Path to output file
 */
async function writeChallengesData(challengesData, outputPath) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(challengesData, null, 2));
}

/**
 * Loads data from either overview.md or mock data
 * @param {string} filePath - Path to overview.md file
 * @returns {object} Parsed data object
 */
async function loadChallengesData(filePath) {
  try {
    await fs.access(filePath);
    const parsedData = await parseOverviewFile(filePath);

    if (parsedData) {
      return parsedData;
    }
  } catch (error) {
    console.warn("⚠️ Overview file not found, using mock data for demo");
  }

  console.warn("⚠️ Using fallback mock data");
  return generateMockData();
}

/**
 * Main function to generate challenges data
 * @returns {object} Generated challenges data
 */
async function generateChallengesData() {
  // Support both local development and CI/CD environments
  // Local: /path/to/challenges-dashboard/challenges-dashboard (nested repo)
  // CI/CD: /path/to/challenges-dashboard/challenges-dashboard (same structure)
  let progressDir = "../progress";

  // If running from nested repo and progress dir doesn't exist, try parent paths
  let overviewPath = path.join(progressDir, "overview.md");

  // Check multiple possible locations
  const possiblePaths = [
    "../progress/overview.md", // Local development (nested)
    "../../progress/overview.md", // GitHub Actions CI/CD
    "./progress/overview.md", // From parent directory
  ];

  for (const possiblePath of possiblePaths) {
    try {
      await fs.access(possiblePath);
      overviewPath = possiblePath;
      console.log(`✓ Found progress data at: ${possiblePath}`);
      break;
    } catch {
      // Path doesn't exist, try next one
    }
  }

  const outputPath = "src/data/challenges.json";

  try {
    // Load data from file or use mock data
    const data = await loadChallengesData(overviewPath);

    // Transform data into final format
    const challengesData = transformChallengesData(data);

    // Write to file
    await writeChallengesData(challengesData, outputPath);

    // Log summary
    logMetricsSummary(data);

    return challengesData;
  } catch (error) {
    console.error("❌ Error generating challenges data:", error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  generateChallengesData();
}

export { generateChallengesData };
