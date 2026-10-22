# T4 task 2, revision 2: verification evidence

Inspected on 2026-10-22 at local source HEAD
`aa7b8815f0ee5409d94e0570d9480a042939651d`, with an initially clean tree on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. This matches the
brief's previous checked head. The live PR head was not queried; these results
do not verify the future harness commit. This record supersedes older task-2
dispositions for this revision only.

## Populated verification is blocked

The supplied current-head failure list is empty. The inspected
[task-1 handoff](videos-t4-task-1-round-1.md) and supplied evidence contain no
approved immutable saved-data source, executable private route or independent
exact-head approval receipts. The existing `scripts/lib/verify-videos.mjs`
builds and serves the application, checks browser behavior and collects three
mobile Lighthouse runs, but has no saved-source input. Its live producers use
Google and Fourthwall origins outside this sandbox's permitted network.

No credentialed verifier invocation or populated build was attempted. No
sanitized production summary or measurement report links were generated. This
is a blocked observation, not a verifier failure or a reproduced website defect.
No website repair is supported by the available evidence.

The ticket's recorded live baseline remains CLS 0.511 on all three mobile
runs, paired with first-thumbnail LCP of 3.8, 4.3 and 11.8 seconds. These are
historical 2026-10-12 readings, not measurements of this source SHA. No
retrospective baseline run is needed.

| Ticket criterion | Status | Evidence and remaining work |
| --- | --- | --- |
| Initial cards or reserved layout; footer stable through hydration | Blocked on approved saved data | The existing synthetic populated initial-layout regression passes (10 tests). It does not observe saved-data HTML or footer position through hydration on a production build. |
| Search, playlist filtering, forward/back pagination and direct playlist URLs | Blocked for populated production behavior | Local fixture coverage is not an observation of the approved production-shaped dataset. Run the existing browser verifier once the route and receipts exist. |
| Separately identified empty/error states | Observed in synthetic unit fixtures; production verification blocked | Focused tests explicitly cover `empty` and `fetch-failed`. These must remain distinct from populated acceptance evidence. |
| Three mobile CLS values below 0.1, each paired with numeric LCP | Blocked | No Lighthouse runs or measurements collected. No LCP improvement is claimed. |
| First-thumbnail priority hint | Blocked for emitted production HTML | Source inspection finds `priority={index === 0}` in the gallery and `fetchPriority` in the card. This is not inspection of the emitted hint on the required build. |
| Focused regression, lint, type-check, unit/E2E tests and valid-credential build | Local results below; populated portion blocked | Synthetic regression and local checks cannot establish a valid-credential saved-data build. |
| Live API integration after deployment | Deferred post-deployment obligation | Eligible only after an independently authorized Production revision containing the change is identified. Its absence is not a pre-release readiness blocker. |

## Local checks

Commands ran directly in this sandbox against the source SHA above:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0,
  987 packages installed; configuration, deprecation and install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 346 tests passed, 1 skipped.
- `npm test -- app/videos/__tests__/page.test.tsx`: exit 0; 10 tests passed.
- `FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc npm run test:e2e -- --max-failures=1 --workers=1 --reporter=line`:
  exit 0; 71 passed, 5 skipped, across desktop Chromium and iPhone WebKit.
  The flag secret is the existing synthetic CI value. The development server
  reported no YouTube API key; production-tagged checks are excluded by this
  configuration. These are smoke/fixture results, not populated acceptance.
- `git diff --check`: exit 0.

Vitest emitted its configuration-loader compatibility warning. The development
server emitted webpack cache and `/work` watcher permission warnings without
failing the browser run. This revision
changes documentation only, so there is no meaningful automated behavior test
for a red-green-refactor cycle. No red run, implementation fix or refactor is
claimed.

## Continuation

Marcus needs the approved dataset identity/digest and coverage, immutable
private controller and executable ingestion route, exact-head independent
approval, and private artifact access/retention/cleanup receipts before the
credentialed run. Studio must bind sanitized results and report references to
the then-live SHA and rerun affected checks after a head change. Any reproduced
website behavior failure needs a separately scoped test-first repair by Thomas.
Ashley's and Macklin's independent review blocks remain unresolved. Dispatcher
research belongs outside this website checkout. Release readiness remains no.

The prerequisite task is the only actionable stage until its receipts are
validated. Populated verification depends on those receipts; a repair depends
on a reproduced website defect and requires verification of the changed head.
The post-deployment check depends separately on an authorized Production
revision. These are continuation requirements, not a claim that this checkout
changes or enforces the external scheduler's persisted plan or selection trace.
No scheduler interface or validated setup receipts were supplied for this run.
