import { test, expect } from "@playwright/test";

test.describe("Landing Page - E2E Tests", () => {
  test("page loads successfully", async ({ page }) => {
    const response = await page.goto("./");
    expect(response?.status()).toBe(200);
  });

  test("displays page title", async ({ page }) => {
    await page.goto("./");
    const title = await page.title();
    expect(title).toContain("DevOps Challenges");
  });

  test("has main heading", async ({ page }) => {
    await page.goto("./");
    const heading = page.getByRole("heading", {
      name: /Technical Challenges Progress/i,
    });
    await expect(heading).toBeVisible();
  });

  test("displays metrics container", async ({ page }) => {
    await page.goto("./");
    const container = page.locator('[data-testid="metrics-container"]');
    await expect(container).toBeVisible({ timeout: 10000 });
  });

  test("has counters with data-target", async ({ page }) => {
    await page.goto("./");
    await page.waitForTimeout(2000); // Give time for rendering

    const counters = page.locator("[data-target]");
    const count = await counters.count();

    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("displays three program cards", async ({ page }) => {
    await page.goto("./");
    await page.waitForTimeout(2000);

    const linux = page.locator('[data-testid="program-linux"]');
    const docker = page.locator('[data-testid="program-docker"]');
    const devops = page.locator('[data-testid="program-devops"]');

    await expect(linux).toBeVisible({ timeout: 5000 });
    await expect(docker).toBeVisible({ timeout: 5000 });
    await expect(devops).toBeVisible({ timeout: 5000 });
  });

  test("has valid metrics on total counter", async ({ page }) => {
    await page.goto("./");
    await page.waitForTimeout(2000);

    const counter = page.locator('[data-testid="total-challenges"]');
    const dataTarget = await counter.getAttribute("data-target");

    expect(dataTarget).toBeTruthy();
    const value = parseInt(dataTarget || "0");
    expect(value).toBeGreaterThan(0);
  });

  test("has valid metrics on completed counter", async ({ page }) => {
    await page.goto("./");
    await page.waitForTimeout(2000);

    const counter = page.locator('[data-testid="completed-challenges"]');
    const dataTarget = await counter.getAttribute("data-target");

    expect(dataTarget).toBeTruthy();
    const value = parseInt(dataTarget || "0");
    expect(value).toBeGreaterThanOrEqual(0);
  });

  test("completion rate is between 0 and 100", async ({ page }) => {
    await page.goto("./");
    await page.waitForTimeout(2000);

    const counter = page.locator('[data-testid="completion-rate"]');
    const dataTarget = await counter.getAttribute("data-target");

    expect(dataTarget).toBeTruthy();
    const value = parseInt(dataTarget || "0");
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(100);
  });

  test("completed does not exceed total", async ({ page }) => {
    await page.goto("./");
    await page.waitForTimeout(2000);

    const totalEl = page.locator('[data-testid="total-challenges"]');
    const completedEl = page.locator('[data-testid="completed-challenges"]');

    const total = parseInt((await totalEl.getAttribute("data-target")) || "0");
    const completed = parseInt(
      (await completedEl.getAttribute("data-target")) || "0",
    );

    expect(completed).toBeLessThanOrEqual(total);
  });

  test("displays last updated timestamp", async ({ page }) => {
    await page.goto("./");
    const content = await page.textContent("body");
    expect(content).toContain("Last updated");
  });

  test("responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("./");

    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("responsive on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("./");

    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("responsive on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("./");

    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("has stylesheets loaded", async ({ page }) => {
    await page.goto("./");

    const hasStyles = await page.evaluate(() => {
      return document.styleSheets.length > 0;
    });

    expect(hasStyles).toBe(true);
  });

  test("no critical JavaScript errors", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("./");
    await page.waitForLoadState("networkidle");

    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("404") &&
        !e.includes("favicon") &&
        !e.includes("Failed to load"),
    );

    expect(criticalErrors.length).toBe(0);
  });

  test("proper HTML structure", async ({ page }) => {
    await page.goto("./");

    const lang = await page.getAttribute("html", "lang");
    expect(lang).toBeTruthy();

    const headers = page.locator("h1, h2, h3");
    const count = await headers.count();
    expect(count).toBeGreaterThan(0);
  });

  test("page loads within reasonable time", async ({ page }) => {
    const start = Date.now();
    await page.goto("./");
    await page.waitForLoadState("networkidle");
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(10000);
  });

  test("metrics persist after reload", async ({ page }) => {
    await page.goto("./");
    await page.waitForTimeout(2000);

    const before = await page
      .locator('[data-testid="total-challenges"]')
      .getAttribute("data-target");

    await page.reload();
    await page.waitForTimeout(2000);

    const after = await page
      .locator('[data-testid="total-challenges"]')
      .getAttribute("data-target");

    expect(before).toBe(after);
  });

  test("Linux program card displays", async ({ page }) => {
    await page.goto("./");
    await page.waitForTimeout(2000);

    const card = page.locator('[data-testid="program-linux"]');
    const text = await card.textContent();
    expect(text).toContain("Linux");
  });

  test("Docker program card displays", async ({ page }) => {
    await page.goto("./");
    await page.waitForTimeout(2000);

    const card = page.locator('[data-testid="program-docker"]');
    const text = await card.textContent();
    expect(text).toContain("Docker");
  });

  test("DevOps program card displays", async ({ page }) => {
    await page.goto("./");
    await page.waitForTimeout(2000);

    const card = page.locator('[data-testid="program-devops"]');
    const text = await card.textContent();
    expect(text).toContain("DevOps");
  });
});
