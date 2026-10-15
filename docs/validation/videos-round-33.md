# Round 33: successful exact-head job, report access still blocked

Investigated PR #79 head `9139b5a92709419e1288bc6adc691599e81bcb1b`
on 2026-10-15. The local checkout and GitHub job API identify this SHA.

## Current-head evidence

[Run 38668942352, job 116207217602](https://github.com/foxleigh81/foxyslab-website/actions/runs/38668942352/job/116207217602)
reports success, including its combined credentialed build, populated browser,
and three-mobile-run step. Report upload and linking also succeeded. This is
new evidence compared with round 32, but a successful status alone does not
establish the requested populated behavior or measurements.

The API lists unexpired
[artifact 11942114154](https://github.com/foxleigh81/foxyslab-website/actions/runs/38668942352/artifacts/11942114154),
named `videos-verification-9139b5a92709419e1288bc6adc691599e81bcb1b`.
Fresh requests returned HTTP 403 (`Must have admin rights to Repository.`)
for the job logs and HTTP 401 (`Requires authentication`) for its artifact ZIP.
The public run page requires sign-in for logs and exposes no measurement
summary. The check-run output has no summary or text; its two annotations
concern runner/Node deprecations, not browser results.

Consequently, no desktop/mobile footer positions, playlist selection,
pagination, direct URL, search, empty/error outcomes, first-thumbnail priority
hint, or CLS/LCP pairs could be extracted. These remain unverified here.
An authorized reader must provide the credential-redacted browser report and
three run summaries from this artifact before these criteria can be closed.

## Earlier failed job

The job API confirms that
[job 116180898464](https://github.com/foxleigh81/foxyslab-website/actions/runs/38660675562/job/116180898464)
failed on checkout `4c653ac5aaf5409172d6858a6add95268aef8500`.
Its logs still return HTTP 403; downloading retained artifact `11938837238`
still returns HTTP 401. The known outer command is `npm run verify:videos`.
The failing child command, precise cause, and tooling-versus-application
classification remain unknown for that job. Success on the newer head does
not explain this earlier failure. No speculative script or application fix
is justified without the failed child output and retained browser report.

## Preview and local checks

The deployments API filtered to the requested SHA returned deployment
`7081941937`, whose successful status supplies
`https://foxyslab-website-f575rx0sm-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to Vercel SSO.
This is not a tested page.

Local `npm run verify:videos` exited 1 at preflight because `YOUTUBE_API_KEY`,
`FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` are absent. No local
credentialed build, populated browser test, or Lighthouse run started. No
credential values were retrieved or persisted. The successful remote job was
already present; this revision did not initiate another run.

This revision changes only this evidence record. There is no meaningful new
automated behavior test, red/green cycle, or refactor for a documentation-only
change; no historical red run is claimed.

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files passed, 305 tests passed, one skipped.
- `FLAGS_SECRET=<locally-generated-ephemeral-key> npm run test:e2e -- --workers=1 --max-failures=1`:
  exit 0; 51 passed, one skipped. These development-server checks exclude
  populated production verification. Expected missing-YouTube-key messages
  and webpack cache/watch warnings appeared.
- `npm run verify:videos`: exit 1 at the credential preflight described above.
- `npx prettier --check docs/validation/videos-round-33.md` and
  `git diff --check`: exit 0.
