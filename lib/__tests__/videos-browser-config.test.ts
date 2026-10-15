// @vitest-environment node
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function listGalleryTests(config: string) {
  const result = spawnSync(
    process.execPath,
    [
      "node_modules/@playwright/test/cli.js",
      "test",
      "e2e/videos-gallery.spec.ts",
      "--config",
      config,
      "--list",
      "--reporter=line",
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        YOUTUBE_API_KEY: "",
        VIDEOS_BASE_URL: "http://127.0.0.1:4173",
        VIDEOS_REPORT_DIR: ".lighthouseci/videos/config-test",
      },
      timeout: 15_000,
    }
  );
  expect(result.status, result.stderr).toBe(0);
  return result.stdout;
}

describe("gallery browser test selection", () => {
  it("keeps credential-free smoke tests in the regular E2E run", () => {
    const tests = listGalleryTests("playwright.config.ts");
    expect(tests).toContain("page loads with heading");
    expect(tests).toContain("handles empty state gracefully");
    expect(tests).not.toContain("footer stable through hydration");
    expect(tests).toContain("[Desktop Chrome]");
    expect(tests).toContain("[iPhone 14]");
  });

  it("always runs the populated-gallery regression on production desktop and mobile", () => {
    const tests = listGalleryTests("playwright.videos-production.config.ts");
    expect(tests.match(/footer stable through hydration/g)).toHaveLength(2);
    expect(tests).toContain("[Desktop Chrome]");
    expect(tests).toContain("[Mobile Chrome]");
  });
});

it("does not record credential-bearing browser traces or screenshots", async () => {
  process.env.VIDEOS_BASE_URL = "http://127.0.0.1:4173";
  process.env.VIDEOS_REPORT_DIR = ".lighthouseci/videos/config-test";
  const { default: config } =
    await import("../../playwright.videos-production.config");
  expect(config.use?.trace).toBe("off");
  expect(config.use?.screenshot).toBe("off");
});
