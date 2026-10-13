import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

if (!process.env.VIDEOS_BASE_URL || !process.env.VIDEOS_REPORT_DIR) {
  throw new Error(
    "Run npm run verify:videos to supply the production server and report directory"
  );
}

export default defineConfig({
  testDir: "./e2e",
  testMatch: "videos-gallery.spec.ts",
  workers: 1,
  retries: 0,
  reporter: [
    [
      "json",
      {
        outputFile: path.join(
          process.env.VIDEOS_REPORT_DIR,
          "browser-smoke.json"
        ),
      },
    ],
  ],
  outputDir: path.join(process.env.VIDEOS_REPORT_DIR, "browser-artifacts"),
  use: {
    baseURL: process.env.VIDEOS_BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "Desktop Chrome", use: { ...devices["Desktop Chrome"] } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 7"] } },
  ],
});
