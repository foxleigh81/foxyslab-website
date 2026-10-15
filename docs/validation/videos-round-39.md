# Round 39: browser child identified; root-cause evidence inaccessible

Investigated on 2026-10-15 against
`122d26f5a5daf0f7d8fbac3d9df87fcb48615dd8`. Both local `git rev-parse HEAD`
and a fresh GitHub PR #79 API response confirm this exact draft head.

## Credentialed run and failing command

The supplied redacted log for [run 38717478040, job 116363584813](https://github.com/foxleigh81/foxyslab-website/actions/runs/38717478040/job/116363584813)
records that checkout and execution of `npm run verify:videos` with repository
credentials and `ALLOW_MISSING_API_KEYS=false`. This was the existing remote
execution, not a new run launched from this sandbox.

The runner advanced from `Build...` to `Browser smoke...`, establishing that
`npm run build` returned successfully and the production server passed readiness.
The failing child, resolved by `scripts/lib/verify-videos.mjs`, was:

```text
node node_modules/@playwright/test/cli.js test e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts
```

The runner uses `process.execPath` and `require.resolve` for the executable and
CLI paths. Its credential-safe diagnostic appears twice:

```text
line 21: failed; populated gallery data unavailable; no rendered video cards
```

This identifies the layout regression test, configured for Desktop Chrome and
Mobile Chrome. Its missing-card diagnostic can originate either from the
initial `main h2` count passed to `selectPlaylist`, or from the later visibility
assertion while scripts are held. The reduced console output does not identify
which assertion failed. `VideoGallery` passes `headingLevel={2}` to `VideoCard`,
so inspection does not establish a heading-selector mismatch.

The demonstrated failure is the browser test's populated-card requirement.
The underlying cause and classification (tooling, credentials/environment, or
application behavior) remain unresolved. A successful build does not prove
that this request-rendered route received usable data. Do not label the API key
invalid, change application behavior, weaken the assertion, or substitute
fixture data based solely on this diagnostic. Lighthouse was never reached;
there are no new CLS/LCP measurements or observed thumbnail priority hints.

## Evidence access and Preview

Fresh GitHub API requests returned:

- Artifact `11962944845` ZIP: HTTP 401, `Requires authentication`.
- Job `116363584813` logs: HTTP 403, `Must have admin rights to Repository.`

The [retained browser artifact](https://github.com/foxleigh81/foxyslab-website/actions/runs/38717478040/artifacts/11962944845)
is the next diagnostic source: inspect `browser-smoke.json` for the assertion
location and its screenshots/trace for the rendered state. Those contents were
not available here. No credentials were retrieved or copied.

The deployments API filtered by the exact SHA returned Preview deployment
`7089645936`. Its successful status identifies
`https://foxyslab-website-3zv7t4g2j-foxleighco.vercel.app` as `environment_url`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to Vercel SSO.
This is not a tested page or evidence of populated content.

Local `npm run verify:videos` exited 1 at credential preflight, before any child:
`Missing required credentials: YOUTUBE_API_KEY, FOURTHWALL_STOREFRONT_TOKEN, FLAGS_SECRET`.
This is a separate local environment limitation, not a reproduction of the CI
browser failure. The sandbox has no GitHub authentication to launch another
credentialed run or download its protected evidence.

## Scope and checks

Only this diagnostic record changes. No tooling defect was reproduced and no
production code changed, so a red-green-refactor behavior test is not meaningful
for this documentation-only revision; no red run is claimed.

Local checks completed successfully:

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 36 files passed, 314 tests passed, one skipped,
  including the existing verification runner regression tests.

The credentialed production build, browser tests, and measurements could not
be rerun locally because the credential preflight failed as recorded above.

The next task needs authorized access to the retained browser report to locate
the assertion and classify the cause. If that report reproduces an application
failure, hand it to the application task rather than masking it in the runner.
Populated verification remains blocked; the review failure is not fixed.
