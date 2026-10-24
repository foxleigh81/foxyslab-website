# Task 2 of 3, T3 revision round 2: exact-head verification

Recorded 2026-10-23 UTC against local HEAD
`8111abfec45ca529376beb9f48f30180fead5f08`. A fresh public GitHub
`GET /pulls/79` reported an open draft PR with this same head and base `main`.
The supplied current exact-head failure list was empty. No website behavior
failure was reproduced. This record does not describe a later harness commit.

## Evidence boundary

The sandbox has no `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN` or
`FLAGS_SECRET` (name-only presence check). No data-owner-approved populated
saved-video source, immutable digest, build/runtime loading route, or independent
credential clearance was supplied. The existing verifier consumes live API data,
not a saved-data input. No populated production build or approved data digest
can be bound to this head. `npm run verify:videos` exited 1 at credential
preflight, before a build, server, browser run, or Lighthouse measurement.

| Ticket criterion | Result at this head |
| --- | --- |
| Initial populated cards or stable reserved layout; hydration/footer stability | Blocked on approved populated data and a production-equivalent browser route. Synthetic server-rendered first-page markup passed the focused test; this does not measure hydration shift. |
| Three mobile CLS/LCP pairs, each CLS below 0.1 | Blocked. No populated Lighthouse run or report link exists for this head. No LCP improvement is claimed. |
| First-thumbnail emitted priority hint | Blocked for a populated build. The component's synthetic priority test passed, but no emitted production thumbnail was inspected. |
| Search, playlist filtering, pagination, direct playlist URLs | Synthetic page/gallery/interaction tests passed; populated exact-head browser behavior remains blocked. |
| Empty and fetch-error states | Controlled unit and desktop/mobile E2E fixtures passed; the production route was not exercised. |
| Focused populated-data regression | The 25-video synthetic initial-layout regression passed. An approved saved-data digest and corresponding regression result remain unavailable. |
| Live API integration after deployment | Pending an authorized deployment identifying its Production revision. |

## Local checks

| Command | Outcome |
| --- | --- |
| `npm ci --no-audit --no-fund` | Exit 0; 987 packages installed. |
| `npm run lint` | Exit 0. |
| `npm run type-check` | Exit 0. |
| `npm test -- app/videos/__tests__/page.test.tsx components/VideoGallery/__tests__/VideoGallery.test.tsx components/VideoCard/__tests__/VideoCard.test.tsx` | Exit 0; 3 files, 49 tests passed. |
| `npm test` | Exit 0; 38 files, 348 passed, 1 skipped. |
| `env -u YOUTUBE_API_KEY -u FOURTHWALL_STOREFRONT_TOKEN FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc npm run test:e2e -- --max-failures=1 --workers=1 --reporter=line` | Exit 0; 71 passed, 5 skipped in 2.9 minutes. This is the regular fixture-based development-server suite, not the `@production` populated check. |
| `ALLOW_MISSING_API_KEYS=true FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc npm run build` | Exit 0; keyless compile build, not a populated or valid-credential build. Generated sitemap date changes were discarded. |
| `npm run verify:videos` | Exit 1; missing the three required credential names at preflight. No build or performance check started. |

This verification task changed no executable behavior. There is no meaningful
new behavior test to run red, no implementation change or refactor, and no
green rerun to claim. The remaining release evidence requires an approved
immutable populated source and digest, an independently cleared private route
that supplies it to build and runtime, and exact-head browser/Lighthouse reports
with retained measurement links. A later website failure must receive a focused
failing behavior test before repair. No PASS, deployment, or merge is inferred.
