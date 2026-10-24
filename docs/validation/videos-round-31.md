# Round 31: browser child fails with no rendered video cards

Investigated PR #79 head `916606f4b1b5695710a826452fe65a5e59bf8094`
on 2026-10-15. Both the local checkout and the GitHub job API identify this
exact SHA.

## Evidence and diagnosis limits

[Job 116174720370](https://github.com/foxleigh81/foxyslab-website/actions/runs/38658758327/job/116174720370)
passed dependency and Chromium installation. The supplied redacted output shows
`Build...` followed by `Browser smoke...`; the verifier only starts the browser
after its build child succeeds and its production server responds successfully.
The failing child, invoked by `npm run verify:videos`, is:

```sh
node node_modules/@playwright/test/cli.js test e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts
```

Both browser results report `line 21: failed; populated gallery data unavailable;
no rendered video cards`. Line 21 identifies the test declaration, not the failed
assertion. This narrows the failure beyond round 30: the browser test reached a
missing-card check. It does not establish why cards were absent.

The current test emits this category in two places: `selectPlaylist` when its
initial `main h2` count is zero, and the visibility assertion after navigating
with scripts held during the hydration check. The condensed output does not
distinguish those sites. The retained report's error location and page evidence
are necessary to distinguish initial data availability from the pre-hydration
rendering check. Increasing timeouts, weakening the populated assertion, or
changing credentials based on this output would not be a demonstrated fix.

Fresh API requests made in this round returned:

- `/actions/jobs/116174720370`: HTTP 200; exact head and failed step confirmed.
- `/actions/jobs/116174720370/logs`: HTTP 403, `Must have admin rights to Repository.`
- `/actions/artifacts/11938695083/zip`: HTTP 401, `Requires authentication`.
- `/check-runs/116174720370/annotations`: the failure annotation only states
  `Process completed with exit code 1.`

Consequently, the child report and full logs could not be inspected. The precise
cause and runner/tooling-versus-application classification remain unresolved.
The missing-card assertion is established; an underlying application failure is
not yet reproduced. No setup or application fix is justified by this evidence.
No credential values were retrieved.

An authorized reader needs to inspect the failure location and page screenshot
in the [retained artifact](https://github.com/foxleigh81/foxyslab-website/actions/runs/38658758327/artifacts/11938695083),
then provide credential-redacted evidence of whether the page rendered an error,
an empty gallery, or cards that were unavailable at the assertion. Raw request
URLs and error text must not be copied without checking for credentials.

## Exact-head Preview and production verification

The deployments API filtered to the requested SHA returns deployment
`7080428445`. Its successful status supplies
`https://foxyslab-website-55gou1n1p-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to Vercel SSO;
this is not a tested page.

The existing same-repository credentialed workflow ran on this head and retained
the failing browser evidence. No new workflow run or PR mutation was performed.
Locally, `npm run verify:videos` exits 1 before starting a build because
`YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` are absent.
That local preflight failure does not explain the credentialed job's failure.
There are no new populated-browser, thumbnail-priority, CLS, or LCP results.
The credentialed verification acceptance criteria remain blocked.

## Local validation

This change records investigation only. There is no code change, so there is no
meaningful new automated behavior test, red/green cycle, or refactor to report.

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files passed, 305 tests passed, one skipped.
- `FLAGS_SECRET=<locally-generated-ephemeral-key> npm run test:e2e -- --workers=1 --max-failures=1`:
  exit 0; 51 passed, one skipped. These development-server checks exclude the
  populated production test. The run emitted webpack cache/watch warnings and
  expected missing-YouTube-key logs.
- `npm run verify:videos`: exit 1 at the credential preflight described above;
  no local production build or populated browser run started.
- `npx prettier --check docs/validation/videos-round-31.md` and
  `git diff --check`: exit 0.
