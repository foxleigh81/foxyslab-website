# Round 35: successful exact-head job, reports still inaccessible

Investigated on 2026-10-15. Local `git rev-parse HEAD` and the PR #79 API both
identify `12bda7915fd63f015d5ca86e51bf5e5196134d32`.

## Exact-head credentialed verification

[Run 38678573850, job 116237677325](https://github.com/foxleigh81/foxyslab-website/actions/runs/38678573850/job/116237677325)
reports success at this exact head. The combined build/browser/measurement step
ran from 03:54:12 to 03:56:24 UTC; report upload and linking also succeeded.
This is a new successful run, not a diagnosis of the preceding failed run.

The API lists unexpired
[artifact 11947831770](https://github.com/foxleigh81/foxyslab-website/actions/runs/38678573850/artifacts/11947831770),
named `videos-verification-12bda7915fd63f015d5ca86e51bf5e5196134d32`.
Its ZIP endpoint returned HTTP 401, `Requires authentication`. The job logs
endpoint returned HTTP 403, `Must have admin rights to Repository.` The check-run
output has null summary and text. The public run page says to sign in to view
logs and did not expose the measurements. No report contents were retrieved.

Consequently, the successful job status does not establish inspected populated
desktop/mobile results, the three CLS/LCP pairs, or the emitted first-thumbnail
priority hint. Those remain unverified here; no values are inferred from a badge.

## Earlier failed child remains unidentified

Fresh requests for the evidence recorded in round 34 returned:

- Failed job `116212893212` logs: HTTP 403,
  `Must have admin rights to Repository.`
- Failed run artifact `11944606207` ZIP: HTTP 401, `Requires authentication`.

That failure belongs to checkout `b9a25af265c225a73a351b6edc44012cdf6a4725`,
[run 38670701451](https://github.com/foxleigh81/foxyslab-website/actions/runs/38670701451).
The known outer command is `npm run verify:videos`. The precise failing child,
error, cause, and tooling-versus-application classification remain **undetermined**.
An access failure while retrieving evidence is not the cause of the original
credentialed job failure. No speculative runner or application fix was made.

## Preview and browser coverage

The exact-head deployments API returned Preview deployment `7083424917`.
Its successful status, timestamped 2026-10-15T03:54:57Z, supplies
`https://foxyslab-website-cqmfdqwqw-foxleighco.vercel.app` as `environment_url`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to Vercel SSO.
This was not a tested gallery page.

Inspection of `e2e/videos-gallery.spec.ts` confirms the production test checks
default and direct-playlist cards before/after hydration, footer displacement,
search, clearing empty results, and accessibility. Its `selectPlaylist` helper
chooses a slug from option metadata; it does not interact with the dropdown.
The test does not click pagination controls or inspect the emitted thumbnail
priority hint. Therefore even a retrieved passing report for this test would
not close those additional browser checks. Unit coverage is not a substitute
for the requested populated-browser observations.

The remaining evidence needed is the earlier job's credential-redacted child
diagnostic and retained browser report, plus this head's browser report and
three Lighthouse summaries. An authorized populated browser must also exercise
playlist selection and forward/back pagination and inspect the first thumbnail.
No GitHub authentication or build-time data credentials are available in this
sandbox. No remote rerun was initiated and no credential values were retrieved.

## Local checks

This revision changes only the verification record. There is no meaningful
automated behavior test or red-green-refactor cycle for this documentation
change; no red run, code fix, or refactor is claimed.

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files passed, 305 tests passed, one skipped.
- `FLAGS_SECRET=<locally-generated-ephemeral-key> npm run test:e2e -- --workers=1 --max-failures=1`:
  exit 0; 51 passed, one skipped. These development-server tests exclude the
  populated production check. Expected missing-YouTube-key messages and webpack
  cache warnings appeared.
- `npm run verify:videos`: exit 1 before build/browser/Lighthouse, naming missing
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
  This local preflight failure does not diagnose the earlier credentialed job.
- `npx prettier --check docs/validation/videos-round-35.md` and
  `git diff --check`: exit 0.
