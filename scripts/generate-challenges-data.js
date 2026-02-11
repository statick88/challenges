import fs from "fs";
import path from "path";

function countChallenges() {
  const counts = {
    linux: 0,
    docker: 0,
    devops: 0,
    ctf: 0,
    htb: 0,
    total: 0,
  };

  // Linux: count directorios en retos/
  try {
    const linuxRetos = fs.readdirSync("./challenges/linux/retos");
    counts.linux = linuxRetos.filter((f) => {
      const fullPath = path.join("./challenges/linux/retos", f);
      return fs.statSync(fullPath).isDirectory();
    }).length;
  } catch {
    counts.linux = 19;
  }

  // Docker: count .md files
  try {
    const dockerMd = fs.readdirSync("./challenges/docker/challenges");
    counts.docker = dockerMd.filter((f) => f.endsWith(".md")).length;
  } catch {
    counts.docker = 5;
  }

  // DevOps: count .md files
  try {
    const devopsMd = fs.readdirSync("./challenges/devops/days");
    counts.devops = devopsMd.filter((f) => f.endsWith(".md")).length;
  } catch {
    counts.devops = 15;
  }

  // CTF: count retos directories + md files en todas las carpetas
  try {
    const ctfPath = "./challenges/ctf";
    const ctfItems = fs.readdirSync(ctfPath);

    // Contar retos01, retos02, etc.
    const retos = ctfItems.filter((f) => {
      const fullPath = path.join(ctfPath, f);
      return f.startsWith("reto") && fs.statSync(fullPath).isDirectory();
    });

    // Contar md files en el directorio principal (no en subcarpetas)
    const mainMdFiles = ctfItems.filter(
      (f) => f.endsWith(".md") && f !== "README.md",
    );

    // Contar md files en subcarpetas (crypto, web, pwn, reversing, misc)
    const categories = ["crypto", "web", "pwn", "reversing", "misc"];
    let categoryMdFiles = 0;
    categories.forEach((cat) => {
      try {
        const catPath = path.join(ctfPath, cat);
        if (fs.existsSync(catPath)) {
          const catFiles = fs.readdirSync(catPath);
          categoryMdFiles += catFiles.filter((f) => f.endsWith(".md")).length;
        }
      } catch {}
    });

    counts.ctf = retos.length + mainMdFiles.length + categoryMdFiles;
  } catch {
    counts.ctf = 12;
  }

  // HTB: count .md files
  try {
    const htbMd = fs.readdirSync("./challenges/htb");
    counts.htb = htbMd.filter((f) => f.endsWith(".md")).length;
  } catch {
    counts.htb = 1;
  }

  counts.total = counts.linux + counts.docker + counts.devops + counts.ctf + counts.htb;

  return counts;
}

async function generateChallengesData() {
  try {
    const counts = countChallenges();

    const data = {
      lastUpdated: new Date().toISOString(),
      overview: {
        totalChallenges: counts.total,
        completed: counts.linux + counts.docker + counts.devops, // Solo estos 3 están completos
        ctfCompleted: counts.ctf,
        completionRate: Math.round(
          ((counts.linux + counts.docker + counts.devops) / counts.total) * 100,
        ),
      },
      programs: {
        linux: {
          name: "Linux",
          icon: "🐧",
          description:
            "Administración de sistemas Linux para xFusionCorp Industries",
          path: "/challenges/linux",
          color: "from-orange-500 to-red-600",
          total: counts.linux,
          completed: counts.linux,
          percentage: 100,
        },
        docker: {
          name: "Docker",
          icon: "🐳",
          description: "Desafíos de contenerización y Docker",
          path: "/challenges/docker",
          color: "from-blue-500 to-cyan-600",
          total: counts.docker,
          completed: counts.docker,
          percentage: 100,
        },
        devops: {
          name: "DevOps",
          icon: "⚙️",
          description: "100 Días de DevOps - Retos de automatización",
          path: "/challenges/devops",
          color: "from-purple-500 to-pink-600",
          total: counts.devops,
          completed: counts.devops,
          percentage: 100,
        },
        htb: {
          name: "HTB",
          icon: "🎯",
          description: "Hack The Box - Cybersecurity challenges",
          path: "/challenges/htb",
          color: "from-green-500 to-emerald-600",
          total: counts.htb,
          completed: 0, // HTB challenges are not fully completed yet
          percentage: 0,
        },
      },
      recentActivity: [
        { program: "devops", activity: "DevOps Days 08-15 added", icon: "⚙️" },
        { program: "ctf", activity: "CTF categories expanded", icon: "🚩" },
        {
          program: "linux",
          activity: "Linux Challenge 19 completed",
          icon: "🐧",
        },
        { program: "docker", activity: "Docker Reto 5 completed", icon: "🐳" },
        { program: "devops", activity: "DevOps Day 07 completed", icon: "⚙️" },
        { program: "ctf", activity: "CTF Reto 03 completed", icon: "🚩" },
      ],
    };

    await fs.promises.mkdir("src/data", { recursive: true });
    await fs.promises.writeFile(
      "src/data/challenges.json",
      JSON.stringify(data, null, 2),
    );

    console.log("✅ Challenges data generated successfully!");
    console.log(
      `📊 Total: ${data.overview.completed}/${data.overview.totalChallenges} (${data.overview.completionRate}%)`,
    );
    console.log(`🐧 Linux: ${counts.linux}`);
    console.log(`🐳 Docker: ${counts.docker}`);
    console.log(`⚙️ DevOps: ${counts.devops}`);
    console.log(
      `🚩 CTF: ${counts.ctf} (includes ${counts.ctf - 7} new challenges)`,
    );
    console.log(`🎯 HTB: ${counts.htb}`);

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
