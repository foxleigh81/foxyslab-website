# Repeatable production /videos checks

This procedure builds the current checkout with externally supplied credentials,
serves that artifact, runs the existing gallery browser smoke tests, and retains
three mobile Lighthouse runs. Adding this setup is not a performance result.
It does not change the page or establish a baseline retroactively.

## Prerequisites

### Use the PR's deployed Preview when available

A successful Vercel Preview is a production-equivalent build; a local build
without data credentials does not invalidate that deployment. Resolve the
deployment for the exact PR head before running browser checks:

1. Read `GET /repos/foxleigh81/foxyslab-website/pulls/79` and record `head.sha`.
2. Read `GET /repos/foxleigh81/foxyslab-website/deployments?sha=<head.sha>`.
   Select a `Preview` deployment whose `sha` exactly matches that head.
3. Read that deployment's `statuses_url`. Require a successful current status
   and use its `environment_url`, rather than a moving branch alias.
4. Check `/videos` at that URL. A redirect to Vercel SSO is an access blocker,
   not evidence of an empty gallery or an application regression. Use an
   authorized browser/runner with Preview access; do not measure the login page.
5. Set `VIDEOS_BASE_URL` to the deployment URL and `VIDEOS_REPORT_DIR` to a
   fresh directory under `.lighthouseci/videos/`. Run the dedicated Playwright
   command shown below, then the three Lighthouse commands only after the
   populated browser checks pass. Skip the local build and server steps.

Record the head SHA, deployment ID, status timestamp, URL and browser results
with the measurements. Deployment success alone does not prove cards are
present or that CLS meets the target. Keep deployment credentials in the
deployment provider or approved runner; do not retrieve Actions secret values
into the checking workspace.

### Build locally when no usable Preview is available

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
