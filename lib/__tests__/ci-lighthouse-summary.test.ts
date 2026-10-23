import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";

it("writes only numeric measurements from ordinary Lighthouse reports", () => {
  const root = mkdtempSync(path.join(process.cwd(), ".ci-summary-test-"));
  try {
    const reports = path.join(root, ".lighthouseci");
    mkdirSync(reports);
    writeFileSync(
      path.join(reports, "lhr-1.json"),
      JSON.stringify({
        finalUrl: "https://example.test/?token=credential-bearing-content",
        audits: {
          "cumulative-layout-shift": { numericValue: 0.03 },
          "largest-contentful-paint": { numericValue: 2100 },
        },
      })
    );
    execFileSync("node", ["scripts/ci-lighthouse-summary.mjs", reports]);
    const summary = readFileSync(path.join(reports, "ci/summary.json"), "utf8");
    expect(JSON.parse(summary)).toEqual({ runs: [{ cls: 0.03, lcpMs: 2100 }] });
    expect(summary).not.toContain("credential-bearing-content");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

it("fails when ordinary Lighthouse produced no measurements", () => {
  const root = mkdtempSync(path.join(process.cwd(), ".ci-summary-test-"));
  try {
    const result = spawnSync("node", ["scripts/ci-lighthouse-summary.mjs", root], {
      encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("No Lighthouse measurements produced");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

it("does not echo malformed report content in CI diagnostics", () => {
  const root = mkdtempSync(path.join(process.cwd(), ".ci-summary-test-"));
  try {
    writeFileSync(path.join(root, "lhr-1.json"), '{"secret":"credential-bearing-content"');
    const result = spawnSync("node", ["scripts/ci-lighthouse-summary.mjs", root], {
      encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Lighthouse report is invalid JSON");
    expect(result.stderr).not.toContain("credential-bearing-content");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
