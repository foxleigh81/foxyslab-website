import { spawn } from "node:child_process";
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
  const cards = boundedCount(state?.cards);
  const headings = boundedCount(state?.headings);
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
  const assertion = [
    "initial-cards",
    "playlist-selection",
    "server-cards",
    "hydration-layout",
    "search",
    "accessibility",
  ].includes(state?.assertion)
    ? state.assertion
    : "unknown";
  const line =
    Number.isSafeInteger(spec.line) && spec.line > 0 && spec.line <= 100000
      ? spec.line
      : "unknown";
  return `line ${line}: ${result.status}; ${classification}; cards=${cards}; headings=${headings}; http=${httpStatus}; assertion=${assertion}; initialCards=${initialCards}; initialDocumentCards=${initialDocumentCards}`;
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
  const productionEnv = {
    ...env,
    NODE_ENV: "production",
    ALLOW_MISSING_API_KEYS: "false",
  };
  await mkdir(outputRoot, { recursive: true });
  const directory = await mkdtemp(path.join(outputRoot, "run-"));
  console.log(`Reports: ${directory}`);
  await run("Build", "npm", ["run", "build"], productionEnv);
  const server = await serve(productionEnv);
  try {
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
        ...productionEnv,
        VIDEOS_BASE_URL: server.url,
        VIDEOS_REPORT_DIR: directory,
      }
    ).catch(async () => {
      const diagnostic = await browserFailureDiagnostic(directory);
      await writeFile(
        path.join(directory, "summary.json"),
        JSON.stringify({ browserFailure: diagnostic }, null, 2)
      );
      throw new Error(`Browser smoke failed: ${diagnostic}`);
    });
    const runs = [];
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
        productionEnv
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
      await writeFile(
        path.join(directory, "summary.json"),
        JSON.stringify({ url: `${server.url}/videos`, runs }, null, 2)
      );
      console.log(`Run ${index}: CLS ${metrics.cls}; LCP ${metrics.lcpMs} ms`);
    }
    return directory;
  } finally {
    try {
      await server.stop();
    } finally {
      await discardRawReports(directory);
    }
  }
}
