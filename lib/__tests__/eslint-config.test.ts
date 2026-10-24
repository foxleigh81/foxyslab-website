// @vitest-environment node
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

describe("lint file selection after browser verification", () => {
  const eslint = new ESLint();

  it.each([
    "playwright-report/trace/assets/uiMode.js",
    "test-results/trace/resources/script.js",
    "blob-report/assets/report.js",
    "playwright/.cache/assets/script.js",
    ".lighthouseci/videos/browser-artifacts/script.js",
  ])("ignores generated browser output at %s", async (file) => {
    expect(await eslint.isPathIgnored(file)).toBe(true);
  });

  it.each([
    "app/videos/page.tsx",
    "scripts/verify-videos.mjs",
    "e2e/videos-gallery.spec.ts",
    "lib/__tests__/eslint-config.test.ts",
  ])("continues linting maintained source at %s", async (file) => {
    expect(await eslint.isPathIgnored(file)).toBe(false);
  });
});
