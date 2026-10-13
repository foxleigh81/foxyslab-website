import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyVideos } from "../../scripts/lib/verify-videos.mjs";

const roots: string[] = [];
afterEach(() =>
  roots
    .splice(0)
    .forEach((root) => rmSync(root, { recursive: true, force: true }))
);

const credentials = {
  NODE_ENV: "test" as const,
  YOUTUBE_API_KEY: "test-key",
  FOURTHWALL_STOREFRONT_TOKEN: "test-token",
  FLAGS_SECRET: "test-secret",
};

function harness(failBuild = false) {
  const outputRoot = mkdtempSync(
    path.join(process.cwd(), ".verify-videos-test-")
  );
  roots.push(outputRoot);
  const events: string[] = [];
  const stop = vi.fn(async () => {
    events.push("stop");
  });
  const serve = vi.fn(async () => {
    events.push("serve");
    return { url: "http://127.0.0.1:4173", stop };
  });
  const run = vi.fn(async (label: string, _command: string, args: string[]) => {
    events.push(label);
    if (failBuild) throw new Error("Build failed");
    if (label.startsWith("Lighthouse")) {
      expect(args).toContain("http://127.0.0.1:4173/videos");
      expect(args).toContain("--form-factor=mobile");
      expect(args).toContain("--throttling-method=simulate");
      const prefix = args
        .find((arg) => arg.startsWith("--output-path="))!
        .split("=")[1];
      writeFileSync(
        `${prefix}.report.json`,
        JSON.stringify({
          configSettings: { formFactor: "mobile" },
          audits: {
            "cumulative-layout-shift": { numericValue: 0.05 },
            "largest-contentful-paint": { numericValue: 4200 },
          },
        })
      );
      writeFileSync(`${prefix}.report.html`, "test report");
    }
  });
  return { outputRoot, events, run, serve, stop };
}

describe("production videos verification command", () => {
  it("fails before building when credentials are missing, naming only missing variables", () => {
    const result = spawnSync("npm", ["run", "verify:videos"], {
      cwd: process.cwd(),
      encoding: "utf8",
      env: {
        ...process.env,
        YOUTUBE_API_KEY: "",
        FOURTHWALL_STOREFRONT_TOKEN: "",
        FLAGS_SECRET: "private-test-value",
      },
    });
    const output = result.stdout + result.stderr;
    expect(result.status).toBe(1);
    expect(output).toContain(
      "Missing required credentials: YOUTUBE_API_KEY, FOURTHWALL_STOREFRONT_TOKEN"
    );
    expect(output).not.toContain("private-test-value");
    expect(output).not.toContain("next build");
  });

  it("builds before serving, smoke checks, and retains three mobile reports and metrics", async () => {
    const h = harness();
    const directory = await verifyVideos({ ...h, env: credentials });
    expect(h.events).toEqual([
      "Build",
      "serve",
      "Browser smoke",
      "Lighthouse 1",
      "Lighthouse 2",
      "Lighthouse 3",
      "stop",
    ]);
    expect(h.run.mock.calls[0].slice(1, 3)).toEqual(["npm", ["run", "build"]]);
    expect(h.run.mock.calls[1][2]).toContain(
      "--config=playwright.videos-production.config.ts"
    );
    expect(
      readdirSync(directory).filter((name) => name.endsWith(".report.json"))
    ).toHaveLength(3);
    expect(
      readdirSync(directory).filter((name) => name.endsWith(".report.html"))
    ).toHaveLength(3);
    const summary = JSON.parse(
      readFileSync(path.join(directory, "summary.json"), "utf8")
    );
    expect(summary.runs).toEqual([
      { run: 1, cls: 0.05, lcpMs: 4200 },
      { run: 2, cls: 0.05, lcpMs: 4200 },
      { run: 3, cls: 0.05, lcpMs: 4200 },
    ]);
  });

  it("never starts a server or measures a failed build", async () => {
    const h = harness(true);
    await expect(verifyVideos({ ...h, env: credentials })).rejects.toThrow(
      "Build failed"
    );
    expect(h.events).toEqual(["Build"]);
  });

  it("closes its server when the browser smoke check fails", async () => {
    const h = harness();
    h.run
      .mockImplementationOnce(async () => {})
      .mockImplementationOnce(async () => {
        throw new Error("Browser smoke failed");
      });
    await expect(verifyVideos({ ...h, env: credentials })).rejects.toThrow(
      "Browser smoke failed"
    );
    expect(h.stop).toHaveBeenCalledOnce();
  });

  it("rejects credential bypasses even with credentials present", async () => {
    const h = harness();
    await expect(
      verifyVideos({
        ...h,
        env: { ...credentials, ALLOW_MISSING_API_KEYS: "true" },
      })
    ).rejects.toThrow("ALLOW_MISSING_API_KEYS");
    expect(h.run).not.toHaveBeenCalled();
  });
});
