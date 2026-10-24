# Round 18: populated verification blocked

Checked on 2026-10-14 against PR #79 head
`e2f916253ddc34c9d0aeb456dc2ab4596feede7d`. Both the local checkout and
GitHub PR API returned that exact SHA.

## Exact-head investigation

The Actions API reports that general CI run `38601881189` passed, while
[Populated Videos Verification run 38601881119](https://github.com/foxleigh81/foxyslab-website/actions/runs/38601881119)
failed. Job `115982892441` completed installation and browser setup, then
failed its combined build/browser/measurement step. Its annotations contain
only `Process completed with exit code 1`, not the underlying error.

Requests for both the run logs and job logs returned HTTP 403. The API lists
[report artifact 11915130012](https://github.com/foxleigh81/foxyslab-website/actions/runs/38601881119/artifacts/11915130012),
but its archive endpoint returned HTTP 401. The check-run output has no summary
or error text. The repository secret metadata endpoint also returned HTTP 401;
no secret values were requested or copied. These responses prevent diagnosing
the eventual CI error beyond the supplied tail. An empty key in that tail is
not enough to establish the cause of this job's eventual failure.

This is a same-repository `pull_request` run. The existing workflow already
maps `secrets.YOUTUBE_API_KEY`, `secrets.FOURTHWALL_STOREFRONT_TOKEN`, and
`secrets.FLAGS_SECRET` into the verification step. The script checks presence
before building and passes that environment to the build, server, and browser
command. There is no demonstrated missing environment forwarding to fix.
The available evidence does not establish whether the repository secrets are
configured, available, or valid for the required data. Changing their names or
adding an environment without that evidence would be speculative.

The deployments API returned Preview deployment `7071704809` for the exact
head. Its successful status, timestamp `2026-10-14T16:55:16Z`, gives
`https://foxyslab-website-pg653vz38-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to Vercel SSO.
This is not a tested populated page.

## Local checks

- `npm ci`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files passed, 298 tests passed, one skipped.
- `npm test -- lib/__tests__/verify-videos.test.ts`: exit 0; six passed.
- `npm run test:e2e -- --workers=1 --max-failures=1`: exit 1; the server
  returned `flags: Missing FLAGS_SECRET` and readiness timed out after
  60 seconds. Browser tests did not run.
- `npm run verify:videos`: exit 1 before building, naming missing
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
  No populated browser checks or Lighthouse measurements ran locally.

Only this evidence document changes. No newly identified code failure was
reproduced, so no production code or tests were changed and there is no
meaningful red-green-refactor cycle for this documentation-only update.
The passing focused tests verify existing orchestration with fixtures; they
are not production data or performance evidence.

## Remaining setup requirement

T4 remains blocked. An operator with access to the existing Actions logs and
artifact must inspect the actual failing stage and error for this exact head.
If preflight reports missing credentials, restore the named repository secrets
through the existing secret mechanism and rerun the credentialed job. If
preflight passed, use the full log and retained reports to diagnose the actual
build, populated browser, or Lighthouse failure before changing credential
wiring. Keep credential values in GitHub Actions.

The required evidence remains a successful credentialed production build,
populated browser assertions and thumbnail priority observation, and three
actual mobile CLS/LCP measurements with each CLS below 0.1. No performance
numbers or successful populated verification are claimed in this round.
