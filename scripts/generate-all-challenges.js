import fs from "fs";
import path from "path";

function parseFrontMatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const match = content.match(/^---\n([\s\S]*?)\n---/);

    if (!match) return null;

    const yaml = match[1];
    const data = {};

    yaml.split("\n").forEach((line) => {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (m) {
        let value = m[2].trim().replace(/^["']|["']$/g, "");
        if (value.startsWith("[")) {
          data[m[1]] = value
            .replace(/[\[\]]/g, "")
            .split(",")
            .map((v) => v.trim().replace(/['"]/g, ""));
        } else {
          data[m[1]] = value;
        }
      }
    });

    const mainContent = content.replace(/^---[\s\S]*?---/, "").trim();
    data._fullContent = mainContent;

    return data;
  } catch {
    return null;
  }
}

function extractScenario(content, maxLength = 200) {
  const patterns = [
    /##\s*🎭\s*Escenario Real[^#\n]*\n([\s\S]*?)(?=\n##|\n---|\n###|$)/i,
    /##\s*🎭\s*El Escenario[^#\n]*\n([\s\S]*?)(?=\n##|\n---|\n###|$)/i,
    /##\s*🎭\s*Contexto[^#\n]*\n([\s\S]*?)(?=\n##|\n---|\n###|$)/i,
    /##\s*Contexto Empresarial[^#\n]*\n([\s\S]*?)(?=\n##|\n---|\n###|$)/i,
    />\s*_?"([^"]+)"_/m,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      let scenario = match[1]
        .replace(/\n+/g, " ")
        .replace(/[*_`>#]/g, "")
        .trim();
      if (scenario.length > 30) {
        return scenario.length > maxLength
          ? scenario.substring(0, maxLength) + "..."
          : scenario;
      }
    }
  }

  const lines = content.split("\n");
  for (const line of lines) {
    const cleanLine = line
      .replace(/^#+\s*/gm, "")
      .replace(/[*_`>#]/g, "")
      .trim();
    if (
      cleanLine &&
      !cleanLine.startsWith("```") &&
      !cleanLine.startsWith("|") &&
      !cleanLine.startsWith("- [") &&
      cleanLine.length > 40 &&
      !cleanLine.startsWith("Del Instructor") &&
      !cleanLine.includes("Mentalidad")
    ) {
      return cleanLine.length > maxLength
        ? cleanLine.substring(0, maxLength) + "..."
        : cleanLine;
    }
  }

  return "";
}

function extractSkills(content, tags) {
  const skills = [];

  if (tags && Array.isArray(tags)) {
    const skillKeywords = [
      "linux",
      "docker",
      "ssh",
      "user-management",
      "security",
      "permissions",
      "firewall",
      "nginx",
      "ansible",
      "git",
      "backup",
      "cron",
      "selinux",
      "containers",
      "devops",
      "forensics",
      "crypto",
      "web",
      "pwn",
      "reversing",
      "steganography",
      "metadata",
      "base64",
      "exiftool",
      "grep",
      "steghide",
      "nmap",
    ];
    tags.forEach((tag) => {
      const normalized = tag.toLowerCase().replace(/[_-]/g, " ");
      if (skillKeywords.some((k) => normalized.includes(k))) {
        skills.push(tag);
      }
    });
  }

  const skillPatterns = [
    /Habilidades:\s*([^\n]+)/i,
    /Skills:\s*([^\n]+)/i,
    /habilidades practicadas:?([^\n]+)/i,
  ];

  for (const pattern of skillPatterns) {
    const match = content.match(pattern);
    if (match) {
      const found = match[1]
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 2 && s.length < 30);
      skills.push(...found);
    }
  }

  return [...new Set(skills)].slice(0, 5);
}

function extractTimeEstimate(content) {
  const patterns = [
    /⏱️\s*Tiempo:?\s*(\d+[-–]?\d*)\s*(minutos?|mins?|minutes?)/i,
    /Tiempo dedicado:?\s*(\d+[-–]?\d*)\s*(minutos?|mins?|minutes?)/i,
    /Tiempo total:?\s*(\d+[-–]?\d*)\s*(minutos?|mins?|minutes?)/i,
    /duration:?\s*["']?(\d+)\s*(min|minutes?)["']?/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].includes("-")
        ? match[1].replace("-", " - ") + " min"
        : match[1] + " min";
    }
  }

  return null;
}

function extractExcerpt(filePath, maxLength = 150) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const mainContent = content.replace(/^---[\s\S]*?---/, "").trim();
    const lines = mainContent.split("\n");
    let excerpt = "";
    for (const line of lines) {
      const cleanLine = line.replace(/^#+\s*/gm, "").trim();
      if (
        cleanLine &&
        !cleanLine.startsWith("```") &&
        !cleanLine.startsWith("|") &&
        cleanLine.length > 20
      ) {
        excerpt = cleanLine;
        break;
      }
    }
    return (
      excerpt.substring(0, maxLength) +
      (excerpt.length > maxLength ? "..." : "")
    );
  } catch {
    return "";
  }
}

function normalizeStatus(status) {
  if (!status) return "ready";
  const s = status.toLowerCase();
  if (["completed", "completado", "done"].includes(s)) return "completed";
  if (["in-progress", "in_progress", "in progress"].includes(s))
    return "in_progress";
  if (["blocked"].includes(s)) return "blocked";
  if (["ready", "pending"].includes(s)) return "ready";
  return "ready";
}

function normalizeDifficulty(difficulty) {
  if (!difficulty) return "medium";
  const d = String(difficulty).toLowerCase();
  if (["1", "easy", "fácil", "facil"].includes(d)) return "easy";
  if (["2", "3", "medium", "medio"].includes(d)) return "medium";
  if (["4", "5", "hard", "difícil", "dificil"].includes(d)) return "hard";
  return "medium";
}

function getLinuxChallenges() {
  const retosPath = "./challenges/linux/retos";
  const challenges = [];

  const dirs = fs.readdirSync(retosPath).filter((f) => {
    const fullPath = path.join(retosPath, f);
    return fs.statSync(fullPath).isDirectory();
  });

  dirs.forEach((dir) => {
    const readmePath = path.join(retosPath, dir, "README.md");
    if (fs.existsSync(readmePath)) {
      const data = parseFrontMatter(readmePath);
      if (data) {
        const content = data._fullContent || "";
        challenges.push({
          id: dir,
          title: data.title || dir,
          status: normalizeStatus(data.status),
          difficulty: normalizeDifficulty(data.difficulty),
          date: data.date || "",
          excerpt: extractExcerpt(readmePath),
          scenario: extractScenario(content),
          skills: extractSkills(content, data.tags),
          timeEstimate: extractTimeEstimate(content),
          path: `/challenges/linux/${dir}`,
        });
      }
    }
  });

  return challenges.sort((a, b) => {
    const numA = parseInt(a.id.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.id.match(/\d+/)?.[0] || "0");
    return numA - numB;
  });
}

function getDockerChallenges() {
  const dockerPath = "./challenges/docker/challenges";
  const challenges = [];

  const files = fs.readdirSync(dockerPath).filter((f) => f.endsWith(".md"));

  files.forEach((file) => {
    const filePath = path.join(dockerPath, file);
    const data = parseFrontMatter(filePath);
    const id = file.replace(".md", "");
    if (data) {
      const content = data._fullContent || "";
      challenges.push({
        id,
        title: data.title || id,
        status: normalizeStatus(data.status),
        difficulty: normalizeDifficulty(data.difficulty),
        date: data.date || "",
        excerpt: extractExcerpt(filePath),
        scenario: extractScenario(content),
        skills: extractSkills(content, data.tags),
        timeEstimate: extractTimeEstimate(content),
        path: `/challenges/docker/${id}`,
      });
    }
  });

  return challenges.sort((a, b) => {
    const numA = parseInt(a.id.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.id.match(/\d+/)?.[0] || "0");
    return numA - numB;
  });
}

function getDevOpsChallenges() {
  const devopsPath = "./challenges/devops/days";
  const challenges = [];

  const files = fs.readdirSync(devopsPath).filter((f) => f.endsWith(".md"));

  files.forEach((file) => {
    const filePath = path.join(devopsPath, file);
    const data = parseFrontMatter(filePath);
    const id = file.replace(".md", "");
    if (data) {
      const content = data._fullContent || "";
      challenges.push({
        id,
        title: data.title || id,
        status: normalizeStatus(data.status),
        difficulty: normalizeDifficulty(data.difficulty),
        date: data.date || "",
        excerpt: extractExcerpt(filePath),
        scenario: extractScenario(content),
        skills: extractSkills(content, data.tags),
        timeEstimate: extractTimeEstimate(content),
        path: `/challenges/devops/${id}`,
        day: parseInt(id.match(/\d+/)?.[0] || "0"),
      });
    }
  });

  return challenges.sort((a, b) => a.day - b.day);
}

function getCTFChallenges() {
  const ctfPath = "./challenges/ctf";
  const challenges = [];

  function findMdFiles(dir, category = "") {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        findMdFiles(fullPath, item);
      } else if (item.endsWith(".md") && item !== "README.md") {
        const data = parseFrontMatter(fullPath);
        const relativePath = fullPath
          .replace(ctfPath + "/", "")
          .replace(".md", "");
        const slug = relativePath.split("/").filter(Boolean);

        if (data) {
          const content = data._fullContent || "";
          challenges.push({
            id: relativePath,
            title: data.title || relativePath,
            status: normalizeStatus(data.status),
            difficulty: normalizeDifficulty(data.difficulty),
            date: data.date || "",
            category: data.category || category || "other",
            excerpt: extractExcerpt(fullPath),
            scenario: extractScenario(content),
            skills: extractSkills(content, data.tags),
            timeEstimate: extractTimeEstimate(content),
            path: `/challenges/ctf/${slug.join("/")}`,
          });
        }
      }
    });
  }

  findMdFiles(ctfPath);

  return challenges;
}

