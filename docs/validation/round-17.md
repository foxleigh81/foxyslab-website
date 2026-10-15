# Round 17 verification evidence

Checked 2026-10-14 against PR #79 head
`e07a18aaf173af41b6b8f1e67f5336608258e59e` (also the local HEAD).

## E2E diagnosis and scoped change

The supplied CI tail shows 18 failures, including `page.goto` in navigation
and form setup. Downloading job `115958455049` logs returns HTTP 403;
artifact `11913052298` returns HTTP 401. Check annotations contain only the
exit code, not the individual errors. The exact cause of every CI failure
cannot be established from that evidence.

Local reproduction used the installed Chromium/WebKit browsers and a randomly
generated, ephemeral local flags encryption key, without YouTube or Fourthwall
credentials. The original suite reproduced iPhone homepage accessibility and
skip-link failures waiting for `page.goto`'s default `load` event. It was stopped
after those failures (exit 130; 34 passed, 2 failed, 14 not run), rather than
waiting through further retries. A separate WebKit probe observed
`DOMContentLoaded` and the visible homepage heading while navigation timed out
with this request still pending:
`/_next/image?url=%2Fimages%2Ffoxys-lab-logo-round.webp&w=384&q=75`.
This identifies a smoke-test readiness dependency on image completion; it does
not establish the underlying image optimizer delay or explain all CI failures.

The smoke tests now use a shared `gotoPage` helper that waits for
`domcontentloaded`. Accessibility audits explicitly wait for React hydration
and a visible heading instead of global network idle. Existing form/menu
hydration waits and assertions remain. Production gallery layout/image checks
and Lighthouse are unchanged, so this does not relax performance acceptance.
No application code, workflow, or credentials changed.

## Red, green, and refactor

Added a browser regression that holds optimized image requests open, checks
that the homepage DOM remains usable, then releases the requests in cleanup.

With the already-running local server, RED command:

```sh
CI= PLAYWRIGHT_BROWSERS_PATH=/opt/playwright-browsers npm run test:e2e -- e2e/navigation.spec.ts --grep 'optimized image' --project='Desktop Chrome' --retries=0 --reporter=line
```

Observed exit 1: navigation timed out after 5000ms waiting for `load`.
Changing that navigation to wait for `domcontentloaded` made the same command
exit 0: one passed. No historical red run is claimed.

Refactored that readiness policy into `e2e/helpers.ts` and migrated the general
smoke suites. Refactor rerun on both browsers:

```sh
FLAGS_SECRET=$(node -e 'process.stdout.write(require("crypto").randomBytes(32).toString("base64url"))') PLAYWRIGHT_BROWSERS_PATH=/opt/playwright-browsers npm run test:e2e -- e2e/navigation.spec.ts --grep 'optimized image' --workers=1 --retries=0 --reporter=line
```

Exit 0: two passed. The generated key is solely a local test prerequisite,
not a repository secret or a live-data credential.

## Exact-head populated verification

GitHub deployments API returned deployment `7070570116` for the exact head.
Its successful status names
`https://foxyslab-website-18dgzlgl4-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to Vercel SSO.
This is not a tested populated Preview.

The existing same-repository credentialed workflow ran for that exact head:
<https://github.com/foxleigh81/foxyslab-website/actions/runs/38594748741>.
The jobs API reports success for the build/browser/three-measurement step and
report publication. Its actual report is:
<https://github.com/foxleigh81/foxyslab-website/actions/runs/38594748741/artifacts/11908474052>.
Downloading this artifact also returns HTTP 401 in the sandbox. No CLS/LCP
numbers, visible-card observation, or thumbnail priority result is claimed
from the green job status. Reviewers with artifact access must inspect those
reports. The existing workflow will verify the harness-published revision.

## Local checks

- `npm ci`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files passed, 298 tests passed, one skipped.
- Full E2E command below: exit 0; 51 passed, one skipped in 1.8 minutes,
  with no retries. The skip is the desktop-only navigation test on mobile.
- `npm run verify:videos`: exit 1 at credential preflight; missing
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
- `npm run build`: exit 1 after successful compilation; prerendering failed
  with `flags: Missing FLAGS_SECRET`. This was not a credentialed build.
  Removed only the generated sitemap timestamp changes from this attempt.
- Prettier checks on the changed files and `git diff --check`: exit 0.

```sh
FLAGS_SECRET=$(node -e 'process.stdout.write(require("crypto").randomBytes(32).toString("base64url"))') PLAYWRIGHT_BROWSERS_PATH=/opt/playwright-browsers npm run test:e2e -- --workers=1 --retries=0 --reporter=line
```

These are credential-free smoke checks, including the empty videos state;
they are not populated production performance verification.
