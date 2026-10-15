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
