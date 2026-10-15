# Round 16 verification evidence

Checked on 2026-10-14. The local checkout and GitHub PR API both reported
draft PR #79 head `f8315dd2d6daf209bfd30c0965977ef2dd8b5890`.

## Failure investigation and change

The supplied job log for run `38591791901`, job `115948267562`, shows the
credentialed build and populated browser smoke command succeeding, followed
by Lighthouse 1 failing after approximately 26 seconds. It contains no
Lighthouse error detail. The artifact API lists artifact `11907338862`, but
downloading it returns HTTP 401; downloading job logs returns HTTP 403.

The Lighthouse command passed only `--headless`. Unlike Playwright's default
Chromium launch, it did not pass `--no-sandbox`. The installed Chrome Launcher
disables the setuid sandbox on Linux and polls for a debugging connection
50 times at 500 ms intervals. A host without usable unprivileged user
namespaces can therefore fail before Lighthouse produces any report. The
timing and the successful Playwright launch are consistent with this cause;
they do not prove it without the suppressed error or a successful CI rerun.

The verification command now passes `--headless --no-sandbox`, matching the
smoke browser's sandbox policy on the ephemeral runner. A focused test checks
the launch arguments for all three measurements. Application code, workflow,
credentials, mobile throttling, and report generation are unchanged.

Local browser reproduction was blocked: Playwright's Chromium download
returned HTTP 403 (`host not on the allowlist`). An exploratory browser
obtained from the npm registry could not execute on this ARM sandbox
(missing x86-64 ELF loader). Neither attempt produced performance evidence.

## Exact-head Preview

The deployments API returned Preview deployment `7070094872` for the exact
head. Its successful status gives environment URL
`https://foxyslab-website-jih207sfw-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to
`https://vercel.com/sso-api`. This is not a tested populated Preview.

The existing same-repository credentialed workflow must run against the
harness-published revision. Its reports are required to confirm the launch
fix, visible cards, first-thumbnail priority, and three actual mobile CLS/LCP
measurements. No new measurement or successful CI result is claimed here.
The prior artifact is linked at
<https://github.com/foxleigh81/foxyslab-website/actions/runs/38591791901/artifacts/11907338862>.

## Local checks

- `npm ci`: exit 0.
- RED: `npm test -- lib/__tests__/verify-videos.test.ts`: exit 1;
  five passed, one failed because `['--headless']` lacked `--no-sandbox`.
- GREEN: the same command after the launch flag change: exit 0, six passed.
- Refactor review: the one-argument fix needed no structural refactoring.
  Added a short rationale comment and reran the same command: exit 0,
  six passed.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files passed, 298 tests passed, one skipped.
- `npx prettier --check scripts/lib/verify-videos.mjs lib/__tests__/verify-videos.test.ts`:
  exit 0.
- `npm run test:e2e -- --workers=1 --max-failures=1`: exit 1;
  server readiness timed out after 60 seconds with `flags: Missing FLAGS_SECRET`.
- `npm run verify:videos`: exit 1 at preflight, missing `YOUTUBE_API_KEY`,
  `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
- `npm run build`: first attempt exited 137 while other checks ran;
  isolated rerun exited 1 after successful compilation because prerendering
  requires the missing `FLAGS_SECRET`. This was not a credentialed build.

The focused test uses fixture metrics to test orchestration; those numbers
are not measurements of the website. The credentialed build and browser
acceptance criteria remain pending CI. No credentials were copied locally,
and no commit, push, branch change, or PR mutation was performed.
