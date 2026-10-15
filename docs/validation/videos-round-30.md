# Round 30: exact-head failure evidence remains restricted

Checked on 2026-10-15 against requested PR #79 head
`207f921d26723ffccdeb535615f48e7e7426ff48` (also the local checkout).

## Failed credentialed job

The GitHub Actions API identifies [run 38649543892](https://github.com/foxleigh81/foxyslab-website/actions/runs/38649543892)
and [job 116144647649](https://github.com/foxleigh81/foxyslab-website/actions/runs/38649543892/job/116144647649)
for this exact head. Dependency installation and Chromium installation passed.
The combined build, populated-gallery, and three-mobile-runs step failed.
Report upload and report linking passed. The failure annotation says only
`Process completed with exit code 1.`

Fresh requests for `/actions/jobs/116144647649/logs` returned HTTP 403
(`Must have admin rights to Repository.`). Downloading
`/actions/artifacts/11934361599/zip` returned HTTP 401
(`Requires authentication`). The API lists the
[retained report artifact](https://github.com/foxleigh81/foxyslab-website/actions/runs/38649543892/artifacts/11934361599)
as unexpired, with size 666988 bytes, but its contents could not be inspected.

The outer command is `npm run verify:videos`. The failed child command, precise
cause, and runner/tooling-versus-application classification are **unresolved**
for this head. The previous round's browser diagnostic is not evidence of the
current failure. Neither an artifact's existence nor successful report upload
proves populated checks or measurements passed. No setup or application change
is justified by the currently accessible evidence.

## Preview and remaining evidence

The deployments API filtered to the requested SHA returns deployment
`7079074807`. Its successful status supplies environment URL
`https://foxyslab-website-laxu6u23y-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returns HTTP 302 to Vercel SSO.
This is not a tested page.

The existing same-repository credentialed workflow already ran on this head.
Its production-equivalent build/browser/Lighthouse path remains unchanged.
An authorized report reader must supply the credential-redacted failing child
output and, if the browser child failed, the relevant `browser-smoke.json`
failure details. Round 29's formatter distinguishes navigation failure, missing
cards, and missing populated playlist matches; inspect that diagnostic before
choosing a fix. Raw report errors and attachments must be reviewed for
credential-bearing content before sharing.

No new CLS/LCP values, thumbnail-priority result, or successful credentialed
build can be established here. Local `npm run verify:videos` exits 1 at the
credential preflight, naming `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`,
and `FLAGS_SECRET`; it does not start the build or browser. This local absence
does not diagnose the CI failure. No credential values were retrieved.

## Local validation

This revision records investigation only. There is no code change and no
meaningful new automated behavior test, red/green cycle, or refactor to report.
Existing configured checks were run; results are recorded below.

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files passed, 305 tests passed, one skipped.
- `FLAGS_SECRET=<locally-generated-ephemeral-key> npm run test:e2e -- --workers=1 --max-failures=1`:
  exit 0; 51 passed, one skipped. These are development-server checks without
  YouTube data credentials, not populated production verification. The run
  emitted webpack cache/watch warnings and expected missing-YouTube-key logs.
- `npm run verify:videos`: exit 1 at the missing-credential preflight described
  above. Credentialed build and populated-browser verification remain blocked.
- `npx prettier --check docs/validation/videos-round-30.md` and
  `git diff --check`: exit 0.
