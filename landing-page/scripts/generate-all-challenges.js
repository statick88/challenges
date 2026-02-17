import fs from "fs";
import path from "path";

// Ruta base de challenges (directorio hermano)
const CHALLENGES_PATH = path.join(process.cwd(), "..", "challenges");

// Parsear frontmatter de un archivo markdown
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
        data[m[1]] = value;
      }
    });
    
    const mainContent = content.replace(/^---[\s\S]*?---/, "").trim();
    const firstParagraph = mainContent.split("\n\n")[0].replace(/^#+\s*/gm, "").substring(0, 200);
    data.excerpt = firstParagraph + (firstParagraph.length >= 200 ? "..." : "");
    
    return data;
  } catch {
    return null;
  }
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

function getLinuxChallenges() {
  const retosPath = path.join(CHALLENGES_PATH, "linux/retos");
  const challenges = [];
  
  if (!fs.existsSync(retosPath)) return challenges;

  const dirs = fs.readdirSync(retosPath).filter((f) => {
    const fullPath = path.join(retosPath, f);
    return fs.statSync(fullPath).isDirectory();
  });

  dirs.forEach((dir) => {
    const readmePath = path.join(retosPath, dir, "README.md");
    if (fs.existsSync(readmePath)) {
      const data = parseFrontMatter(readmePath);
      if (data) {
        challenges.push({
          id: dir,
          title: data.title || dir,
          status: normalizeStatus(data.status),
          difficulty: data.difficulty || "medium",
          date: data.date || "",
          excerpt: extractExcerpt(readmePath),
          path: `/linux/${dir}`,
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
  const dockerPath = path.join(CHALLENGES_PATH, "docker/challenges");
  const challenges = [];
  
  if (!fs.existsSync(dockerPath)) return challenges;
  
  const files = fs.readdirSync(dockerPath).filter((f) => f.endsWith(".md"));
  
  files.forEach((file) => {
    const filePath = path.join(dockerPath, file);
    const data = parseFrontMatter(filePath);
    const id = file.replace(".md", "");
    if (data) {
      challenges.push({
        id,
        title: data.title || id,
        status: normalizeStatus(data.status),
        difficulty: data.difficulty || "2",
        date: data.date || "",
        excerpt: extractExcerpt(filePath),
        path: `/docker/${id}`,
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
  const devopsPath = path.join(CHALLENGES_PATH, "devops/days");
  const challenges = [];
  
  if (!fs.existsSync(devopsPath)) return challenges;
  
  const files = fs.readdirSync(devopsPath).filter((f) => f.endsWith(".md"));
  
  files.forEach((file) => {
    const filePath = path.join(devopsPath, file);
    const data = parseFrontMatter(filePath);
    const id = file.replace(".md", "");
    if (data) {
      challenges.push({
        id,
        title: data.title || id,
        status: normalizeStatus(data.status),
        difficulty: data.difficulty || "2",
        date: data.date || "",
        excerpt: extractExcerpt(filePath),
        path: `/devops/${id}`,
        day: parseInt(id.match(/\d+/)?.[0] || "0"),
      });
    }
  });
  
  return challenges.sort((a, b) => a.day - b.day);
}

function getCTFChallenges() {
  const ctfPath = path.join(CHALLENGES_PATH, "ctf");
  const challenges = [];
  
  if (!fs.existsSync(ctfPath)) return challenges;
  
  function findMdFiles(dir, category = "") {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        findMdFiles(fullPath, item);
      } else if (item.endsWith(".md") && item !== "README.md") {
        const data = parseFrontMatter(fullPath);
        const relativePath = fullPath.replace(ctfPath + "/", "").replace(".md", "");
        const slug = relativePath.split("/").filter(Boolean);
        
        if (data) {
          challenges.push({
            id: relativePath,
            title: data.title || relativePath,
            status: normalizeStatus(data.status),
            difficulty: data.difficulty || "easy",
            date: data.date || "",
            category: data.category || category || "other",
            excerpt: extractExcerpt(fullPath),
            path: `/ctf/${slug.join("/")}`,
          });
        }
      }
    });
  }
  
  findMdFiles(ctfPath);
  
  return challenges;
}

function getHTBChallenges() {
  const htbPath = path.join(CHALLENGES_PATH, "htb");
  const challenges = [];
  
  if (!fs.existsSync(htbPath)) return challenges;
  
  function findMdFiles(dir, category = "") {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        findMdFiles(fullPath, item);
      } else if (item.endsWith(".md") && item !== "README.md") {
        const data = parseFrontMatter(fullPath);
        const relativePath = fullPath.replace(htbPath + "/", "").replace(".md", "");
        
        if (data) {
          challenges.push({
            id: relativePath,
            title: data.title || relativePath,
            status: normalizeStatus(data.status),
            difficulty: data.difficulty || "easy",
            date: data.date || "",
            category: category || "other",
            platform: "HTB",
            excerpt: extractExcerpt(fullPath),
            path: `/htb/${relativePath}`,
          });
        }
      }
    });
  }
  
  findMdFiles(htbPath);
  
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
  
  const dataDir = path.join(process.cwd(), "src/data");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, "all-challenges.json"), JSON.stringify(data, null, 2));
  
  console.log("✅ All challenges data generated!");
  console.log(`🐧 Linux: ${data.linux.length} challenges`);
  console.log(`🐳 Docker: ${data.docker.length} challenges`);
  console.log(`⚙️  DevOps: ${data.devops.length} challenges`);
  console.log(`🚩 CTF: ${data.ctf.length} challenges`);
  console.log(`🎯 HTB: ${data.htb.length} challenges`);
  
  return data;
}

generateAllChallenges();
