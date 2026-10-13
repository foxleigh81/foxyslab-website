# Repeatable production /videos checks

This procedure builds the current checkout with externally supplied credentials,
serves that artifact, runs the existing gallery browser smoke tests, and retains
three mobile Lighthouse runs. Adding this setup is not a performance result.
It does not change the page or establish a baseline retroactively.

## Prerequisites

Use the same Node version and feature-flag environment as the target deployment.
Run from the repository root on a host with access to Google Fonts, YouTube,
Fourthwall and the site's image origins. Install dependencies and Chromium:

```sh
npm ci
npx playwright install --with-deps chromium
export CHROME_PATH="$(node -p 'require("@playwright/test").chromium.executablePath()')"
```

Supply valid `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`
through the calling process environment (for example, a local secret manager or
the runner's secret injection). Credentials must work for this site's data and
be available at both build and runtime. The command requires exported values;
it does not read credentials from `.env` files. Do not put values in commands,
logs, committed files, or this document. Use the deployment's existing feature
flags and other build environment variables as appropriate.

Unset `ALLOW_MISSING_API_KEYS`. The command rejects the bypass and explicitly
disables it in child processes, including overrides from Next's dotenv files.
It checks credential presence before any build, server, or report creation.
Missing values produce exit 1 and list only missing variable names. Credential
validity still requires the real build and populated-gallery browser check.

## Run

```sh
npm run lint
npm run type-check
npm test
npm run verify:videos
```

`verify:videos` performs these steps in order:

1. Run `npm run build` with `NODE_ENV=production`, including the normal prebuild.
2. Start that build with `next start` on an unused loopback port. It never reuses
   a development server, including when `CI` is set.
3. Run `e2e/videos.spec.ts` with the dedicated production Playwright config and
   mobile Chromium. This requires a populated gallery and playlist, checks the
   initial default/direct-playlist cards and footer position through hydration,
   exercises search and clearing an empty result, and runs accessibility checks.
4. Run Lighthouse against `/videos` three times, sequentially, with mobile
   emulation and simulated throttling. Each run launches a fresh browser.
5. Print each run's CLS and LCP in milliseconds and stop the production server,
   including after a browser or measurement failure.

A failed build stops the procedure before serving; a failed smoke check stops it
before measurement. Dependency subprocess output is suppressed because upstream
errors may contain credential-bearing URLs. The console identifies the failed
stage and exit status. The browser JSON report retains browser assertion details.
The Lighthouse command uses the lockfile-installed version supplied by the
existing `@lhci/cli` dependency; it does not download tools on demand.

The existing `test:lighthouse` command remains the broader site CI check and
has a public upload target. **Use `verify:videos` for this procedure**: it does
not invoke that upload flow or send reports to public storage.

## Retained evidence

Every invocation allocates a new `.lighthouseci/videos/run-*/` directory, already
covered by the repository's ignore rules. The console prints its location.
Earlier invocations are never overwritten. A completed run contains:

- `browser-smoke.json` and any failure artifacts in `browser-artifacts/`.
- `mobile-1.report.json` and `mobile-1.report.html`.
- `mobile-2.report.json` and `mobile-2.report.html`.
- `mobile-3.report.json` and `mobile-3.report.html`.
- `summary.json`, with URL and per-run `cls` and `lcpMs` values.

Copy that directory to private retained artifacts if running on an ephemeral
runner. Partial reports remain after failure; only exit 0 with all three reports
and a passing browser report counts as a completed verification. Lighthouse
runtime errors or missing metrics cause failure. This setup records metrics; it
does not enforce the future page task's CLS threshold. For that task, confirm
**each** run is below 0.1, record all LCP values and inspect the reports' LCP and
layout-shift details. Do not infer a network-dependent LCP improvement from code.

For a manual browser smoke check after a successful build, run `npm start` with
the same exported environment and open `http://localhost:3000/videos`. Confirm
cards are present, search and clearing search work, change the playlist, load
its URL directly, and paginate forward/back where the dataset permits. In
DevTools inspect the first card's `img` for its emitted `fetchpriority` and the
document's image preload. Record the observed hint and LCP element alongside
the measurements. Empty/error behavior is also covered in the focused unit
tests; do not replace production data with fixtures for Lighthouse evidence.

## Revision 3 sandbox evidence

The regression command is `npm test -- lib/__tests__/verify-videos.test.ts`.
The first observed red run exited 1 because the missing `verify:videos` command
did not report missing credentials. Adding the credential gate made it green
(one test). A second observed red run had four failures for the unimplemented
build/serve/smoke/report orchestration. Implementing it produced five passing
tests. Refactoring report validation into `mobileMetrics` and formatting the
new files kept all five tests green with the same command.

The orchestration tests substitute external processes and use synthetic report
metrics. They prove sequencing, retained reports, and failure cleanup, **not**
credential validity, browser behavior, or production performance.

On 2026-10-13, all three required environment variables were absent.
`npm run verify:videos` exited 1 with the expected missing-variable message.
`npm run build` exited 1 because Poppins could not be downloaded from Google
Fonts. This sandbox cannot reach the required font/data origins. No credentialed
build or genuine Lighthouse reports were produced; production verification
remains pending in a suitable environment.

Configured checks observed in this revision:

| Command | Result |
| --- | --- |
| `npm ci` | Exit 0. |
| `npm run lint` | Exit 0. |
| `npm run type-check` | Final run exit 0 after correcting the test environment's TypeScript type. |
| `npm test` | Exit 0; 31 files, 285 passed, one skipped. |
| `npm run build` | Exit 1; Google Fonts/Poppins download failed. |
| `npm run test:e2e -- e2e/videos.spec.ts --reporter=line --workers=1` | Exit 1; development server lacked `FLAGS_SECRET`, readiness timed out after 60000ms; no browser assertions ran. |
| `npm run test:lighthouse` | Exit 1; `next start` could not find a successful production build; no measurements or uploads. |
| `npm run verify:videos` | Exit 1; all three required credentials absent, rejected before build. |

The dedicated Playwright configuration also passed `--list` with a loopback URL
and ignored report directory: it discovers three tests under Mobile Chrome.
This is configuration validation only. Chromium and WebKit binaries are present
in this revision's sandbox, unlike the earlier validation environment.
