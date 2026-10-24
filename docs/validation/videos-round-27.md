# Round 27: exact-head evidence access

Checked on 2026-10-14. Local HEAD and the GitHub PR #79 API both identify
`4e8470f5ddc215f34ecb8d22c2b361f1ebe58f1c`. The requested diagnosis and measured
acceptance checks remain blocked by report access; they are not complete.

## Failed browser command and diagnosis

The retained failure is from
[job 116089205352](https://github.com/foxleigh81/foxyslab-website/actions/runs/38633041118/job/116089205352),
on the preceding head `55714e64751f5690c2c61320580bc2ef9c1268e6`.
Round 26 records the supplied redacted tail and resolves the failing child as:

```sh
node node_modules/@playwright/test/cli.js test e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts
```

Fresh requests to `/repos/foxleigh81/foxyslab-website/actions/jobs/116089205352/logs`
returned HTTP 403, `Must have admin rights to Repository.` Requests to
`/repos/foxleigh81/foxyslab-website/actions/artifacts/11926323166/zip` returned
HTTP 401, `Requires authentication`. The full log and retained
`browser-smoke.json` were therefore not inspected in this round.

The existing summary's line 21 is the test declaration, not the failed assertion.
Its data-unavailable message can represent navigation failure, playlist discovery
failure, or an absent visible card. The precise cause and tooling-versus-application
classification remain unresolved. The later successful run does not diagnose this
failure. There is no confirmed application defect to hand off or evidence to
justify changing the runner.

## Current-head verification

The exact-head
[credentialed run 38635813917](https://github.com/foxleigh81/foxyslab-website/actions/runs/38635813917)
has a successful conclusion. The jobs API reports that job `116098576234`
completed its combined build/browser/three-mobile-runs step, report upload, and
report linking successfully. These are workflow statuses, not inspected build,
browser, or measurement reports.

Its unexpired
[artifact 11928002298](https://github.com/foxleigh81/foxyslab-website/actions/runs/38635813917/artifacts/11928002298)
is named `videos-verification-4e8470f5ddc215f34ecb8d22c2b361f1ebe58f1c`.
Its ZIP endpoint also returned HTTP 401, `Requires authentication`.

The deployments API filtered to this SHA returned Preview deployment
`7077017309`. Its successful status supplies this environment URL:
`https://foxyslab-website-90972krn3-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to Vercel SSO.
The Preview was not a tested page.

Consequently, populated desktop/mobile footer stability, search, direct playlist
URLs, empty/error behavior, and emitted first-thumbnail priority remain
unverified here. Playlist selection and pagination also need explicit browser
results: the production smoke currently discovers a playlist and navigates to
its URL, but does not click the playlist selector or pagination controls.
No current-head CLS/LCP pairs are available to record, and no CLS threshold is
claimed. The ticket baseline remains CLS 0.511 on each run, with LCP 3.8, 4.3,
and 11.8 seconds.

## Required evidence handoff

An authorized Actions report reader needs to provide the credential-redacted
failed test's project, error, assertion/navigation location, and page context
from artifact `11926323166`. Route a confirmed rendering/data-loading defect to
the gallery application task, credential/source-data problems to the data owner,
or a confirmed navigation/setup defect to verification tooling. Classification
must follow the actual error, not the generic summary.

Read current-head artifact `11928002298` for the populated build/browser results,
first-thumbnail priority, and all three mobile CLS/LCP pairs, with each CLS below
0.1. Supplement the existing smoke with observed selector and pagination checks.
The credentialed workflow has already run on the requested head; another green
status cannot replace these reports. No repository secrets were copied locally.

This revision changes only this evidence note. There is no new executable
behavior, so a red/green behavior test or refactor would not be meaningful.

## Local checks

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files, 302 tests passed, one skipped.
- `FLAGS_SECRET=<ephemeral> npm run test:e2e -- --workers=1 --max-failures=1`:
  exit 0; 51 passed, one skipped. The flag key was generated locally; the
  development server reported no YouTube API key. These are general browser
  checks, not populated production verification.
- `npm run verify:videos`: exit 1 at credential preflight, naming missing
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
  No local credentialed build or Lighthouse measurement ran. This local
  preflight failure does not explain the prior CI browser failure.
- `npx prettier --check docs/validation/videos-round-27.md` and
  `git diff --check`: exit 0.
