import { execFileSync, spawn } from "node:child_process";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { createServer } from "node:net";
import { createRequire } from "node:module";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const require = createRequire(import.meta.url);
const required = [
  "YOUTUBE_API_KEY",
  "FOURTHWALL_STOREFRONT_TOKEN",
  "FLAGS_SECRET",
];
const processKeys = [
  "PATH",
  "HOME",
  "TMPDIR",
  "CI",
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "NO_PROXY",
];
const appKeys = [
  "YOUTUBE_API_KEY",
  "FOURTHWALL_STOREFRONT_TOKEN",
  "FLAGS_SECRET",
  "FLAG_NEWSLETTER",
  "NEXT_PUBLIC_GA_ID",
  "NEXT_PUBLIC_SENTRY_DSN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
];

function selectedEnv(source, keys) {
  return Object.fromEntries(
    keys
      .filter((key) => source[key] !== undefined)
      .map((key) => [key, source[key]])
  );
}

async function discardRawReports(directory) {
  for (const name of await readdir(directory)) {
    if (name !== "summary.json")
      await rm(path.join(directory, name), { recursive: true, force: true });
  }
}

function mobileMetrics(report, run) {
  const cls = report.audits?.["cumulative-layout-shift"]?.numericValue;
  const lcpMs = report.audits?.["largest-contentful-paint"]?.numericValue;
  if (
    report.runtimeError ||
    report.configSettings?.formFactor !== "mobile" ||
    !Number.isFinite(cls) ||
    !Number.isFinite(lcpMs)
  ) {
    throw new Error(
      `Lighthouse ${run} did not produce valid mobile CLS/LCP metrics`
    );
  }
  return { run, cls, lcpMs };
}

function runCommand(label, command, args, env) {
  console.log(`${label}...`);
  return new Promise((resolve, reject) => {
    // Dependency errors can include credential-bearing request URLs.
    const child = spawn(command, args, { env, stdio: "ignore" });
    child.on("error", () => reject(new Error(`${label} could not start`)));
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(
            new Error(
              `${label} failed (exit ${code}); child output suppressed to protect credentials`
            )
          )
    );
  });
}

function boundedCount(value) {
  return Number.isInteger(value) && value >= 0 && value <= 200 ? value : null;
}

function browserResultDiagnostic(spec, test, result) {
  let state;
  try {
    state = JSON.parse(
      test.annotations?.find((item) => item.type === "videos-state")
        ?.description
    );
  } catch {
    /* Missing or malformed observations remain unclassified. */
  }
  let failedOutcome;
  let transition;
  for (const annotation of test.annotations ?? []) {
    if (annotation.type !== "videos-outcome") continue;
    try {
      const value = JSON.parse(annotation.description);
      if (
        value.source === "live" &&
        value.outcome === "failed" &&
        [
          "search",
          "pagination-forward",
          "pagination-back",
          "playlist-selection",
          "direct-playlist",
        ].includes(value.check)
      ) {
        failedOutcome = value.check;
        if (value.diagnostic && typeof value.diagnostic === "object")
          transition = value.diagnostic;
      }
    } catch {
      /* Untrusted annotation content is never retained. */
    }
  }
  const cards = boundedCount(state?.cards);
  const headings = boundedCount(state?.headings);
  const documentCards = boundedCount(state?.documentCards);
  const documentHeadings = boundedCount(state?.documentHeadings);
  let classification = "unclassified";
  if (state?.state === "fetch-failed") classification = "data-fetch-failure";
  else if (state?.state === "empty") classification = "empty-response";
  else if (
    state?.state === "populated" &&
    cards !== null &&
    headings !== null
  ) {
    classification =
      cards === 0
        ? "application-render-failure"
        : headings === 0
          ? "stale-browser-assertion"
          : "browser-assertion-failure";
  } else if (state?.httpStatus >= 500 && state.httpStatus <= 599) {
    classification = "application-render-failure";
  }
  const initial = state?.initial;
  const initialCards = boundedCount(initial?.cards);
  const initialDocumentCards = boundedCount(initial?.documentCards);
  if (initial?.serverError === true) classification = "server-render-error";
  else if (initial?.state === "fetch-failed")
    classification = "data-fetch-failure";
  else if (initial?.state === "empty") classification = "empty-response";
  else if (cards === 0 && initialCards !== null && initialCards > 0)
    classification = "browser-render-mismatch";
  else if (cards === 0 && initialCards === 0 && initialDocumentCards > 0)
    classification = "streamed-cards-outside-main";
  const httpStatus =
    Number.isInteger(state?.httpStatus) &&
    state.httpStatus >= 100 &&
    state.httpStatus <= 599
      ? state.httpStatus
      : null;
  const assertion =
    failedOutcome ??
    ([
      "initial-cards",
      "playlist-selection",
      "server-cards",
      "hydration-layout",
      "search",
      "accessibility",
    ].includes(state?.assertion)
      ? state.assertion
      : "unknown");
  if (failedOutcome) classification = "browser-assertion-failure";
  const project = ["Desktop Chrome", "Mobile Chrome"].includes(test.projectName)
    ? test.projectName
    : "unknown";
  const line =
    Number.isSafeInteger(spec.line) && spec.line > 0 && spec.line <= 100000
      ? spec.line
      : "unknown";
  const pageNumber = (value) =>
    Number.isInteger(value) && value >= 1 && value <= 17 ? value : null;
  let transitionDetail = "";
  if (transition && failedOutcome?.startsWith("pagination-")) {
    transitionDetail = `; urlPage=${pageNumber(transition.urlPage)}; activePage=${pageNumber(transition.activePage)}; visibleCards=${boundedCount(transition.cards)}; matchesInitial=${typeof transition.matchesInitial === "boolean" ? transition.matchesInitial : null}`;
  } else if (transition && failedOutcome === "playlist-selection") {
    transitionDetail = `; urlHasPlaylist=${typeof transition.urlHasPlaylist === "boolean" ? transition.urlHasPlaylist : null}; controlMatchesUrl=${typeof transition.controlMatchesUrl === "boolean" ? transition.controlMatchesUrl : null}; visibleCards=${boundedCount(transition.cards)}`;
  }
  return `line ${line}: ${result.status}; ${classification}; project=${project}; cards=${cards}; headings=${headings}; documentCards=${documentCards}; documentHeadings=${documentHeadings}; http=${httpStatus}; assertion=${assertion}; initialCards=${initialCards}; initialDocumentCards=${initialDocumentCards}${transitionDetail}`;
}

