import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("renders title and sign-in button", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Alumbrera/);
    await expect(page.getByText("Alumbrera", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Iniciar sesión/i })).toBeVisible();
  });

  test("manifest is accessible and valid", async ({ page }) => {
    const response = await page.request.get("/manifest.webmanifest");
    expect(response.status()).toBe(200);

    const manifest = await response.json();
    expect(manifest.name).toBe("Portal de gestión - Alumbrera");
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons).toHaveLength(4);
  });

  test("service worker file is served", async ({ page }) => {
    const response = await page.request.get("/sw.js");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("javascript");
  });
});
