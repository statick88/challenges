import { describe, it, expect } from "vitest";
import { parseFrontMatter, parseSteps } from "../utils/challenge-parser";

describe("challenge-parser", () => {
  describe("parseFrontMatter", () => {
    it("should parse basic front matter", () => {
      const content = `---
title: Test Challenge
category: linux
difficulty: medium
---

# Content
`;

      const result = parseFrontMatter(content);
      expect(result).toEqual({
        title: "Test Challenge",
        category: "linux",
        difficulty: "medium",
      });
    });

    it("should handle missing front matter", () => {
      const content = "# Just content";
      const result = parseFrontMatter(content);
      expect(result).toEqual({});
    });
  });

  describe("parseSteps", () => {
    it("should parse steps from content", () => {
      const content = `---
title: Test
---

## 🛠️ Solución

### Paso 1: Do something
\`\`\`bash
echo "test"
\`\`\`

### Paso 2: Do more
Another step
`;

      const steps = parseSteps(content);
      expect(steps).toHaveLength(2);
      expect(steps[0].title).toBe("Paso 1: Do something");
      expect(steps[0].commands).toContain('echo "test"');
    });
  });
});
