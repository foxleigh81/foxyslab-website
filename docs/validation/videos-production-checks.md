# Repeatable production /videos checks

This procedure builds the current checkout with externally supplied credentials,
serves that artifact, runs the existing gallery browser smoke tests, and retains
three mobile Lighthouse runs. Adding this setup is not a performance result.
It does not change the page or establish a baseline retroactively.

## Prerequisites

Use the same Node version and feature-flag environment as the target deployment.
Run from the repository root on a host with access to YouTube, Fourthwall and
the site's image origins. Poppins is bundled in `public/fonts/poppins` with its
license and provenance; builds no longer need Google Fonts access. Install
dependencies and Chromium:

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

In GitHub Actions, manually run **Production Videos Verification**
(`.github/workflows/videos-verification.yml`) for the checkout to measure.
The workflow uses the existing repository secrets through the step's
`${{ secrets.YOUTUBE_API_KEY }}`, `${{ secrets.FOURTHWALL_STOREFRONT_TOKEN }}`,
and `${{ secrets.FLAGS_SECRET }}` contexts. It does not accept credential inputs
or enable a missing-key bypass. Missing secrets fail the verifier's credential
gate. This job retains reports as Actions artifacts and does not upload them to
Lighthouse's public storage. The ordinary CI Lighthouse job is not evidence for
this procedure because it uses a missing-key bypass.

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
3. Run `e2e/videos-gallery.spec.ts` with the dedicated production Playwright config and
   desktop and mobile Chromium. This requires a populated gallery and playlist, checks the
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

Optionally export `VIDEOS_PLAYLIST_SLUG` with a known populated playlist's URL
slug (the value after `?playlist=`). The gallery check requires that exact option
to have a positive matching-video count. Without it, the check discovers the
first option with a positive count from the loaded page. It reads all options
at once; a missing control, missing slug, or no populated playlists immediately
raises a fixture/data diagnostic instead of waiting for a second option.
Check the `browser-smoke.json` error details if the runner reports a failed smoke
stage. Correct the data source or slug; do not bypass the check with an empty
gallery. Both desktop and mobile exercise the selected playlist's direct URL.

Discovery also rejects a gallery with zero rendered cards even if its dropdown
labels claim a positive video count. Default and direct-playlist navigation
must each render a visible card within five seconds; failures name the gallery
fixture/data and suggest checking credentials and playlist membership.

### Exact underlying commands

`npm run verify:videos` is the recommended entry point: it suppresses dependency
output that could contain credential-bearing URLs and always stops its server.
For reproduction on a trusted host, its build/browser/Lighthouse commands are
shown below. Direct commands do not provide that log protection; keep their
output private. Export the required credentials securely before running them.

```sh
export NODE_ENV=production
export ALLOW_MISSING_API_KEYS=false
npm run build
# Keep this process running in a separate terminal with the same environment.
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 4173
```

In the checking terminal, with the same environment:

```sh
export VIDEOS_BASE_URL=http://127.0.0.1:4173
mkdir -p .lighthouseci/videos
export VIDEOS_REPORT_DIR="$(mktemp -d "$PWD/.lighthouseci/videos/manual-XXXXXX")"
export CHROME_PATH="$(node -p 'require("@playwright/test").chromium.executablePath()')"
node node_modules/@playwright/test/cli.js test e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts || exit "$?"
for run in 1 2 3; do
  node node_modules/lighthouse/cli/index.js "$VIDEOS_BASE_URL/videos" \
    --form-factor=mobile --throttling-method=simulate \
    --output=json --output=html \
    --output-path="$VIDEOS_REPORT_DIR/mobile-$run" \
    --chrome-flags=--headless --quiet || exit "$?"
done
```

Stop the manually started server afterward. The automated command additionally validates metrics and writes
`summary.json`; direct commands retain the raw reports only.

The populated-gallery hydration check is tagged `@production`. The regular
`npm run test:e2e` configuration excludes that tag because its development
server and CI job do not supply YouTube credentials. It still runs the gallery
heading and graceful-loading smoke tests on desktop Chromium and mobile WebKit.
The dedicated production configuration includes the tagged check unconditionally
on desktop and mobile Chromium; missing data remains a failure, never a skip.
Passing the regular E2E suite does not establish populated-gallery or performance
evidence. Use `npm run verify:videos` for that evidence.

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
| `npm run test:e2e -- e2e/videos-gallery.spec.ts --reporter=line --workers=1` | Exit 1; development server lacked `FLAGS_SECRET`, readiness timed out after 60000ms; no browser assertions ran. |
| `npm run test:lighthouse` | Exit 1; `next start` could not find a successful production build; no measurements or uploads. |
| `npm run verify:videos` | Exit 1; all three required credentials absent, rejected before build. |

