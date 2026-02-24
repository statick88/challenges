function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const yaml = match[1];
  const frontMatter = {};
  yaml.split("\n").forEach((line) => {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) {
      let value = m[2].trim().replace(/^["']|["']$/g, "");
      if (value.startsWith("[")) {
        frontMatter[m[1]] = value.replace(/[\[\]]/g, "").split(",").map((v) => v.trim().replace(/['"]/g, ""));
      } else {
        frontMatter[m[1]] = value;
      }
    }
  });
  return frontMatter;
}
function parseSteps(content) {
  const steps = [];
  const mainContent = content.replace(/^---[\s\S]*?---/, "");
  const stepMatches = mainContent.match(
    /(?:### \d+\.|###\s+)([^\n]+)\n([\s\S]*?)(?=(?:### \d+\.|###\s+)|## |$)/g
  );
  if (stepMatches) {
    stepMatches.forEach((step) => {
      const titleMatch = step.match(/(?:### \d+\.|###\s+)([^\n]+)/);
      const title = titleMatch ? titleMatch[1].trim() : "Paso";
      const cmdBlock = step.match(/```bash\n([\s\S]*?)```/);
      const cmds = cmdBlock ? cmdBlock[1].split("\n").filter((c) => c.trim() && !c.trim().startsWith("#")).map((c) => c.trim()) : [];
      steps.push({ title, commands: cmds });
    });
  }
  return steps;
}

export { parseSteps as a, parseFrontMatter as p };
