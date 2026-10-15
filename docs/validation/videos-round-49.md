# Round 49: classify missing cards without retaining raw output

Checkout and GitHub PR #79 head both verified as
`1feb58f869143691edb5ec802fae40a86aaf19b5` on 2026-10-15.
Changes described here are uncommitted sandbox changes on the requested branch;
they have not run in GitHub Actions. No commit, push, or branch operation was made.

## Inspection and change

The supplied exact-head log reaches browser smoke and fails at the initial
`selectPlaylist` call when `main h2` has zero matches. The GitHub job metadata for
job `116523200163` independently confirms this head, failure, and failed step 6.
The historical report contains no evidence distinguishing a data problem from a
render/selector problem. It cannot retrospectively establish that cause.

`VideosPage` awaits `getLatestVideos(200)`. A failed result renders the retry
state; a successful empty result reaches the gallery empty state. The gallery's
cards currently use h2 headings inside article elements. Since the route awaits
searchParams, a successful build alone does not establish request-time data.

The page now exposes only a fixed server data-state attribute. Before playlist
selection, the production browser test observes that state, bounded article and
heading counts, and HTTP status. It collects no text, bodies, request URLs, or
error details. Report interpretation replaces error-message substring inference
with these observations:

- `fetch-failed`: data-fetch-failure.
- `empty`: empty-response (the application data result, not necessarily a raw
  upstream empty response; filtering may also produce an empty list).
- `populated` with zero articles: application-render-failure.
- `populated` with articles but no h2 headings: stale-browser-assertion.
- Populated cards and headings: browser-assertion-failure.
- HTTP 5xx without a recognized data state: application-render-failure.
- Missing, malformed, or unrecognized observations: unclassified.

Counts and source locations are bounded, result statuses are allowlisted, and
at most ten failure diagnostics are emitted. Failure diagnostics are retained
in `summary.json`, which the existing workflow already uploads and prints.
Raw reports, screenshots, and traces are deleted as before. Unknown report fields
never enter the summary. No gallery behavior or selector was changed on an
unproven hypothesis. No Thomas inspection or external communication is claimed.

## Red, green, and refactor

- Red: `npm test -- lib/__tests__/verify-videos.test.ts app/videos/__tests__/page.test.tsx -t 'bounded'`
  exited 1: five missing classifications and three missing server-state markers.
- Green: the same command exited 0, eight tests passed after the implementation.
- Red: `npm test -- lib/__tests__/videos-fixture.test.ts -t 'collects only bounded'`
  exited 1 because the independently testable DOM observer was absent.
- Green: the same command exited 0 after adding and wiring the observer.
- Refactor: extracted the shared numeric bound check, simplified observer test
  imports, and replaced obsolete error-string inference expectations.
  `npm test -- lib/__tests__/videos-fixture.test.ts lib/__tests__/verify-videos.test.ts app/videos/__tests__/page.test.tsx lib/__tests__/videos-artifact-retention.test.ts`
  exited 0: 40 tests passed.

Synthetic fixtures put markers in DOM text, URL attributes, invalid state,
report errors, attachments, and extra response-body/URL fields. Tests assert
exact minimized observations, retained-file inventories, expected categories,
and marker absence from retained summaries and emitted diagnostics. This is
not merely a common-pattern credential scan. No real credentials were used.

## Checks and outstanding evidence

- `npm ci --no-audit --no-fund`, `npm run lint`, and `npm run type-check` passed.
- Final `npm test`: 37 files passed, 327 tests passed, one skipped. An earlier
  concurrent run timed out in the existing ESLint file-selection test at five
  seconds; the isolated full rerun passed without changing that test.
- `npm run test:e2e -- --project='Desktop Chrome' --workers=2` initially failed
  server readiness because FLAGS_SECRET was absent. Repeating with a synthetic
  all-zero flags key reached 15 passes and 11 failures after the local server
  stopped responding (ERR_EMPTY_RESPONSE followed by ERR_CONNECTION_REFUSED).
  This was a missing-data development run, not credentialed acceptance evidence.
- Isolated rerun:
  `FLAGS_SECRET=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= npm run test:e2e -- e2e/videos-gallery.spec.ts --project='Desktop Chrome' --workers=1 --retries=0`
  passed both ordinary videos smoke tests. The value is a synthetic all-zero
  flags key, not a repository credential; populated tests were excluded by the
  ordinary Playwright configuration.
- `git diff --check` passed.
- `npm run verify:videos` exited 1 before build, naming only the three missing
  variables: YOUTUBE_API_KEY, FOURTHWALL_STOREFRONT_TOKEN, FLAGS_SECRET.
- Exact-head deployments API returned Preview deployment `7097528523`, status
  success. Its environment_url `/videos` returned HTTP 302 to Vercel SSO without
  authentication. That redirect is not a tested page.

The sandbox has no repository data credentials or authenticated Actions CLI;
uncommitted changes cannot be reproduced by the existing remote workflow here.
The safe same-repository workflow must run after the harness commits these
changes. Its commit-keyed artifact should now retain a classified browser failure
instead of losing all evidence when smoke fails. The actual data/render cause
remains unknown until that run; missing sandbox credentials are a verification
blocker, not proof of the production cause.

Initial server cards, direct playlist/page URLs, and empty/error states are
covered by unit fixtures. Populated hydration/footer stability, search, playlist
selection, pagination, and direct URLs remain pending live verification. All
three production-equivalent mobile CLS/LCP pairs and first-thumbnail priority
inspection remain pending. No measured CLS/LCP values, populated pass, rereview
request, or merge verdict is claimed by this round.
