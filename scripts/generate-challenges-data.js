import fs from "fs";
import path from "path";

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

// Contar retos de Linux
function countLinux() {
  const retosPath = "./challenges/linux/retos";
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
    name: "Linux",
    icon: "🐧",
    description: "Administración de sistemas Linux para xFusionCorp Industries",
    path: "/challenges/linux",
    color: "from-orange-500 to-red-600",
    total,
    completed,
    inProgress,
    ready,
    blocked,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

// Contar retos de Docker
function countDocker() {
  const dockerPath = "./challenges/docker/challenges";
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
    name: "Docker",
    icon: "🐳",
    description: "Desafíos de contenerización y Docker",
    path: "/challenges/docker",
    color: "from-blue-500 to-cyan-600",
    total,
    completed,
    inProgress,
    ready,
    blocked,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

// Contar retos de DevOps
function countDevOps() {
  const devopsPath = "./challenges/devops/days";
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
    name: "DevOps",
    icon: "⚙️",
    description: "100 Días de DevOps - Retos de automatización",
    path: "/challenges/devops",
    color: "from-purple-500 to-pink-600",
    total,
    completed,
    inProgress,
    ready,
    blocked,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

// Contar retos de CTF
function countCTF() {
  const ctfPath = "./challenges/ctf";
  const allMdFiles = [];

  // Función recursiva para encontrar todos los .md
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

      // Contar por categoría
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
    stats: {
      name: "CTF",
      icon: "🚩",
      description: "Capture The Flag - Cripto, Web, Pwn, Reversing, Forensics",
      path: "/challenges/ctf",
      color: "from-green-500 to-emerald-600",
      total,
      completed,
      inProgress,
      ready,
      blocked,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    },
    categories,
  };
}

// Contar retos de HTB
function countHTB() {
  const htbPath = "./challenges/htb";

  if (!fs.existsSync(htbPath)) {
    return {
      name: "HTB",
      icon: "🎯",
      description: "Hack The Box - Cybersecurity challenges",
      path: "/challenges/htb",
      color: "from-teal-500 to-cyan-600",
      total: 0,
      completed: 0,
      inProgress: 0,
      ready: 0,
      blocked: 0,
      percentage: 0,
    };
  }

  const files = fs
    .readdirSync(htbPath)
    .filter((f) => f.endsWith(".md") && f !== "README.md");

  let completed = 0;
  let inProgress = 0;
  let ready = 0;
  let blocked = 0;

  files.forEach((file) => {
    const filePath = path.join(htbPath, file);
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
    name: "HTB",
    icon: "🎯",
    description: "Hack The Box - Cybersecurity challenges",
    path: "/challenges/htb",
    color: "from-teal-500 to-cyan-600",
    total,
    completed,
    inProgress,
    ready,
    blocked,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
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
      ctf: ctfResult.stats,
      htb,
    };

    const totalChallenges =
      linux.total +
      docker.total +
      devops.total +
      ctfResult.stats.total +
      htb.total;
    const totalCompleted =
      linux.completed +
      docker.completed +
      devops.completed +
      ctfResult.stats.completed +
      htb.completed;

    const buildTimestamp = new Date().toISOString();

    const data = {
      lastUpdated: buildTimestamp,
      buildVersion: Date.now(),
      overview: {
        totalChallenges,
        completed: totalCompleted,
        ctfCompleted: ctfResult.stats.completed,
        completionRate:
          totalChallenges > 0
            ? Math.round((totalCompleted / totalChallenges) * 100)
            : 0,
      },
      programs,
      ctfCategories: ctfResult.categories,
      recentActivity: [
        {
          program: "devops",
          activity: "DevOps Days 08-15 ready for implementation",
          icon: "⚙️",
        },
        {
          program: "ctf",
          activity: `CTF challenges: ${ctfResult.stats.completed}/${ctfResult.stats.total} completed`,
          icon: "🚩",
        },
        {
          program: "linux",
          activity: `Linux: ${linux.completed}/${linux.total} completed (${linux.blocked} blocked)`,
          icon: "🐧",
        },
        {
          program: "docker",
          activity: `Docker: ${docker.completed}/${docker.total} completed`,
          icon: "🐳",
        },
        {
          program: "devops",
          activity: `DevOps: ${devops.completed}/${devops.total} days completed`,
          icon: "⚙️",
        },
        {
          program: "htb",
          activity: `HTB: ${htb.completed}/${htb.total} challenges`,
          icon: "🎯",
        },
      ],
    };

    await fs.promises.mkdir("src/data", { recursive: true });
    await fs.promises.writeFile(
      "src/data/challenges.json",
      JSON.stringify(data, null, 2),
    );

    // Crear archivo de versión para cache busting
    await fs.promises.writeFile(
      "src/data/version.json",
      JSON.stringify(
        {
          version: data.buildVersion,
          timestamp: buildTimestamp,
        },
        null,
        2,
      ),
    );

    console.log("✅ Challenges data generated successfully!");
    console.log(
      `📊 Total: ${totalCompleted}/${totalChallenges} (${data.overview.completionRate}%)`,
    );
    console.log(
      `🐧 Linux: ${linux.completed}/${linux.total} (${linux.percentage}%) - ${linux.blocked} blocked`,
    );
    console.log(
      `🐳 Docker: ${docker.completed}/${docker.total} (${docker.percentage}%)`,
    );
    console.log(
      `⚙️  DevOps: ${devops.completed}/${devops.total} (${devops.percentage}%)`,
    );
    console.log(
      `🚩 CTF: ${ctfResult.stats.completed}/${ctfResult.stats.total} (${ctfResult.stats.percentage}%)`,
    );
    console.log(`🎯 HTB: ${htb.completed}/${htb.total} (${htb.percentage}%)`);
    console.log(`🏗️  Build version: ${data.buildVersion}`);

    return data;
  } catch (error) {
    console.error("❌ Error generating challenges data:", error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateChallengesData();
}

export { generateChallengesData };