async function browserFailureDiagnostic(directory) {
  try {
    const report = JSON.parse(
      await readFile(path.join(directory, "browser-smoke.json"), "utf8")
    );
    const failures = [];
    function visit(suites) {
      for (const suite of suites ?? []) {
        for (const spec of suite.specs ?? []) {
          for (const test of spec.tests ?? []) {
            for (const result of test.results ?? []) {
              if (
                !["failed", "timedOut", "interrupted"].includes(result.status)
              )
                continue;
              if (failures.length < 10)
                failures.push(browserResultDiagnostic(spec, test, result));
            }
          }
        }
        visit(suite.suites);
      }
    }
    visit(report.suites);
    return failures.length
      ? failures.join("\n")
      : "No failed test results in browser report; inspect browser setup errors";
  } catch {
    return "Browser report missing or unreadable; inspect browser startup and report configuration";
  }
}

async function browserOutcomes(directory) {
  const outcomes = [];
  try {
    const report = JSON.parse(
      await readFile(path.join(directory, "browser-smoke.json"), "utf8")
    );
    function visit(suites) {
      for (const suite of suites ?? []) {
        for (const spec of suite.specs ?? []) {
          for (const test of spec.tests ?? []) {
            for (const annotation of test.annotations ?? []) {
              if (annotation.type !== "videos-outcome" || outcomes.length >= 40)
                continue;
              let value;
              try {
                value = JSON.parse(annotation.description);
              } catch {
                continue;
              }
              if (
                !value ||
                !["live", "fixture"].includes(value.source) ||
                ![
                  "search",
                  "playlist-selection",
                  "pagination-forward",
                  "pagination-back",
                  "direct-playlist",
                  "thumbnail-priority",
                  "empty",
                  "fetch-failed",
                  "hydration-layout",
                ].includes(value.check) ||
                !["passed", "failed", "not-applicable", "observed"].includes(
                  value.outcome
                )
              )
                continue;
              const outcome = {
                project: ["Desktop Chrome", "Mobile Chrome"].includes(
                  test.projectName
                )
                  ? test.projectName
                  : "unknown",
                source: value.source,
                check: value.check,
                outcome: value.outcome,
              };
              if (value.check === "thumbnail-priority") {
                outcome.fetchPriority = [
                  "high",
                  "low",
                  "auto",
                  "absent",
                ].includes(value.fetchPriority)
                  ? value.fetchPriority
                  : "invalid";
              }
              outcomes.push(outcome);
            }
          }
        }
        visit(suite.suites);
      }
    }
    visit(report.suites);
  } catch {
    /* Raw parser errors and report text must never reach retained output. */
  }
  return outcomes;
}

async function serveBuild(env) {
  // Claim an unused port; never reuse an unrelated development server.
  const probe = createServer();
  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", resolve);
  });
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  const url = `http://127.0.0.1:${port}`;
  const child = spawn(
    process.execPath,
    [
      require.resolve("next/dist/bin/next"),
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    { env, stdio: "ignore" }
  );
  let exited = false;
  child.on("error", () => {
    exited = true;
  });
  child.on("exit", () => {
    exited = true;
  });
  const stop = async () => {
    if (exited) return;
    const closed = new Promise((resolve) => child.once("exit", resolve));
    child.kill("SIGTERM");
    const timeout = setTimeout(() => child.kill("SIGKILL"), 5000);
    await closed;
    clearTimeout(timeout);
  };
  try {
    for (let attempt = 0; attempt < 60; attempt++) {
      if (exited)
        throw new Error("Production server exited before becoming ready");
      try {
        const response = await fetch(`${url}/videos`, {
          signal: AbortSignal.timeout(2000),
        });
        await response.body?.cancel();
        if (response.ok && !exited) return { url, stop };
      } catch {
        /* Retry while Next starts. */
      }
      await delay(1000);
    }
    throw new Error(
      "Production server did not serve /videos within the readiness timeout"
    );
  } catch (error) {
    await stop();
    throw error;
  }
}

