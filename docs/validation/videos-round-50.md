# Round 50: distinguish HTTP response markup from browser rendering

## Checkout and remote evidence

On 2026-10-15, both `git rev-parse HEAD` and the GitHub PR #79 API
reported `600116e0ab235632dc1ed5893405183a155b8ddb`. The requested branch
remains checked out. These changes are uncommitted; no push, commit, branch
operation, or rereview request was made.

Read-only GitHub API inspection confirmed job `116538043834` failed at
"Build, check populated gallery, and measure three mobile runs" on this exact
head. The supplied log identifies `selectPlaylist`'s zero-card guard in the
production smoke test, before Lighthouse. The existing minimized diagnostic
only says populated server state with zero `main article` and `main h2` matches.
It does not establish the root cause. Downloading artifact `11991005638` through
its GitHub API endpoint returned HTTP 401, so its contents were not inspected.

The deployments API for this head returned deployment `7098235849`. Its successful
Preview environment URL was
`https://foxyslab-website-jnctq1z9y-foxleighco.vercel.app`.
Requesting `/videos` returned HTTP 302 to host `vercel.com` (authentication),
not a tested gallery page.

## Investigation and change

`VideosPage` awaits request search parameters and `getLatestVideos(200)`.
Failed data renders `data-videos-state="fetch-failed"`; a successful result
exposes `empty` or `populated`. The gallery renders article/h2 cards. A successful
build therefore does not prove request-time data or successful browser rendering.
The smoke assertion originally counted only descendants of `main`, so streamed
markup elsewhere in the document was indistinguishable from absent cards.

The smoke check now parses the completed navigation response with an inert
DOMParser separately from the live browser document. Both observations return
only allowlisted state, bounded article/heading counts (inside main and across
the document), and presence of a server error template. Response bodies, template
digests, text, URLs, and exception messages are never returned by that observer.
The response is processed in memory; credentialed traces and screenshots are off.
The playlist guard still checks the observed heading count; no gallery behavior
was changed. Fixed assertion-stage identifiers identify which check was active.

The minimized failure summary now retains bounded HTTP status, initial card
counts, browser counts, and an allowlisted assertion identifier. It distinguishes
server render error markers, failed data, empty data, cards present in the response
but absent in the browser, and streamed response cards outside main. These are
observations, not proof of an upstream exception's cause. Existing raw child output
suppression, summary-only upload, and raw-report cleanup remain in effect.

## Red, green, refactor

- Initial focused invocation could not run because dependencies were absent
  (`vitest: not found`, exit 127). This is not the regression red result.
- `npm ci --no-audit --no-fund`: passed.
- Red: `npm test -- lib/__tests__/videos-fixture.test.ts lib/__tests__/verify-videos.test.ts`
  exited 1: five expected failures. The observer omitted document-wide counts and
  the server error marker; four distinct response fixtures all produced the old
  `application-render-failure` classification.
- Green: the same command passed all 33 tests after the observer and minimized
  reporting changes. Synthetic credential markers are injected into response
  markup, annotations, raw errors, and URLs. Tests check retained summary files,
  emitted errors, and captured console output for their absence, and verify only
  `summary.json` survives. Safety relies on constructing allowlisted output, not
  a common-pattern credential scan.
- Red: `npm test -- lib/__tests__/videos-browser-config.test.ts` exited 1 because
  trace configuration was `retain-on-failure`, not `off`.
- Green: `npm test -- lib/__tests__/videos-browser-config.test.ts lib/__tests__/videos-fixture.test.ts lib/__tests__/verify-videos.test.ts`
  passed 36 tests after disabling trace and screenshot recording.
- Refactor: extracted the observer's shared bounded-count function and formatted
  the touched files. The same three-file command passed all 36 tests again.
  Added an assertion that parsing the response fixture remains independent of
  the live document. The final focused rerun also passed 36 tests.

## Checks and remaining blockers

- `npm run lint`: passed.
- `npm run type-check`: passed.
- `npm test`: 37 files passed; 333 tests passed, one skipped.
- `FLAGS_SECRET=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= npm run test:e2e -- --project='Desktop Chrome' --workers=1 --retries=0`:
  26 passed. The flags value is a synthetic all-zero key. This was the regular
  development smoke suite without data credentials; production tests are excluded
  by that configuration. It is not populated-gallery acceptance evidence.
- `npm run verify:videos`: exited 1 before build, naming only missing variables
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
- `git diff --check`: passed.

Valid data credentials are unavailable in this sandbox. The authenticated
artifact is inaccessible, the Preview requires authentication, and these local
changes cannot be run remotely until the harness commits them. The existing
same-repository credentialed workflow must produce new commit-matched evidence.
No credentials were fetched or copied into the sandbox.

The precise live zero-card cause remains unresolved. Credentialed build,
populated initial cards/reserved space, footer position through hydration,
search, playlist selection, pagination, direct URLs and empty/error behavior
remain unverified here. Three production-equivalent mobile CLS/LCP pairs and
first-visible-thumbnail priority inspection remain pending. No performance
numbers, populated pass, review verdict, or merge readiness are claimed.