The dedicated Playwright configuration also passed `--list` with a loopback URL
and ignored report directory: it discovers three tests under Mobile Chrome.
This is configuration validation only. Chromium and WebKit binaries are present
in this revision's sandbox, unlike the earlier validation environment.

## Revision 4 sandbox evidence

The gallery suite is now `e2e/videos-gallery.spec.ts`, matching the review
runner's command. Both the production config and verification script use that
name; there is no duplicate suite. Poppins now uses bundled, licensed Latin
WOFF2 files for the same six weights instead of a build-time Google Fonts fetch.
This changes font delivery, not the gallery render boundary, and establishes no
performance result.

Observed red/green checks:

- `npm run test:e2e -- e2e/videos-gallery.spec.ts --list` initially exited 1
  with "No tests found". After the rename it exited 0 and discovered six tests.
  The dedicated production config also discovers all three mobile tests.
- `npm test -- lib/__tests__/local-fonts.test.ts` initially exited 1 because
  the layout used the Google loader. With bundled fonts it passes. The test
  exercises Next's local font loader and verifies six real WOFF2 files, emitted
  local CSS for every weight, the CSS variable and fallback metrics.
- `npm test -- lib/__tests__/local-fonts.test.ts lib/__tests__/verify-videos.test.ts`
  passed all six tests after the fix and again after formatting the font
  configuration and correcting the test adapter to match Next's loader types.
  No further production refactor was needed.

`npm ci`, `npm run lint`, `npm run type-check`, and `npm test` passed (32 unit
test files; 286 passed, one skipped). The standalone `npm run build` compiled
successfully without Google Fonts access, passed lint/type validation, then
failed prerendering `/about` because `FLAGS_SECRET` is absent. An earlier build
attempt was killed with exit 137; the standalone rerun above is the useful
build result.

`npm run test:e2e -- e2e/videos-gallery.spec.ts --reporter=line --workers=1`
exited 1 after the 60-second server readiness timeout: the development server
reported missing `FLAGS_SECRET`, so no browser assertions ran.
`npm run test:lighthouse` passed its Chrome/config healthcheck but exited 1
because `next start` had no completed production build. No measurements or
uploads occurred.

All three required credentials remain absent. `npm run verify:videos` exited 1
listing only their names, before creating a build or reports. A credentialed
production build and three genuine mobile measurements remain pending; the
font-loader and discovery tests do not substitute for that evidence.

## Revision 5 sandbox evidence

`npm test -- lib/__tests__/videos-fixture.test.ts` first exited 1 with six
assertion failures against the extracted second-option selection: it selected
an empty playlist, ignored the configured slug, and did not diagnose missing
data. The same command passed all six tests after adding populated-playlist
selection and explicit fixture/data errors. Refactoring the table-driven test
cases for clearer names and formatting kept the combined fixture and runner
checks green:
`npm test -- lib/__tests__/videos-fixture.test.ts lib/__tests__/verify-videos.test.ts`
(11 passed).

`npm ci`, `npm run lint`, `npm run type-check`, and `npm test` passed (33 unit
test files; 292 passed, one skipped). Production Playwright `--list` with
`VIDEOS_BASE_URL` and `VIDEOS_REPORT_DIR` discovers six tests across desktop
and mobile Chromium. This validates discovery, not browser assertions.

`npm run build` compiled and passed lint/type validation, then exited 1 during
prerendering because `FLAGS_SECRET` is absent. `npm run verify:videos` exited 1
before building, listing the three absent credential variable names. No bypass
was used and no production Lighthouse measurements were produced. Credentialed
production verification remains pending on a host with access to the data
services described above.

`npm run test:e2e -- e2e/videos-gallery.spec.ts --reporter=line --workers=1`
exited 1 after the 60-second server-readiness timeout. The server reported the
missing `FLAGS_SECRET`; no browser assertions ran.

## Revision 6 sandbox evidence

