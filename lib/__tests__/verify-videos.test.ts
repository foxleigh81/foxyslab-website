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

  it("builds before serving, smoke checks, and retains only three mobile measurements", async () => {
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
    expect(readdirSync(directory)).toEqual(["summary.json"]);
    const summary = JSON.parse(
      readFileSync(path.join(directory, "summary.json"), "utf8")
    );
    expect(summary).toEqual({
      url: "http://127.0.0.1:4173/videos",
      runs: [
        { run: 1, cls: 0.05, lcpMs: 4200 },
        { run: 2, cls: 0.05, lcpMs: 4200 },
        { run: 3, cls: 0.05, lcpMs: 4200 },
      ],
    });
  });

  it("retains only minimized measurements when successful reports contain synthetic credentials", async () => {
    const h = harness();
    const originalRun = h.run.getMockImplementation()!;
    const markers = [
      credentials.YOUTUBE_API_KEY,
      credentials.FOURTHWALL_STOREFRONT_TOKEN,
      credentials.FLAGS_SECRET,
    ];
    h.run.mockImplementation(async (label, command, args) => {
      await originalRun(label, command, args);
      const directory = path.join(h.outputRoot, readdirSync(h.outputRoot)[0]);
      if (label === "Browser smoke") {
        writeFileSync(
          path.join(directory, "browser-smoke.json"),
          JSON.stringify({ errors: markers })
        );
      }
      if (!label.startsWith("Lighthouse")) return;
      const prefix = args
        .find((arg) => arg.startsWith("--output-path="))!
        .slice("--output-path=".length);
      const report = JSON.parse(readFileSync(`${prefix}.report.json`, "utf8"));
      report.requestHeaders = { authorization: markers.join(" ") };
      writeFileSync(`${prefix}.report.json`, JSON.stringify(report));
      writeFileSync(`${prefix}.report.html`, markers.join(" "));
    });
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      const directory = await verifyVideos({ ...h, env: credentials });
      expect(readdirSync(directory)).toEqual(["summary.json"]);
      const retained =
        readFileSync(path.join(directory, "summary.json"), "utf8") +
        JSON.stringify(log.mock.calls);
      for (const marker of markers) expect(retained).not.toContain(marker);
      expect(
        JSON.parse(readFileSync(path.join(directory, "summary.json"), "utf8"))
          .runs
      ).toHaveLength(3);
    } finally {
      log.mockRestore();
    }
  });

  it("omits synthetic credentials from malformed measurement diagnostics and retained files", async () => {
    const h = harness();
    const marker = "synthetic48";
    h.run.mockImplementation(async (label, _command, args) => {
      if (!label.startsWith("Lighthouse")) return;
      const prefix = args
        .find((arg) => arg.startsWith("--output-path="))!
        .slice("--output-path=".length);
      writeFileSync(`${prefix}.report.json`, marker);
      writeFileSync(`${prefix}.report.html`, marker);
    });
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      const error = await verifyVideos({
        ...h,
        env: { ...credentials, YOUTUBE_API_KEY: marker },
      }).catch((error: Error) => error);
      expect(error).toBeInstanceOf(Error);
      const retainedOutput = JSON.stringify(log.mock.calls) + String(error);
      expect(retainedOutput).not.toContain(marker);
      expect(String(error)).toContain(
        "Lighthouse 1 report missing or unreadable"
      );
      const directory = path.join(h.outputRoot, readdirSync(h.outputRoot)[0]);
      expect(readdirSync(directory)).toEqual([]);
      expect(h.stop).toHaveBeenCalledOnce();
    } finally {
      log.mockRestore();
    }
  });

  it("never starts a server or measures a failed build", async () => {
    const h = harness(true);
    await expect(verifyVideos({ ...h, env: credentials })).rejects.toThrow(
      "Build failed"
    );
    expect(h.events).toEqual(["Build"]);
  });

  it("launches every Lighthouse browser without requiring a host sandbox, like the smoke browser", async () => {
    const h = harness();
    await verifyVideos({ ...h, env: credentials });
    const measurements = h.run.mock.calls.filter(([label]) =>
      label.startsWith("Lighthouse")
    );
    expect(measurements).toHaveLength(3);
    for (const [, , args] of measurements) {
      const flags = args
        .find((arg) => arg.startsWith("--chrome-flags="))!
        .slice("--chrome-flags=".length)
        .split(/\s+/);
      expect(flags).toContain("--headless");
      expect(flags).toContain("--no-sandbox");
    }
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

  it.each([
    "videos navigation failed",
    "no rendered video cards",
    "no populated playlist matches VIDEOS_PLAYLIST_SLUG",
    "unknown future failure",
  ])("does not infer data state from raw error text: %s", async (message) => {
    const h = harness();
    h.run.mockImplementation(async (label) => {
      if (label !== "Browser smoke") return;
      const directory = path.join(h.outputRoot, readdirSync(h.outputRoot)[0]);
      writeFileSync(
        path.join(directory, "browser-smoke.json"),
        JSON.stringify({
          suites: [
            {
              suites: [
                {
                  specs: [
                    {
                      title: "private-test-value",
                      file: "private-test-value",
                      line: 57,
                      tests: [
                        {
                          results: [
                            {
                              status: "failed",
                              errors: [
                                {
                                  message: `Gallery fixture/data unavailable: ${message}. private-test-value`,
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        })
      );
      throw new Error(
        "Browser smoke failed (exit 1); child output suppressed to protect credentials"
      );
    });
    const error = await verifyVideos({ ...h, env: credentials }).catch(
      (error: Error) => error
    );
    if (!(error instanceof Error)) throw new Error("Expected browser failure");
    expect(error.message).toContain("line 57: failed; unclassified");
    expect(error.message).not.toContain("retained reports");
    const directory = path.join(h.outputRoot, readdirSync(h.outputRoot)[0]);
    expect(readdirSync(directory)).toEqual(["summary.json"]);
    expect(error.message).not.toContain("private-test-value");
    expect(h.stop).toHaveBeenCalledOnce();
  });

  it.each([
    [undefined, "Browser report missing or unreadable"],
    ["not json", "Browser report missing or unreadable"],
    [
      JSON.stringify({ errors: [{ message: "private-test-value" }] }),
      "No failed test results",
    ],
  ])(
    "handles unavailable test results safely (%s)",
    async (report, diagnostic) => {
      const h = harness();
      h.run.mockImplementation(async (label) => {
        if (label !== "Browser smoke") return;
        if (report !== undefined) {
          const directory = path.join(
            h.outputRoot,
            readdirSync(h.outputRoot)[0]
          );
          writeFileSync(path.join(directory, "browser-smoke.json"), report);
        }
        throw new Error("private-test-value");
      });
      const result = verifyVideos({ ...h, env: credentials });
      await expect(result).rejects.toThrow(diagnostic);
      await expect(result).rejects.not.toThrow("private-test-value");
      expect(h.stop).toHaveBeenCalledOnce();
    }
  );

  it.each([
    ["fetch-failed", 0, 0, "data-fetch-failure"],
    ["empty", 0, 0, "empty-response"],
    ["populated", 0, 0, "application-render-failure"],
    ["populated", 12, 0, "stale-browser-assertion"],
    ["synthetic49-private", 0, 0, "unclassified"],
  ])(
    "retains bounded gallery diagnostics for %s/%s/%s",
    async (state, cards, headings, classification) => {
      const h = harness();
      const marker = "synthetic49-private";
      h.run.mockImplementation(async (label) => {
        if (label !== "Browser smoke") return;
        const directory = path.join(h.outputRoot, readdirSync(h.outputRoot)[0]);
        writeFileSync(
          path.join(directory, "browser-smoke.json"),
          JSON.stringify({
            suites: [
              {
                specs: [
                  {
                    line: 21,
                    tests: [
                      {
                        annotations: [
                          {
                            type: "videos-state",
                            description: JSON.stringify({
                              state,
                              cards,
                              headings,
                              body: marker,
                              url: `https://example.invalid/?key=${marker}`,
                            }),
                          },
                        ],
                        results: [
                          {
                            status: "failed",
                            errors: [{ message: marker }],
                            attachments: [{ body: marker }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          })
        );
        throw new Error(marker);
      });
      const log = vi.spyOn(console, "log").mockImplementation(() => {});
      try {
        const error = await verifyVideos({ ...h, env: credentials }).catch(
          (error: Error) => error
        );
        expect(String(error)).toContain(classification);
        const directory = path.join(h.outputRoot, readdirSync(h.outputRoot)[0]);
        expect(readdirSync(directory)).toEqual(["summary.json"]);
        const retained = readFileSync(
          path.join(directory, "summary.json"),
          "utf8"
        );
        expect(JSON.parse(retained).browserFailure).toContain(classification);
        expect(
          retained + String(error) + JSON.stringify(log.mock.calls)
        ).not.toContain(marker);
        expect(retained).not.toContain("https:");
      } finally {
        log.mockRestore();
      }
    }
  );

  it.each([
    [
      { state: "populated", cards: 12, documentCards: 12 },
      "browser-render-mismatch",
    ],
    [
      { state: "populated", cards: 0, documentCards: 12 },
      "streamed-cards-outside-main",
    ],
    [
      { state: "fetch-failed", cards: 0, documentCards: 0 },
      "data-fetch-failure",
    ],
    [{ serverError: true, cards: 0, documentCards: 0 }, "server-render-error"],
  ])(
    "distinguishes initial response from browser state safely: %s",
    async (initial, classification) => {
      const h = harness();
      const marker = "synthetic50-private";
      h.run.mockImplementation(async (label) => {
        if (label !== "Browser smoke") return;
        const directory = path.join(h.outputRoot, readdirSync(h.outputRoot)[0]);
        writeFileSync(
          path.join(directory, "browser-smoke.json"),
          JSON.stringify({
            suites: [
              {
                specs: [
                  {
                    line: 22,
                    tests: [
                      {
                        annotations: [
                          {
                            type: "videos-state",
                            description: JSON.stringify({
                              state: "populated",
                              cards: 0,
                              headings: 0,
                              documentCards: 12,
                              documentHeadings: marker,
                              httpStatus: 200,
                              initial: {
                                ...initial,
                                body: marker,
                                url: marker,
                              },
                              assertion: "initial-cards",
                              error: marker,
                            }),
                          },
                        ],
                        results: [
                          { status: "failed", errors: [{ message: marker }] },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          })
        );
        throw new Error(marker);
      });
      const log = vi.spyOn(console, "log").mockImplementation(() => {});
      try {
        const error = await verifyVideos({ ...h, env: credentials }).catch(
          (error: Error) => error
        );
        const directory = path.join(h.outputRoot, readdirSync(h.outputRoot)[0]);
        const retained = readFileSync(
          path.join(directory, "summary.json"),
          "utf8"
        );
        expect(String(error)).toContain(classification);
        expect(retained).toContain("http=200");
        expect(retained).toContain("assertion=initial-cards");
        expect(retained).toContain("documentCards=12");
        expect(retained).toContain("documentHeadings=null");
        expect(retained).toContain(
          `initialDocumentCards=${initial.documentCards}`
        );
        expect(
          retained + String(error) + JSON.stringify(log.mock.calls)
        ).not.toContain(marker);
        expect(readdirSync(directory)).toEqual(["summary.json"]);
      } finally {
        log.mockRestore();
      }
    }
  );

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