export async function verifyVideos({
  env = process.env,
  outputRoot = path.resolve(".lighthouseci/videos"),
  run = runCommand,
  serve = serveBuild,
} = {}) {
  const missing = required.filter((name) => !env[name]?.trim());
  if (missing.length)
    throw new Error(`Missing required credentials: ${missing.join(", ")}`);
  if (env.ALLOW_MISSING_API_KEYS === "true")
    throw new Error(
      "Unset ALLOW_MISSING_API_KEYS for production-equivalent verification"
    );
  const commonEnv = selectedEnv(env, processKeys);
  const browserEnv = { ...commonEnv, ...selectedEnv(env, ["CHROME_PATH"]) };
  const productionEnv = {
    ...commonEnv,
    ...selectedEnv(env, appKeys),
    NODE_ENV: "production",
    ALLOW_MISSING_API_KEYS: "false",
  };
  await mkdir(outputRoot, { recursive: true });
  const directory = await mkdtemp(path.join(outputRoot, "run-"));
  const verification = {
    head: execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
      env: commonEnv,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim(),
    build: {
      command: "npm run build",
      nodeEnv: "production",
      allowMissingApiKeys: false,
    },
    credentials: Object.fromEntries(required.map((name) => [name, "present"])),
    browserTarget: "next start",
    browserConfig: "playwright.videos-production.config.ts",
  };
  const writeSummary = (result) =>
    writeFile(
      path.join(directory, "summary.json"),
      JSON.stringify({ verification, ...result }, null, 2)
    );
  await writeSummary({});
  console.log(`Reports: ${directory}`);
  let server;
  try {
    await run("Build", "npm", ["run", "build"], productionEnv);
    server = await serve(productionEnv);
    const fixtureDirectory = path.join(directory, "state-fixtures");
    await mkdir(fixtureDirectory);
    await run(
      "State fixtures",
      "npm",
      ["test", "--", "app/videos/__tests__/page.test.tsx"],
      {
        ...commonEnv,
        NODE_ENV: "test",
        YOUTUBE_API_KEY: "synthetic-fixture-key",
        FOURTHWALL_STOREFRONT_TOKEN: "synthetic-fixture-token",
        FLAGS_SECRET: "BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc",
        VIDEOS_STATE_FIXTURE_DIR: fixtureDirectory,
      }
    );
    await run(
      "Browser smoke",
      process.execPath,
      [
        require.resolve("@playwright/test/cli"),
        "test",
        "e2e/videos-gallery.spec.ts",
        "--config=playwright.videos-production.config.ts",
      ],
      {
        ...browserEnv,
        NODE_ENV: "test",
        VIDEOS_BASE_URL: server.url,
        VIDEOS_REPORT_DIR: directory,
        VIDEOS_STATE_FIXTURE_DIR: fixtureDirectory,
        ...selectedEnv(env, ["VIDEOS_PLAYLIST_SLUG"]),
      }
    ).catch(async () => {
      const diagnostic = await browserFailureDiagnostic(directory);
      await writeSummary({
        browserFailure: diagnostic,
        browser: await browserOutcomes(directory),
      });
      throw new Error(`Browser smoke failed: ${diagnostic}`);
    });
    const browser = await browserOutcomes(directory);
    const runs = [];
    await writeSummary({ browser, runs });
    for (let index = 1; index <= 3; index++) {
      const prefix = path.join(directory, `mobile-${index}`);
      await run(
        `Lighthouse ${index}`,
        process.execPath,
        [
          require.resolve("lighthouse/cli/index.js"),
          `${server.url}/videos`,
          "--form-factor=mobile",
          "--throttling-method=simulate",
          "--output=json",
          "--output=html",
          `--output-path=${prefix}`,
          // Match Playwright's default on runners without a usable Chromium sandbox.
          "--chrome-flags=--headless --no-sandbox",
          "--quiet",
        ],
        { ...browserEnv, NODE_ENV: "production" }
      );
      let report;
      try {
        report = JSON.parse(await readFile(`${prefix}.report.json`, "utf8"));
      } catch {
        // JSON parser errors can quote the credential-bearing input.
        throw new Error(`Lighthouse ${index} report missing or unreadable`);
      }
      const metrics = mobileMetrics(report, index);
      runs.push(metrics);
      await writeSummary({ url: `${server.url}/videos`, runs, browser });
      console.log(`Run ${index}: CLS ${metrics.cls}; LCP ${metrics.lcpMs} ms`);
    }
    return directory;
  } finally {
    try {
      await server?.stop();
    } finally {
      await discardRawReports(directory);
    }
  }
}