The regular E2E job has no YouTube credential. With an ephemeral, locally
generated `FLAGS_SECRET` supplied only in the process environment, the original
desktop hydration test reproduced the reported failure: `Gallery fixture/data
unavailable`, following the server's missing-YouTube-key response.

`npm test -- lib/__tests__/videos-browser-config.test.ts` initially exited 1:
the regular configuration selected the live-data hydration test. After tagging
that test `@production` and excluding the tag only in the regular configuration,
the same command passed both tests. They exercise real Playwright discovery and
also require the production configuration to retain the hydration check on both
desktop and mobile. After formatting, the combined config, fixture-selection,
and verification-runner tests passed all 13 tests:

```sh
npm test -- lib/__tests__/videos-browser-config.test.ts lib/__tests__/videos-fixture.test.ts lib/__tests__/verify-videos.test.ts
```

No application behavior or CI workflow changed. The production data diagnostic
remains mandatory. `npm run verify:videos` exited 1 at the credential gate;
the three required credentials remain absent. No production measurements were
obtained and no missing-key bypass was used.

`npm ci`, `npm run lint`, `npm run type-check`, and `npm test` passed (34 unit
test files; 294 passed, one skipped). The first lint attempt overlapped Playwright
deleting `test-results` and failed with ENOENT; the subsequent run passed.

The focused browser command passed all four desktop Chromium/mobile WebKit
smoke tests:

```sh
NODE_OPTIONS=--max-old-space-size=1536 FLAGS_SECRET="$(node -e 'process.stdout.write(require("node:crypto").randomBytes(32).toString("base64url"))')" npm run test:e2e -- e2e/videos-gallery.spec.ts --reporter=line --workers=1
```

This generates an ephemeral local flags secret; it is not a deployment credential
and is not used for production verification. The heap limit keeps the development
server within this sandbox's memory budget.

The full E2E run was also attempted. Its first attempt lost the development
server with a sandbox OOM kill and subsequent connection-refused errors. The
heap-limited retry passed 34 tests, including all desktop tests and the mobile
videos accessibility audit. Mobile WebKit repeatedly timed out in `page.goto`
loading `/` in the homepage accessibility and skip-link tests. The run was
interrupted (exit 130) after those two failures, leaving 14 tests unrun. The
focused gallery rerun above passed afterward. The full suite is not claimed
green; those homepage failures remain outside this gallery configuration fix.

`NODE_OPTIONS=--max-old-space-size=1536 npm run build` compiled successfully and
passed its lint/type checks, then exited 1 during prerendering because
`FLAGS_SECRET` is absent. The credentialed build and mobile Lighthouse evidence
remain pending on an authorized host with the required data-service access.

## Revision 7 sandbox evidence

Added a manual production-verification workflow using repository secrets at the
verification step, and documented the exact build, browser and Lighthouse
commands. No gallery rendering or font files changed in this revision.

`npm test -- lib/__tests__/videos-fixture.test.ts` first could not start because
dependencies were absent (exit 127; not a regression red). After `npm ci`, the
same command produced the expected red (exit 1): the new zero-rendered-cards
case did not throw despite a positive playlist label. Adding the card-count
guard made all seven tests pass (exit 0). Extracting the shared data diagnostic
for fixture discovery and direct-navigation assertions kept the following
refactor rerun green (14 tests, exit 0):

```sh
npm test -- lib/__tests__/videos-fixture.test.ts lib/__tests__/videos-browser-config.test.ts lib/__tests__/verify-videos.test.ts
```

`npm ci`, `npm run lint`, `npm run type-check`, and `npm test` passed. The full
unit suite passed 295 tests with one skipped across 34 files. Workflow YAML
parsing, changed-code formatting and `git diff --check` also passed.

`NODE_OPTIONS=--max-old-space-size=1536 npm run build` compiled and passed its
lint/type checks, then exited 1 prerendering `/supporters`: `FLAGS_SECRET` is
absent. `npm run test:e2e -- e2e/videos-gallery.spec.ts --reporter=line --workers=1`
exited 1 at the 60-second web-server readiness timeout with the same missing
secret; no browser assertions ran.

`npm run verify:videos` exited 1 immediately, listing only the names of the
three absent credentials. No bypass or placeholder credentials were used. This
sandbox also cannot reach the required data origins. The new CI workflow was
not dispatched from this sandbox; a credentialed build, populated desktop/mobile
browser checks and genuine Lighthouse measurements remain unverified.
