import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import glob from "fast-glob";
import { parse } from "yaml";
import { expect, it } from "vitest";

it.each([
  ["e2e", "npm run test:e2e"],
  ["quality", "npm run test:coverage"],
])("runs %s checks without retaining raw reports", (job, command) => {
  const workflow = parse(readFileSync(".github/workflows/ci.yml", "utf8"));
  const steps = workflow.jobs[job].steps as { run?: string; uses?: string }[];

  expect(steps.some((step) => step.run === command)).toBe(true);
  expect(
    steps.filter((step) => step.uses?.startsWith("actions/upload-artifact@"))
  ).toEqual([]);
});

it("retains only the ordinary CI numeric Lighthouse summary from the hidden directory", () => {
  const workflow = parse(readFileSync(".github/workflows/ci.yml", "utf8"));
  const uploads = workflow.jobs["build-and-lighthouse"].steps.filter(
    (step: { uses?: string }) =>
      step.uses?.startsWith("actions/upload-artifact@")
  );
  expect(uploads).toHaveLength(1);
  const upload = uploads[0];
  expect(upload.with["include-hidden-files"]).toBe(true);
  expect(upload.with.path).toBe(".lighthouseci/ci/summary.json");
  expect(upload.with["if-no-files-found"]).toBe("warn");

  const root = mkdtempSync(path.join(process.cwd(), ".ci-lighthouse-test-"));
  try {
    const files = {
      ".lighthouseci/ci/summary.json": '{"runs":[{"cls":0.03,"lcpMs":2100}]}',
      ".lighthouseci/lhr-1.json": "credential-bearing-report",
      ".lighthouseci/lhr-1.html": "credential-bearing-report",
      ".lighthouseci/manifest.json": "credential-bearing-manifest",
    };
    for (const [file, content] of Object.entries(files)) {
      const target = path.join(root, file);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, content);
    }
    expect(glob.sync(upload.with.path, { cwd: root, dot: true })).toEqual([
      ".lighthouseci/ci/summary.json",
    ]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

it("runs ordinary Lighthouse without publishing raw reports", () => {
  const scripts = JSON.parse(readFileSync("package.json", "utf8")).scripts;
  const config = readFileSync("lighthouserc.js", "utf8");
  expect(scripts["test:lighthouse"]).toBe("lhci collect && lhci assert");
  expect(config).not.toContain("temporary-public-storage");
});

it.each([true, false])(
  "uploads only numeric summaries, including on failure (summary exists: %s)",
  (hasSummary) => {
    const root = mkdtempSync(path.join(process.cwd(), ".verify-videos-test-"));
    try {
      const run = ".lighthouseci/videos/run-example";
      const files = [
        "browser-smoke.json",
        "browser-artifacts/trace.zip",
        "browser-artifacts/screenshot.png",
        "browser-artifacts/.last-run.json",
        "mobile-1.report.json",
        "mobile-1.report.html",
      ];
      for (const file of files) {
        const target = path.join(root, run, file);
        mkdirSync(path.dirname(target), { recursive: true });
        writeFileSync(target, "credential-bearing-content");
      }
      if (hasSummary)
        writeFileSync(
          path.join(root, run, "summary.json"),
          JSON.stringify({
            url: "http://127.0.0.1:4173/videos",
            runs: [{ run: 1, cls: 0, lcpMs: 4500 }],
          })
        );
      const workflow = parse(
        readFileSync(".github/workflows/videos-verification.yml", "utf8")
      );
      const uploads = workflow.jobs.videos.steps.filter(
        (step: { uses?: string }) =>
          step.uses?.startsWith("actions/upload-artifact@")
      );
      expect(uploads).toHaveLength(1);
      const selected = uploads.flatMap((step: { with: { path: string } }) => {
        const patterns = step.with.path
          .trim()
          .split(/\n/)
          .map((pattern) => {
            const target = path.join(root, pattern);
            return statSync(target, { throwIfNoEntry: false })?.isDirectory()
              ? `${pattern}/**/*`
              : pattern;
          });
        return glob.sync(patterns, { cwd: root, dot: true });
      });
      expect(selected).toEqual(hasSummary ? [`${run}/summary.json`] : []);
      for (const file of selected)
        expect(readFileSync(path.join(root, file), "utf8")).not.toContain(
          "credential-bearing-content"
        );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
);
