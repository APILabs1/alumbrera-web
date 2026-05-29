import { test, expect } from "@playwright/test";

test.describe("Authentication flow", () => {
  test("sign-in button redirects to ciamlogin.com", async ({ page }) => {
    test.skip(
      !process.env.NEXT_PUBLIC_AZURE_CLIENT_ID,
      "Skipped: NEXT_PUBLIC_AZURE_CLIENT_ID not set"
    );

    await page.goto("/");

    const signInButton = page.getByRole("button", { name: /Iniciar sesión/i });
    await expect(signInButton).toBeVisible();

    await Promise.all([
      page.waitForURL(/ciamlogin\.com/, { timeout: 15000 }),
      signInButton.click(),
    ]);

    expect(page.url()).toMatch(/ciamlogin\.com/);
  });
});
