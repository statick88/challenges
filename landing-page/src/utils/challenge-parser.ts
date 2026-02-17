// src/utils/challenge-parser.ts
import fs from "fs";

export function parseFrontMatter(content: string): Record<string, any> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const frontMatter: Record<string, any> = {};

  yaml.split("\n").forEach((line) => {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) {
      let value = m[2].trim().replace(/^["']|["']$/g, "");
      if (value.startsWith("[")) {
        frontMatter[m[1]] = value
          .replace(/[\[\]]/g, "")
          .split(",")
          .map((v: string) => v.trim().replace(/['"]/g, ""));
      } else {
        frontMatter[m[1]] = value;
      }
    }
  });

  return frontMatter;
}

export function parseSteps(
  content: string,
): { title: string; commands?: string[]; explanation?: string }[] {
  const steps: { title: string; commands?: string[]; explanation?: string }[] =
    [];
  const mainContent = content.replace(/^---[\s\S]*?---/, "");

  // Match step sections
  const stepMatches = mainContent.match(
    /(?:### \d+\.|###\s+)([^\n]+)\n([\s\S]*?)(?=(?:### \d+\.|###\s+)|## |$)/g,
  );

  if (stepMatches) {
    stepMatches.forEach((step: string) => {
      const titleMatch = step.match(/(?:### \d+\.|###\s+)([^\n]+)/);
      const title = titleMatch ? titleMatch[1].trim() : "Paso";

      const cmdBlock = step.match(/```bash\n([\s\S]*?)```/);
      const cmds = cmdBlock
        ? cmdBlock[1]
            .split("\n")
            .filter((c: string) => c.trim() && !c.trim().startsWith("#"))
            .map((c: string) => c.trim())
        : [];

      steps.push({ title, commands: cmds });
    });
  }

  return steps;
}