function getHTBChallenges() {
  const htbPath = "./challenges/htb";
  const challenges = [];

  if (!fs.existsSync(htbPath)) return challenges;

  const files = fs
    .readdirSync(htbPath)
    .filter((f) => f.endsWith(".md") && f !== "README.md");

  files.forEach((file) => {
    const filePath = path.join(htbPath, file);
    const data = parseFrontMatter(filePath);
    const id = file.replace(".md", "");
    if (data) {
      const content = data._fullContent || "";
      challenges.push({
        id,
        title: data.title || id,
        status: normalizeStatus(data.status),
        difficulty: normalizeDifficulty(data.difficulty),
        date: data.date || "",
        excerpt: extractExcerpt(filePath),
        scenario: extractScenario(content),
        skills: extractSkills(content, data.tags),
        timeEstimate: extractTimeEstimate(content),
        path: `/challenges/htb/${id}`,
      });
    }
  });

  return challenges;
}

function generateAllChallenges() {
  const data = {
    lastUpdated: new Date().toISOString(),
    linux: getLinuxChallenges(),
    docker: getDockerChallenges(),
    devops: getDevOpsChallenges(),
    ctf: getCTFChallenges(),
    htb: getHTBChallenges(),
  };

  fs.writeFileSync(
    "src/data/all-challenges.json",
    JSON.stringify(data, null, 2),
  );

  console.log("✅ All challenges data generated!");
  console.log(`🐧 Linux: ${data.linux.length} challenges`);
  console.log(`🐳 Docker: ${data.docker.length} challenges`);
  console.log(`⚙️  DevOps: ${data.devops.length} challenges`);
  console.log(`🚩 CTF: ${data.ctf.length} challenges`);
  console.log(`🎯 HTB: ${data.htb.length} challenges`);

  return data;
}

generateAllChallenges();
