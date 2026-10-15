# Round 43: exact-head credentialed verification

Checkout: `4d7915d2d1e5d8a831764cf219ee3dbe8e9a4618` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. The PR #79 API
reported the same head. The diff from the previously failing checkout
`4207282c54f9979f0518de5bcf4dd8b09f251881` changes only
`docs/validation/videos-round-42.md`; application and runner code are identical.

## Exact-head results

GitHub Actions run `38735510411`, job `116423673681`, checked out this head.
The public jobs API reports success for `npm ci`, Chromium installation,
`npm run verify:videos`, artifact upload, and the evidence-link step. The
configured verifier runs a credentialed `npm run build`, then the production
Playwright child on desktop and mobile Chromium, then three mobile Lighthouse
runs; it exits nonzero if any child fails or a mobile CLS/LCP metric is missing.
This establishes that the populated-gallery precondition and the existing
default/direct-playlist hydration test passed in that run. The retained artifact
is `11974105661`, named
`videos-verification-4d7915d2d1e5d8a831764cf219ee3dbe8e9a4618`.

The same-head CI run `38735510404` reports successful lint, type-check,
coverage, E2E, build, and general Lighthouse steps. The E2E command was
`npm run test:e2e`; the credentialed production browser command invoked by
`verify:videos` was
`node node_modules/@playwright/test/cli.js test e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts`.

The head-matched Preview deployment `7092682630` reported success and
`https://foxyslab-website-oa6a5uu0c-foxleighco.vercel.app` as its
`environment_url`. A request to its `/videos` path returned HTTP 302 to Vercel
SSO. This is not a direct page check.

## Evidence limits

The public artifact ZIP endpoint returned HTTP 401, the artifact page returned
HTTP 404 without a GitHub session, and the Actions logs endpoint returned HTTP 403. The run's workflow summary is also unavailable anonymously. Therefore
the three actual CLS and LCP values, their below-0.1 comparison, first live
thumbnail priority hint, and credential-redacted report contents cannot be
independently inspected here. The verifier checks that metrics exist, but does
not enforce CLS below 0.1. No values from another commit are substituted.
The existing focused card test verifies `fetchpriority="high"` in rendered
component markup; this is not a live-page inspection.

The earlier failing run `38732986996` on `4207282c` retained artifact
`11970883579`, but its ZIP endpoint returned HTTP 401 and its public artifact
page HTTP 404. Its exposed diagnostic is still only `line 21: failed; populated
gallery data unavailable; no rendered video cards`. That diagnostic is shared
by the initial card-count precondition and the later visibility assertion in
`e2e/videos-gallery.spec.ts`; the exact assertion, rendered CI page state, and
server-side data result are unavailable. The old failure cannot be classified
as tooling, credentials/environment, or application behavior from this
evidence. The identical-code child passes in the current credentialed run,
which does not by itself identify the earlier failure's cause.

The production browser test covers a populated playlist and its direct URL,
default/playlist initial cards and footer position across hydration, search,
empty-search and clearing. It does not exercise populated pagination or a
server-side error state. Focused unit tests cover initial URL pagination,
empty data, and loading errors. Those are distinct from populated browser
results.

## Local checks on this checkout

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0, 36 files passed, 314 tests passed, one skipped.
- `npm test -- app/videos/__tests__/page.test.tsx components/VideoCard/__tests__/VideoCard.test.tsx`: exit 0, 22 tests passed.
- `npm run verify:videos`: exit 1 at credential preflight; this sandbox lacks
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`. It did
  not build or launch a browser locally.

No application or runner code changed in this round. There is no new behavior
to drive with a red-green-refactor test. The API metadata cited above contains
no credential values; inaccessible logs and artifacts are not treated as
reviewed or credential-redacted evidence.
