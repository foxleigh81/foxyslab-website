# Round 51: wait for streamed gallery placement

## Exact-head evidence

On 2026-10-15, the GitHub PR #79 API and local checkout both reported
`7216f5bcaa9f20bc613fa9e5ee3b4d9f491a8169`. The job API confirms that job
`116547663100` failed in the credentialed verification step. The supplied
credential-safe log identifies browser smoke's initial-cards assertion:
zero cards in main, twelve in the parsed response document. Lighthouse never
ran. These observations do not establish whether the live page eventually
places those cards in main.

The deployments API for that SHA returned Preview deployment `7098685285`.
Its environment URL was
`https://foxyslab-website-6c8ummoxi-foxleighco.vercel.app`.
Requesting `/videos` returned HTTP 302 to Vercel SSO. This is not populated
page verification. No response body, credential, or authenticated session was
retained. GitHub metadata was read through the API; `gh` is unavailable.

## Repair and limits

The navigation helper previously returned at DOMContentLoaded, then the smoke
test synchronously rejected zero cards. A synthetic browser response now
reproduces delayed placement: its card starts in a hidden streamed container
outside main and moves into main after DOMContentLoaded. Before the fix,
navigation returned while both the inertly parsed response and browser DOM
had zero cards in main. This is a reproduction of the helper's timing defect,
not a credentialed reproduction of the live application or React hydration.

Default navigation now waits up to five seconds for a visible card inside main
or a visible empty/error state inside main. A placement timeout preserves the
response for existing bounded diagnostics and the zero-card failure. The
script-blocked hydration test still uses commit navigation without this wait.
Permanently misplaced cards still fail the playlist guard. No page code or
workflow configuration changed.

Minimized failure diagnostics now include bounded browser document-wide card
and heading counts alongside the existing parsed-response and main counts.
This avoids losing the browser containment comparison on a persistent failure.
Values outside the numeric allowlist become null; text and URLs are not copied.

Synthetic comparison after the fix:

| Observation | Cards in main | Cards in document |
| --- | ---: | ---: |
| Completed response parsed inertly | 0 | 1 |
| Browser after delayed placement | 1 | 1 |
| Browser with permanently misplaced cards | 0 | 1 |

## Red, green, refactor

- Red: `CHROME_PATH=/usr/local/bin/google-chrome FLAGS_SECRET=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= npm run test:e2e -- e2e/videos-streaming.spec.ts --project='Desktop Chrome' --workers=1 --retries=0`
  exited 1 at the expected assertion: rendered cards expected 1, received 0.
  The flags value is a synthetic all-zero key. The initial test used the
  installed system browser explicitly.
- Green: the same command passed the focused test after the bounded wait.
- Red: `npm test -- lib/__tests__/verify-videos.test.ts` exited 1 with four
  failures because retained diagnostics omitted the browser document counts.
  The fixtures also inject a synthetic credential into a count field, URLs,
  body text, errors, and annotations.
- Green: `npm test -- lib/__tests__/verify-videos.test.ts lib/__tests__/videos-artifact-retention.test.ts lib/__tests__/videos-fixture.test.ts lib/__tests__/videos-navigation.test.ts`
  passed 37 tests. Assertions check summaries, emitted errors, and console
  output for synthetic marker absence and confirm only summary.json survives.
  The red result concerns missing diagnostics, not a newly discovered leak.
- Refactor: named the shared settled-gallery selector and retained a type-only
  Playwright import so DOM unit tests do not load browser runtime machinery.
  Formatted the touched files. The same focused unit command passed 37 tests
  again. The focused browser command passed four tests, including persistent
  misplacement and both terminal data states. Removed the unnecessary system
  browser override before running the full desktop suite.

## Checks and remaining evidence

- `npm ci --no-audit --no-fund`: passed.
- `npm run lint`: passed.
- `npm run type-check`: passed.
- `npm test`: 37 files passed; 333 tests passed, one skipped.
- `FLAGS_SECRET=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= npm run test:e2e -- --project='Desktop Chrome' --workers=1 --retries=0`:
  30 passed, including the four synthetic browser regressions. This is the
  development smoke suite without data credentials, not populated verification.
- `git diff --check`: passed.
- `npm run verify:videos`: exited 1 before build, naming missing
  YOUTUBE_API_KEY, FOURTHWALL_STOREFRONT_TOKEN, and FLAGS_SECRET only.

Valid data credentials are unavailable here. No secrets were copied into the
sandbox. The harness must commit these changes before the same-repository
credentialed workflow can test the resulting head. The live failure's precise
cause remains unconfirmed; this patch repairs an independently reproduced
early-observation defect and preserves failures for persistent misplacement.

Credentialed build, populated browser checks, initial layout/footer stability
through actual hydration, search/filter/pagination/direct URLs and populated
empty/error behavior still need commit-matched CI evidence. Three mobile
CLS/LCP pairs, each CLS below 0.1, and the first thumbnail's priority hint remain
unverified. No LCP improvement, successful populated run, or review readiness
is claimed. No commit, push, branch change, or rereview request was made.
