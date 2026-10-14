# Round 28: current credentialed failure remains inaccessible

Checked on 2026-10-14. The checkout and GitHub PR #79 API both identify
`0947f6b6fc208a7c197ae347b9475937216ff966`. This head has a failed credentialed
run, unlike the successful preceding-head status recorded in round 27.

## Exact-head evidence

[Run 38638529484](https://github.com/foxleigh81/foxyslab-website/actions/runs/38638529484)
and [job 116107863252](https://github.com/foxleigh81/foxyslab-website/actions/runs/38638529484/job/116107863252)
report successful checkout, Node setup, dependency installation, and Chromium
installation. The combined build, populated-browser, and three-mobile-runs step
failed. Report upload and linking succeeded. The public check annotation says
only `Process completed with exit code 1.` Its action-runtime deprecation
warning and forthcoming Ubuntu migration notice do not establish a failure cause.

Fresh GitHub REST requests returned:

- `/actions/jobs/116107863252/logs`: HTTP 403,
  `Must have admin rights to Repository.`
- `/actions/artifacts/11929587458/zip`: HTTP 401, `Requires authentication`.

These paths are relative to `/repos/foxleigh81/foxyslab-website`.
The unexpired [artifact 11929587458](https://github.com/foxleigh81/foxyslab-website/actions/runs/38638529484/artifacts/11929587458)
is named `videos-verification-0947f6b6fc208a7c197ae347b9475937216ff966`.
Its contents were not accessible. Neither the failed child command nor its
error and tooling-versus-application classification can be determined from the
available current-head metadata. A combined-step failure does not establish
whether build, browser, or Lighthouse failed.

Round 26 records this browser child for an earlier head's supplied redacted log:

```sh
node node_modules/@playwright/test/cli.js test e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts
```

That historical evidence must not be attributed to the current run. Its generic
data-unavailable diagnostic also did not distinguish navigation, missing cards,
or playlist discovery failure. No reproduced tooling defect justifies a setup
change, and no confirmed application defect can yet be handed to the next task.

## Preview and credentialed path

The deployments API filtered to this SHA returns Preview deployment `7077407126`.
Its successful status at `2026-10-14T21:14:51Z` supplies
`https://foxyslab-website-5sjulw4rr-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to Vercel SSO.
This is not a tested page.

The existing same-repository workflow already ran `npm run verify:videos` on
this head using repository-secret injection. It reports the checked-out SHA and
retains browser/Lighthouse artifacts. The production build and browser command
sequence remains documented in `videos-production-checks.md`; credential masking
is unchanged. No secret values were retrieved or copied into this workspace.

An authorized report reader needs to retrieve this run's log and artifact,
provide the redacted failing child/error and assertion location, and classify
the cause before a fix. A tooling defect then needs a focused red/green
reproduction; an application defect belongs to the following code tasks.
After resolution, retain populated-browser results and three actual mobile
CLS/LCP pairs against the resulting head, checking each CLS below 0.1 and the
emitted first-thumbnail priority hint. Selector and pagination interaction also
need explicit browser evidence. None of those measurements or acceptance
results is established by the accessible metadata here.

This revision only records fresh evidence. There is no new executable behavior,
so an automated red/green behavior test and refactor are not meaningful.

## Local checks

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files, 302 tests passed, one skipped.
- `FLAGS_SECRET=<ephemeral> npm run test:e2e -- --workers=1 --max-failures=1`:
  exit 0; 51 passed, one skipped. The flag key was generated locally. The
  development server reported no YouTube API key; these are general browser
  checks, not populated production verification.
- `npm run verify:videos`: exit 1 at credential preflight, listing missing
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
  No local credentialed build or Lighthouse run occurred. This local preflight
  failure does not diagnose the CI failure.
- `npx prettier --check docs/validation/videos-round-28.md` and
  `git diff --check`: exit 0.
