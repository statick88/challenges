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
    const data = {
      title: "",
      status: "",
      difficulty: "",
      date: "",
      category: "",
    };

    yaml.split("\n").forEach((line) => {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (m) {
        let value = m[2].trim().replace(/^["']|["']$/g, "");
        const key = m[1];
        if (key === "title") data.title = value;
        if (key === "status") data.status = value.toLowerCase();
        if (key === "difficulty") data.difficulty = value;
        if (key === "date") data.date = value;
        if (key === "category") data.category = value;
      }
    });

    return data;
  } catch {
    return null;
  }
}

// Normalizar status
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

// Normalizar dificultad
function normalizeDifficulty(difficulty) {
  if (!difficulty) return "medium";
  const d = difficulty.toString().toLowerCase();
  if (["1", "easy", "facil"].includes(d)) return "easy";
  if (["2", "medium", "medio"].includes(d)) return "medium";
  if (["3", "hard", "dificil"].includes(d)) return "hard";
  return "medium";
}

// Contar retos de Linux
function countLinux() {
  const retosPath = path.join(CHALLENGES_PATH, "linux/retos");
  
  if (!fs.existsSync(retosPath)) {
    return { completed: 0, inProgress: 0, ready: 0, blocked: 0, percentage: 0 };
  }
  
  const dirs = fs.readdirSync(retosPath).filter((f) => {
    const fullPath = path.join(retosPath, f);
    return fs.statSync(fullPath).isDirectory();
  });

  let completed = 0;
  let inProgress = 0;
  let ready = 0;
  let blocked = 0;

  dirs.forEach((dir) => {
    const readmePath = path.join(retosPath, dir, "README.md");
    if (fs.existsSync(readmePath)) {
      const data = parseFrontMatter(readmePath);
      if (data) {
        const status = normalizeStatus(data.status);
        if (status === "completed") completed++;
        else if (status === "in_progress") inProgress++;
        else if (status === "blocked") blocked++;
        else ready++;
      }
    }
  });

  const total = dirs.length;
  return {
    completed,
    inProgress,
    ready,
    blocked,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

// Contar retos de Docker
function countDocker() {
  const dockerPath = path.join(CHALLENGES_PATH, "docker/challenges");
  
  if (!fs.existsSync(dockerPath)) {
    return { completed: 0, inProgress: 0, ready: 0, blocked: 0, percentage: 0 };
  }
  
  const files = fs.readdirSync(dockerPath).filter((f) => f.endsWith(".md"));

  let completed = 0;
  let inProgress = 0;
  let ready = 0;
  let blocked = 0;

  files.forEach((file) => {
    const filePath = path.join(dockerPath, file);
    const data = parseFrontMatter(filePath);
    if (data) {
      const status = normalizeStatus(data.status);
      if (status === "completed") completed++;
      else if (status === "in_progress") inProgress++;
      else if (status === "blocked") blocked++;
      else ready++;
    }
  });

  const total = files.length;
  return {
    completed,
    inProgress,
    ready,
    blocked,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

// Contar retos de DevOps
function countDevOps() {
  const devopsPath = path.join(CHALLENGES_PATH, "devops/days");
  
  if (!fs.existsSync(devopsPath)) {
    return { completed: 0, inProgress: 0, ready: 0, blocked: 0, percentage: 0 };
  }
  
  const files = fs.readdirSync(devopsPath).filter((f) => f.endsWith(".md"));

  let completed = 0;
  let inProgress = 0;
  let ready = 0;
  let blocked = 0;

  files.forEach((file) => {
    const filePath = path.join(devopsPath, file);
    const data = parseFrontMatter(filePath);
    if (data) {
      const status = normalizeStatus(data.status);
      if (status === "completed") completed++;
      else if (status === "in_progress") inProgress++;
      else if (status === "blocked") blocked++;
      else ready++;
    }
  });

  const total = files.length;
  return {
    completed,
    inProgress,
    ready,
    blocked,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

// Contar retos de CTF
function countCTF() {
  const ctfPath = path.join(CHALLENGES_PATH, "ctf");
  
  if (!fs.existsSync(ctfPath)) {
    return { completed: 0, inProgress: 0, ready: 0, blocked: 0, percentage: 0, categories: [] };
  }
  
  const allMdFiles = [];

  function findMdFiles(dir) {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        findMdFiles(fullPath);
      } else if (item.endsWith(".md") && item !== "README.md") {
        allMdFiles.push(fullPath);
      }
    });
  }

  findMdFiles(ctfPath);

  let completed = 0;
  let inProgress = 0;
  let ready = 0;
  let blocked = 0;

  const categoryCounts = {};

  allMdFiles.forEach((file) => {
    const data = parseFrontMatter(file);
    if (data) {
      const status = normalizeStatus(data.status);
      if (status === "completed") completed++;
      else if (status === "in_progress") inProgress++;
      else if (status === "blocked") blocked++;
      else ready++;

      const category = data.category || "other";
      if (!categoryCounts[category]) {
        categoryCounts[category] = { total: 0, completed: 0 };
      }
      categoryCounts[category].total++;
      if (status === "completed") {
        categoryCounts[category].completed++;
      }
    }
  });

  const total = allMdFiles.length;

  const categories = Object.entries(categoryCounts).map(([name, counts]) => ({
    name,
    total: counts.total,
    completed: counts.completed,
  }));

  return {
    completed,
    inProgress,
    ready,
    blocked,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    categories,
  };
}

// Contar retos de HTB
function countHTB() {
  const htbPath = path.join(CHALLENGES_PATH, "htb");

  if (!fs.existsSync(htbPath)) {
    return { completed: 0, inProgress: 0, ready: 0, blocked: 0, percentage: 0, total: 0, challenges: [] };
  }

  const allMdFiles = [];

  function findMdFiles(dir) {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        findMdFiles(fullPath);
      } else if (item.endsWith(".md") && item !== "README.md") {
        allMdFiles.push(fullPath);
      }
    });
  }

  findMdFiles(htbPath);

  let completed = 0;
  let inProgress = 0;
  let ready = 0;
  let blocked = 0;
  const challenges = [];

  allMdFiles.forEach((file) => {
    const data = parseFrontMatter(file);
    if (data) {
      const status = normalizeStatus(data.status);
      if (status === "completed") completed++;
      else if (status === "in_progress") inProgress++;
      else if (status === "blocked") blocked++;
      else ready++;

      const relativePath = path.relative(htbPath, file).replace(/\\/g, '/');
      const id = relativePath.replace('.md', '');
      const category = id.split('/')[0] || 'other';

      challenges.push({
        id,
        title: data.title || id,
        status,
        difficulty: normalizeDifficulty(data.difficulty),
        date: data.date || '',
        category,
        platform: 'HTB',
        path: `/challenges/htb/${id}`
      });
    }
  });

  const total = allMdFiles.length;

  return {
    completed,
    inProgress,
    ready,
    blocked,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    challenges
  };
}

