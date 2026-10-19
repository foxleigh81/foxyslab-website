# Task 5 measurement attempt, revision round 7

Checked on 2026-10-19 at checkout
`752d8f34eba8993a914bb7d9ca9451e78650cd7e` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`.
The working tree was clean before validation. Node was `v24.21.0` and npm
was `11.19.0`. This round changes only this record; it does not establish
verification of the later harness-created commit or the live PR head.

## Local checks

| Command | Observed result |
| --- | --- |
| `npm ci --cache /work/repo/.npm-cache` | Exit 0; 987 packages installed. npm reported 39 dependency vulnerabilities (2 low, 10 moderate, 25 high, 2 critical). |
| `npm run lint` | Exit 0 on rerun. The first invocation exited 2 because this run moved its temporary npm cache while ESLint was scanning it. The cache now resides under ignored `.lighthouseci/local-round-7/`. |
| `npm run type-check` | Exit 0. |
| `npm test` | Exit 0; 38 files passed, 343 tests passed, 1 skipped. |
| `npm test -- app/videos/__tests__/page.test.tsx components/VideoGallery/__tests__/VideoGallery.test.tsx components/VideoCard/__tests__/VideoCard.test.tsx` | Exit 0; 49 tests passed across 3 files. Includes initial rendering, empty/error states, gallery interactions and thumbnail priority. |
| `npm run verify:videos` | Exit 1 before building: `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` are absent. |

`FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc npm run test:e2e -- --workers=1 --retries=0`
exited 0: **71 passed, 5 skipped** in 4.2 minutes across Desktop Chrome and
iPhone 14. Output is retained locally at
`.lighthouseci/local-round-7/e2e.log`; the local HTML report is
`playwright-report/index.html`. The command redirected output to that log,
printed its final 65 lines and preserved the Playwright exit code.
The browser suite uses this public synthetic `FLAGS_SECRET` solely to let the
local development server render. No live data credentials were supplied.
The server reported the missing YouTube key and nonfatal filesystem-watcher
and webpack cache warnings. These development-server and fixture results do
not establish populated production behavior; the regular configuration
excludes the dedicated `@production` checks.

No production code or test behavior changed. This documentation-only measurement
task has no meaningful red-green-refactor cycle; the passing existing focused
tests are regression evidence, not an observed TDD red run.

## Production measurements remain unavailable

The credential preflight failed before build, populated browser checks or
Lighthouse. The sandbox permits network access only to GitHub and package
registries, excluding the live data and image origins. No credentials were
retrieved, no credentialed job was dispatched, and no CI or approval-boundary
configuration was changed.

| Mobile run | Production CLS | Production LCP | Emitted first-thumbnail hint |
| --- | --- | --- | --- |
| 1 | Not measured | Not measured | Not observed |
| 2 | Not measured | Not measured | Not observed |
| 3 | Not measured | Not measured | Not observed |

Retain the ticket's live 2026-10-12 baseline: CLS **0.511 on each of three
runs**, with corresponding LCP **3.8, 4.3 and 11.8 seconds**. No retroactive
baseline was requested. Local fixture tests do not supply production CLS/LCP
measurements or prove a fixed network-dependent LCP improvement. The passing
thumbnail unit test verifies the priority contract against mocked data, not
the emitted hint on a populated production build.

## Remaining release evidence

On the resulting exact committed head, an independently approved runner with
valid build-time credentials and live-origin access must complete lint,
type-check, unit and E2E checks plus the production-equivalent build. The
existing `npm run verify:videos` path must complete its populated browser
checks and record three mobile CLS/LCP pairs, each CLS below 0.1, with the
build head and observed first-thumbnail hint. Retain the report artifact links
in CI output. Generic CI success and fixture browser results cannot replace
that evidence. Independent security and QA verdicts remain separate; this
local record asserts neither approval nor release readiness.
