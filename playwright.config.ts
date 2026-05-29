import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: /lighthouse/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "lighthouse",
      testMatch: /lighthouse/,
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ["--remote-debugging-port=9222"],
        },
      },
    },
  ],
  webServer: {
    command:
      "cp -rf public .next/standalone/public && " +
      "cp -rf .next/static .next/standalone/.next/static && " +
      "node .next/standalone/server.js",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
    env: {
      PORT: "3000",
      HOSTNAME: "0.0.0.0",
    },
  },
});
