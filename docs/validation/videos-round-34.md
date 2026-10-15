# Round 34: exact-head verification failure, diagnostics inaccessible

Investigated on 2026-10-15. Both the local checkout and the PR #79 API identify
head `b9a25af265c225a73a351b6edc44012cdf6a4725`.

## Credentialed job

[Run 38670701451, job 116212893212](https://github.com/foxleigh81/foxyslab-website/actions/runs/38670701451/job/116212893212)
ran this exact head. Installation and Chromium setup passed. The combined
"Build, check populated gallery, and measure three mobile runs" step failed
between 02:24:00 and 02:25:05 UTC. Report upload and linking passed.
This differs from the successful job at the preceding head recorded in round 33.

The job's known outer command is `npm run verify:videos`. Its failing child
command and precise cause remain unknown: a fresh request to the job logs API
returned HTTP 403, `Must have admin rights to Repository.` The check-run output
has no summary or text. Its failure annotation says only
`Process completed with exit code 1.` The other annotations concern runner and
Node deprecations and do not establish a cause.

The API lists unexpired
[artifact 11944606207](https://github.com/foxleigh81/foxyslab-website/actions/runs/38670701451/artifacts/11944606207),
named `videos-verification-b9a25af265c225a73a351b6edc44012cdf6a4725`.
A fresh request to its ZIP endpoint returned HTTP 401, `Requires authentication`.
The sandbox has no GitHub authentication available to retrieve this evidence
or rerun the credentialed job. No remote rerun was initiated.

Tooling-versus-application classification is **undetermined**. Neither the
combined step status nor artifact existence identifies the failed child.
The next required evidence is this job's credential-redacted command diagnostic
and retained browser report, plus any Lighthouse summaries. No speculative
runner or application correction was made.

## Preview and local verification

The deployments API filtered to the exact head returned Preview deployment
`7082207800`. Its successful status, timestamped 2026-10-15T02:24:51Z, supplies
`https://foxyslab-website-4urxkhb0o-foxleighco.vercel.app` as `environment_url`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to Vercel SSO.
This is not a tested gallery page.

Local `npm run verify:videos` exited 1 at preflight, naming missing
`YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
No credentialed local build, populated browser stage, or Lighthouse measurements
started. No credential values were retrieved or written. CLS/LCP, first-thumbnail
priority, and populated gallery behavior remain unverified for this head.

This revision changes only this evidence record. There is no meaningful new
automated behavior test or red-green-refactor cycle for the documentation change;
no red run is claimed.

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files passed, 305 tests passed, one skipped.
- `FLAGS_SECRET=<locally-generated-ephemeral-key> npm run test:e2e -- --workers=1 --max-failures=1`:
  exit 0; 51 passed, one skipped. These development-server checks exclude
  populated production verification. Expected missing-YouTube-key messages
  and webpack cache/watch warnings appeared.
- `npm run verify:videos`: exit 1 at the credential preflight described above.
- `npx prettier --check docs/validation/videos-round-34.md` and
  `git diff --check`: exit 0.
