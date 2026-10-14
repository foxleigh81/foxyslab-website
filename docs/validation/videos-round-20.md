# Round 20: exact-head verification access blocked

On 2026-10-14, the checkout and PR #79 API both identified
`1945660724d736605b0d241233f3ebbcc8cb301e`.

## Current CI evidence

[Populated Videos Verification run 38610455771](https://github.com/foxleigh81/foxyslab-website/actions/runs/38610455771)
failed in [job 116012139925](https://github.com/foxleigh81/foxyslab-website/actions/runs/38610455771/job/116012139925).
Installation and Chromium setup passed. The combined build, browser, and
measurement step failed; report upload succeeded. Its failure annotation says
only `Process completed with exit code 1`. The check-run output has no summary
or error text.

Both the run logs endpoint and job logs endpoint returned HTTP 403,
`Must have admin rights to Repository`. The ZIP endpoint for
[artifact 11918490047](https://github.com/foxleigh81/foxyslab-website/actions/runs/38610455771/artifacts/11918490047)
returned HTTP 401, `Requires authentication`. Thus the full logs and the
previous round's new browser diagnostics remain unavailable in this sandbox.
The failing workflow command is `npm run verify:videos`; its failing child
command and root cause cannot be established from the accessible metadata.
The previous head's browser failure is not evidence of this head's exact error.

The deployments API returned Preview deployment `7073071404` for this SHA.
Its successful status supplies environment_url
`https://foxyslab-website-g8btryscg-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to Vercel SSO.
This does not constitute a populated page check.

## Local checks

- `npm ci`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files, 302 passed and one skipped.
- `npm test -- lib/__tests__/verify-videos.test.ts`: exit 0; ten passed.
- `npm run test:e2e -- --workers=1 --max-failures=1`: exit 1; the server
  reported `flags: Missing FLAGS_SECRET` and readiness timed out after
  60000 ms. No browser assertions ran.
- `npm run verify:videos`: exit 1 at credential preflight, naming missing
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
  The credentialed build, populated browser checks, and Lighthouse did not run.

## Required evidence to continue

An operator with Actions access needs to provide the failing command and
credential-redacted error from this job's full log, or the relevant failure
from its retained `browser-smoke.json`. Repository secrets must remain in
GitHub Actions. Local missing credentials do not establish that CI credentials
are missing or invalid. The underlying CI failure cannot yet be classified as
a tooling or application failure.

Only this evidence document changes. No specific implementation failure was
reproduced, so there is no meaningful automated behaviour test or
red-green-refactor cycle for this documentation-only revision. Existing focused
tests passing are not proof of populated verification. No production fix,
successful credentialed build, or CLS/LCP measurements are claimed.
