# Task 2 of 4, T3 round 1 revision 2: remaining /videos criteria

Recorded 2026-10-21 UTC against local and live draft PR #79 head
`78f8602382b28876faa141ded4c9996ecceb2fa2`. A fresh public PR lookup
returned that same SHA. The public deployment lookup for that SHA returned `[]`,
so no exact-head Preview URL was available to this sandbox. No approved immutable populated
saved-video source, private ingestion command, controller receipt or independent
credential-release assessment was supplied. The main-branch workflows lookup
returned only `ci.yml`; a public lookup of `videos-verification` returned 404,
which does not establish the effective settings of any private environment.
The required YouTube, Fourthwall and Flags variables were absent by name-only
presence check. No credentials or saved payloads were read or copied.

## Criterion outcomes

| Ticket criterion                                                          | Outcome at inspected head                                                   | Evidence and limit                                                                                                                                                                              |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Populated initial response and hydration/footer stability                 | Blocked                                                                     | The focused synthetic server-render regression passed, but there is no approved populated response or exact-head browser route. No footer position was measured.                                |
| Three mobile CLS readings below 0.1, paired LCP, first-thumbnail priority | Blocked                                                                     | No Lighthouse trial or emitted-image inspection ran. CLS and LCP are unmeasured. Source sets `priority` and `fetchPriority="high"` for the first card; that is not an emitted-hint observation. |
| Search, playlist filtering, pagination, direct playlist URLs              | Blocked for production-shaped populated data                                | Synthetic page and interaction checks passed locally, but no approved populated browser run occurred.                                                                                           |
| Distinct empty and fetch-failed states                                    | Observed in controlled fixtures; blocked on the exact-head production route | Focused SSR tests and regular E2E exercised both states. They do not establish populated-route behavior.                                                                                        |
| Populated-layout regression, lint, type-check, unit and E2E               | Observed for synthetic/local data                                           | Commands and counts below. Regular E2E excludes `@production` populated checks.                                                                                                                 |
| Valid-data production build                                               | Blocked                                                                     | `npm run verify:videos` exited 1 at preflight for three absent credential names, before a build or browser check. A separate missing-key compile build passed; it had no populated saved data.  |
| Live API integration after Production deployment                          | Blocked                                                                     | No Production revision for this head was identified or observed.                                                                                                                                |

## Local commands

| Command                                                                                                                                                       | Result                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `npm ci --no-audit --no-fund`                                                                                                                                 | Exit 0; 987 packages installed.                                                                                   |
| `npm run lint`                                                                                                                                                | Exit 0.                                                                                                           |
| `npm run type-check`                                                                                                                                          | Exit 0.                                                                                                           |
| `npm test -- app/videos/__tests__/page.test.tsx components/VideoGallery/__tests__/VideoGallery.test.tsx components/VideoCard/__tests__/VideoCard.test.tsx`    | Exit 0; 3 files, 49 passed.                                                                                       |
| `npm test`                                                                                                                                                    | Exit 0; 38 files, 346 passed, 1 skipped.                                                                          |
| `env -u YOUTUBE_API_KEY -u FOURTHWALL_STOREFRONT_TOKEN FLAGS_SECRET=<synthetic 32-byte key> npm run test:e2e -- --max-failures=1 --workers=1 --reporter=line` | Exit 0; 71 passed, 5 skipped in 3.1 minutes. No live YouTube key was used.                                        |
| `npm run verify:videos`                                                                                                                                       | Exit 1: absent `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, `FLAGS_SECRET`; no build or measurement started. |
| `env -u YOUTUBE_API_KEY -u FOURTHWALL_STOREFRONT_TOKEN ALLOW_MISSING_API_KEYS=true FLAGS_SECRET=<synthetic 32-byte key> npm run build`                        | Exit 0; compile-only missing-key build, not a valid-data build.                                                   |

An initial E2E attempt was interrupted after a concurrent build disturbed its
shared `.next` directory. The isolated E2E rerun above is the result reported.
The build was then rerun alone. The generated sitemap date changes from build
were restored because they are unrelated to this measurement record.

This revision records verification only; it changes no application behavior.
There is no new behavior to test red, production change to run green, or
refactor rerun to claim. The remaining measurements require an approved,
accessible, exact-head private route that loads an immutable populated source
into both build and runtime, followed by authorized browser and Lighthouse
runs. A reproduced website defect should be repaired test-first and its
affected measurements repeated at the changed head.
