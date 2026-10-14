# Round 25: exact-head verification evidence

Checked on 2026-10-14. The clean checkout and PR #79's public `headSha` are
both `4231e02756385f0310659a1971be70c2da419819`.

## Failed credentialed job

[Job 116012139925](https://github.com/foxleigh81/foxyslab-website/actions/runs/38610455771/job/116012139925)
ran on older head `1945660724d736605b0d241233f3ebbcc8cb301e`. Its public job
page shows installation and Chromium setup succeeded, then the combined
`Build, check populated gallery, and measure three mobile runs` step failed.
The step invokes `npm run verify:videos`; that runner sequentially invokes
`npm run build`, the populated Playwright smoke command, and three Lighthouse
commands. The public page does not disclose which child failed.

The step's full-log URL returned HTTP 404 without an authenticated Actions
session. The REST job-log endpoint returned HTTP 403 due to the proxy's shared
GitHub API rate limit. No authorized, redacted full log or failure report is
available in this sandbox. Thus the exact failing child command and cause are
**unknown**, and a tooling-versus-application classification would be a guess.
The local missing-credential preflight is not evidence of the CI failure.

## Populated results on the reviewed head

The public checks page shows a successful `Credentialed Videos Build and
Measurements` [job 116079526471](https://github.com/foxleigh81/foxyslab-website/actions/runs/38630188698/job/116079526471)
on the exact reviewed head. Its [run 38630188698](https://github.com/foxleigh81/foxyslab-website/actions/runs/38630188698)
lists retained artifact `11925932997`, named
`videos-verification-4231e02756385f0310659a1971be70c2da419819` (1.31 MB).
The artifact ZIP API is rate-limited here. Public HTML exposes the success
status and artifact name, but not the browser report or mobile metrics. These
statuses do not establish the actual footer positions, first-thumbnail
`fetchpriority`, or CLS/LCP values.

The previously identified exact-head Preview deployment `7075502825` uses
`https://foxyslab-website-bxh8omxp8-foxleighco.vercel.app`. `/videos` redirects
to Vercel SSO; the proxy cannot reach that login endpoint. This is not a tested
populated page. No desktop/mobile hydration, playlist-selection, pagination,
or Lighthouse observation can be made from this sandbox. The production smoke
test covers default and direct-playlist layouts, search and empty search, but
does not click the playlist selector or pagination. Its success alone does not
close those interaction checks.

The ticket's three baseline mobile runs remain CLS 0.511 each, with LCP 3.8,
4.3, and 11.8 seconds. No new CLS or LCP measurement, threshold claim, or
network-dependent LCP improvement is asserted.

## Required next evidence

An operator with authorized Actions access must read the credential-redacted
full log or failure artifact for job `116012139925`, record the failing child
command and error, and classify it. Route an application/build failure to the
relevant code task; fix the runner only for a verified tooling failure. Read
exact-head artifact `11925932997` and record the desktop/mobile footer and
direct-URL results, the first thumbnail's emitted priority hint, and all three
CLS/LCP pairs. Run a populated browser check that also selects a playlist and
paginates forward/back. Confirm each mobile CLS is below 0.1. Keep credential
values out of the notes and artifacts.

This revision records evidence only. It changes no application or verification
behavior, so there is no meaningful automated behavior test or red-green-
refactor cycle for this documentation change.

## Local checks

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 302 passed, one skipped.
- `ALLOW_MISSING_API_KEYS=true FLAGS_SECRET=<ephemeral> npm run build`: exit 0
  on an isolated rerun. This checks compilation only, not populated data.
- `FLAGS_SECRET=<ephemeral> npm run test:e2e -- --workers=1 --max-failures=1`:
  exit 0; 51 passed, one skipped. The development server had no YouTube key,
  so these are not populated-browser results.
- `npm run verify:videos`: exit 1 at the credential preflight, before build or
  browser execution. Missing variables were `YOUTUBE_API_KEY`,
  `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.

An earlier local build attempt overlapped with the E2E development server and
failed on a shared `.next` manifest; its isolated rerun above passed. The
first local E2E attempt also used an invalid temporary flag key and was stopped
before tests ran. Neither local setup mistake identifies the older CI job's
failure.
