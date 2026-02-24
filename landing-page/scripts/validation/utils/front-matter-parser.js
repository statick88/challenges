import fs from "fs";

export function parseFrontMatter(filePath) {
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

export function normalizeStatus(status) {
  if (!status) return "ready";
  const s = status.toLowerCase();
  if (["completed", "completado", "done"].includes(s)) return "completed";
  if (["in-progress", "in_progress", "in progress"].includes(s))
    return "in_progress";
  if (["blocked"].includes(s)) return "blocked";
  if (["ready", "pending"].includes(s)) return "ready";
  return "ready";
}

export function normalizeDifficulty(difficulty) {
  if (!difficulty) return "medium";
  const d = difficulty.toString().toLowerCase();
  if (["1", "easy", "facil"].includes(d)) return "easy";
  if (["2", "medium", "medio"].includes(d)) return "medium";
  if (["3", "hard", "dificil"].includes(d)) return "hard";
  return "medium";
}
