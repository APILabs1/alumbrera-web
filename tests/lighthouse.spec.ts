import { test } from "@playwright/test";
import { playAudit } from "playwright-lighthouse";

const LIGHTHOUSE_PORT = 9222;

test.describe("Lighthouse audit", () => {
  test("performance and accessibility scores are above 80", async ({ page }) => {
    await page.goto("/");

    await playAudit({
      page,
      port: LIGHTHOUSE_PORT,
      thresholds: {
        performance: 80,
        accessibility: 80,
        "best-practices": 80,
      },
      reports: {
        formats: { html: false },
      },
    });
  });
});
