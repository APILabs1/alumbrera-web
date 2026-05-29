import { test } from "@playwright/test";
import { playAudit } from "playwright-lighthouse";

const LIGHTHOUSE_PORT = 9222;

test.describe("PWA — Lighthouse audit", () => {
  test("PWA score is above 90", async ({ page }) => {
    await page.goto("/");

    await playAudit({
      page,
      port: LIGHTHOUSE_PORT,
      thresholds: {
        pwa: 90,
      },
      reports: {
        formats: { html: false },
      },
    });
  });
});