async function generateChallengesData() {
  try {
    const linux = countLinux();
    const docker = countDocker();
    const devops = countDevOps();
    const ctfResult = countCTF();
    const htb = countHTB();

    const programs = {
      linux,
      docker,
      devops,
      ctf: ctfResult,
      htb,
    };

    const totalChallenges = linux.total + docker.total + devops.total + ctfResult.total + htb.total;
    const totalCompleted = linux.completed + docker.completed + devops.completed + ctfResult.completed + htb.completed;

    const buildTimestamp = new Date().toISOString();

    const data = {
      lastUpdated: buildTimestamp,
      buildVersion: Date.now(),
      overview: {
        totalChallenges,
        completed: totalCompleted,
        ctfCompleted: ctfResult.completed,
        completionRate: totalChallenges > 0 ? Math.round((totalCompleted / totalChallenges) * 100) : 0,
      },
      programs,
      ctfCategories: ctfResult.categories,
      recentActivity: [
        { program: "devops", activity: "DevOps Days 08-15 ready for implementation", icon: "⚙️" },
        { program: "ctf", activity: `CTF challenges: ${ctfResult.completed}/${ctfResult.total} completed`, icon: "🚩" },
        { program: "linux", activity: `Linux: ${linux.completed}/${linux.total} completed (${linux.blocked} blocked)`, icon: "🐧" },
        { program: "docker", activity: `Docker: ${docker.completed}/${docker.total} completed`, icon: "🐳" },
        { program: "devops", activity: `DevOps: ${devops.completed}/${devops.total} days completed`, icon: "⚙️" },
        { program: "htb", activity: `HTB: ${htb.completed}/${htb.total} challenges`, icon: "🎯" },
      ],
    };

    // Escribir a src/data
    const dataDir = path.join(process.cwd(), "src/data");
    await fs.promises.mkdir(dataDir, { recursive: true });
    await fs.promises.writeFile(
      path.join(dataDir, "challenges.json"),
      JSON.stringify(data, null, 2),
    );

    // Crear archivo de versión
    await fs.promises.writeFile(
      path.join(dataDir, "version.json"),
      JSON.stringify({ 
        version: data.buildVersion, 
        timestamp: buildTimestamp 
      }, null, 2),
    );

    console.log("✅ Challenges data generated successfully!");
    console.log(`📊 Total: ${totalCompleted}/${totalChallenges} (${data.overview.completionRate}%)`);
    console.log(`🐧 Linux: ${linux.completed}/${linux.total} (${linux.percentage}%)`);
    console.log(`🐳 Docker: ${docker.completed}/${docker.total} (${docker.percentage}%)`);
    console.log(`⚙️  DevOps: ${devops.completed}/${devops.total} (${devops.percentage}%)`);
    console.log(`🚩 CTF: ${ctfResult.completed}/${ctfResult.total} (${ctfResult.percentage}%)`);
    console.log(`🎯 HTB: ${htb.completed}/${htb.total} (${htb.percentage}%)`);
    console.log(`🏗️  Build version: ${data.buildVersion}`);

    return data;
  } catch (error) {
    console.error("❌ Error generating challenges data:", error);
    throw error;
  }
}

generateChallengesData();

export { generateChallengesData };
