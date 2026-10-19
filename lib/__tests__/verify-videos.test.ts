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
  const serve = vi.fn(async (_env: Record<string, string> = {}) => {
    events.push("serve");
    return { url: "http://127.0.0.1:4173", stop };
  });
  const run = vi.fn(
    async (
      label: string,
      _command: string,
      args: string[],
      _env: Record<string, string> = {}
    ) => {
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
    }
  );
  return { outputRoot, events, run, serve, stop };
}

describe("production videos verification command", () => {
  it("reports playlist URL agreement without exposing its slug", async () => {
    const h = harness();
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
                  line: 14,
                  tests: [
                    {
                      projectName: "Mobile Chrome",
                      annotations: [
                        {
                          type: "videos-outcome",
                          description: JSON.stringify({
                            source: "live",
                            check: "playlist-selection",
                            outcome: "failed",
                            diagnostic: {
                              cards: 12,
                              urlHasPlaylist: false,
                              controlMatchesUrl: false,
                              slug: "private-slug",
                            },
                          }),
                        },
                      ],
                      results: [{ status: "failed" }],
                    },
                  ],
                },
              ],
            },
          ],
        })
      );
      throw new Error("Browser smoke failed");
    });
    const error = await verifyVideos({ ...h, env: credentials }).catch(
      (error: Error) => error
    );
    expect(String(error)).toContain(
      "urlHasPlaylist=false; controlMatchesUrl=false; visibleCards=12"
    );
    expect(String(error)).not.toContain("private-slug");
  });

  it("reports bounded pagination state without retaining page data", async () => {
    const h = harness();
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
                  line: 14,
                  tests: [
                    {
                      projectName: "Desktop Chrome",
                      annotations: [
                        {
                          type: "videos-outcome",
                          description: JSON.stringify({
                            source: "live",
                            check: "pagination-back",
                            outcome: "failed",
                            diagnostic: {
                              urlPage: 1,
                              activePage: 2,
                              cards: 12,
                              matchesInitial: false,
                              url: "private-url",
                            },
                          }),
                        },
                      ],
                      results: [
                        {
                          status: "failed",
                          errors: [{ message: "private-title" }],
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
      throw new Error("Browser smoke failed");
    });
    const error = await verifyVideos({ ...h, env: credentials }).catch(
      (error: Error) => error
    );
    expect(String(error)).toContain(
      "urlPage=1; activePage=2; visibleCards=12; matchesInitial=false"
    );
    expect(String(error)).not.toContain("private-url");
    expect(String(error)).not.toContain("private-title");
  });

  it("names a failed mobile pagination assertion when no layout observation exists", async () => {
    const h = harness();
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
                  line: 14,
                  tests: [
                    {
                      projectName: "Mobile Chrome",
                      annotations: [
                        {
                          type: "videos-outcome",
                          description: JSON.stringify({
                            source: "live",
                            check: "pagination-forward",
                            outcome: "failed",
                          }),
                        },
                      ],
                      results: [
                        {
                          status: "failed",
                          errors: [{ message: "private-video-title" }],
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
      throw new Error("Browser smoke failed");
    });
    const error = await verifyVideos({ ...h, env: credentials }).catch(
      (error: Error) => error
    );
    expect(String(error)).toContain("assertion=pagination-forward");
    expect(String(error)).toContain("Mobile Chrome");
    expect(String(error)).not.toContain("private-video-title");
  });

  it("retains allowlisted browser outcomes without synthetic credentials on success or failure", async () => {
    for (const failed of [false, true]) {
      const h = harness();
      const originalRun = h.run.getMockImplementation()!;
      const marker = "synthetic52-private";
      h.run.mockImplementation(async (label, command, args) => {
        await originalRun(label, command, args);
        if (label !== "Browser smoke") return;
        const directory = path.join(h.outputRoot, readdirSync(h.outputRoot)[0]);
        const observations = [
          { source: "live", check: "search", outcome: "passed" },
          {
            source: "live",
            check: "pagination-forward",
            outcome: "not-applicable",
          },
          {
            source: "live",
            check: "thumbnail-priority",
            outcome: "observed",
            fetchPriority: "absent",
          },
          { source: "fixture", check: "empty", outcome: "passed" },
          {
            source: "live",
            check: "thumbnail-priority",
            outcome: "observed",
            fetchPriority: marker,
          },
          { source: marker, check: marker, outcome: marker },
        ];
        writeFileSync(
          path.join(directory, "browser-smoke.json"),
          JSON.stringify({
            suites: [
              {
                specs: [
                  {
                    tests: [
                      {
                        projectName: "Desktop Chrome",
                        annotations: observations.map((observation) => ({
                          type: "videos-outcome",
                          description: JSON.stringify({
                            ...observation,
                            url: marker,
                            error: marker,
                          }),
                        })),
                        results: [
                          {
                            status: failed ? "failed" : "passed",
                            errors: [{ message: marker }],
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
        if (failed) throw new Error(marker);
      });
      const log = vi.spyOn(console, "log").mockImplementation(() => {});
      try {
        await verifyVideos({
          ...h,
          env: { ...credentials, YOUTUBE_API_KEY: marker },
        }).catch(() => {});
        const directory = path.join(h.outputRoot, readdirSync(h.outputRoot)[0]);
        const retained = readFileSync(
          path.join(directory, "summary.json"),
          "utf8"
        );
        expect(JSON.parse(retained).browser).toEqual([
          {
            project: "Desktop Chrome",
            source: "live",
            check: "search",
            outcome: "passed",
          },
          {
            project: "Desktop Chrome",
            source: "live",
            check: "pagination-forward",
            outcome: "not-applicable",
          },
          {
            project: "Desktop Chrome",
            source: "live",
            check: "thumbnail-priority",
            outcome: "observed",
            fetchPriority: "absent",
          },
          {
            project: "Desktop Chrome",
            source: "fixture",
            check: "empty",
            outcome: "passed",
          },
          {
            project: "Desktop Chrome",
            source: "live",
            check: "thumbnail-priority",
            outcome: "observed",
            fetchPriority: "invalid",
          },
        ]);
        expect(retained + JSON.stringify(log.mock.calls)).not.toContain(marker);
        expect(readdirSync(directory)).toEqual(["summary.json"]);
      } finally {
        log.mockRestore();
      }
    }
  });
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
      "State fixtures",
      "Browser smoke",
      "Lighthouse 1",
      "Lighthouse 2",
      "Lighthouse 3",
      "stop",
    ]);
    expect(h.run.mock.calls[0].slice(1, 3)).toEqual(["npm", ["run", "build"]]);
    expect(h.run.mock.calls[2][2]).toContain(
      "--config=playwright.videos-production.config.ts"
    );
    expect(readdirSync(directory)).toEqual(["summary.json"]);
    const summary = JSON.parse(
      readFileSync(path.join(directory, "summary.json"), "utf8")
    );
    expect(summary).toEqual({
      browser: [],
      url: "http://127.0.0.1:4173/videos",
      runs: [
        { run: 1, cls: 0.05, lcpMs: 4200 },
        { run: 2, cls: 0.05, lcpMs: 4200 },
        { run: 3, cls: 0.05, lcpMs: 4200 },
      ],
    });
  });

  it("gives each child only the environment needed for its job", async () => {
    const h = harness();
    const env = {
      ...credentials,
      PATH: process.env.PATH ?? "",
      CHROME_PATH: "/synthetic/chromium",
      VIDEOS_PLAYLIST_SLUG: "synthetic-playlist",
      UNRELATED_SECRET: "synthetic-unrelated-secret",
    };
    await verifyVideos({ ...h, env });
    const childEnv = (label: string) =>
      (h.run.mock.calls.find(([name]) => name === label)?.[3] ?? {}) as Record<
        string,
        string
      >;
    for (const child of [childEnv("Build"), h.serve.mock.calls[0][0] ?? {}]) {
      expect(child.YOUTUBE_API_KEY).toBe(credentials.YOUTUBE_API_KEY);
      expect(child.FOURTHWALL_STOREFRONT_TOKEN).toBe(
        credentials.FOURTHWALL_STOREFRONT_TOKEN
      );
      expect(child.UNRELATED_SECRET).toBeUndefined();
      expect(child.FLAGS_SECRET).toBe(credentials.FLAGS_SECRET);
    }
    const fixtures = childEnv("State fixtures");
    expect(fixtures.YOUTUBE_API_KEY).toMatch(/^synthetic-/);
    expect(fixtures.FOURTHWALL_STOREFRONT_TOKEN).toMatch(/^synthetic-/);
    expect(fixtures.FLAGS_SECRET).not.toBe(credentials.FLAGS_SECRET);
    expect(Buffer.from(fixtures.FLAGS_SECRET, "base64url")).toHaveLength(32);
    for (const label of [
      "Browser smoke",
      "Lighthouse 1",
      "Lighthouse 2",
      "Lighthouse 3",
    ]) {
      const child = childEnv(label);
      for (const secret of [
        "YOUTUBE_API_KEY",
        "FOURTHWALL_STOREFRONT_TOKEN",
        "FLAGS_SECRET",
        "UNRELATED_SECRET",
      ])
        expect(child[secret], `${label}: ${secret}`).toBeUndefined();
    }
    expect(childEnv("Browser smoke").VIDEOS_PLAYLIST_SLUG).toBe(
      "synthetic-playlist"
    );
    expect(childEnv("Lighthouse 1").CHROME_PATH).toBe("/synthetic/chromium");
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
      expect(readdirSync(directory)).toEqual(["summary.json"]);
      expect(
        JSON.parse(readFileSync(path.join(directory, "summary.json"), "utf8"))
      ).toEqual({ browser: [], runs: [] });
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
    h.run.mockImplementation(async (label) => {
      if (label === "Browser smoke") throw new Error("Browser smoke failed");
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
