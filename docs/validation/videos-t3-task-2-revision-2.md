# Videos task 2, revision round 2: exact-head local checks

Checked 2026-10-23 UTC on branch
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`, local HEAD
`b50c032c60f42e21a561353fdda61054c9c489c4`. A fresh public GitHub
`GET /repos/foxleigh81/foxyslab-website/pulls/79` returned the same head,
open draft state and base `main`. The supplied current-head failure list is
empty. No website defect was reproduced in this pass.

## Admission and data boundary

No Studio admission/dispatch receipt for plan generation 74 and run
`r20261023-08a70749d239`, or selection predicate comparing plan, run, head
and receipt identities, was supplied to this website sandbox. No approved
populated saved-data source, immutable digest, pagination coverage, private
build/runtime loading route, exact-head target or independent credential-release
and artifact-control receipt was supplied. Only `CI` and `CODEX_CI` were present
among the inspected credential/verification environment-variable names. The
existing verifier fetches live API data and has no saved-data input. Its
credential preflight exited 1 before build, server, browser or Lighthouse work.

## Ticket criteria at this head

| Criterion                                                                    | Observation                                                                                                                                                                                                                                |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Initial populated cards or reserved space; footer stable through hydration   | Blocked for approved populated data. The focused synthetic 25-video page test passed and asserts initial server cards, including direct playlist and page 2 URLs. No populated HTTP response or before/after footer position was captured. |
| Three mobile CLS values below 0.1, paired LCP values and report links        | Blocked. No approved populated target or Lighthouse run. All three CLS and LCP values remain unmeasured; no LCP improvement is claimed.                                                                                                    |
| Emitted first-thumbnail priority hint                                        | Blocked on a populated production response. The synthetic card test passed; the emitted image/preload hint was not inspected in a populated build.                                                                                         |
| Search, playlist filtering, forward/back pagination and direct playlist URLs | Local fixture unit and regular browser checks passed, but approved populated exact-head behavior remains blocked.                                                                                                                          |
| Distinct empty and fetch-error states                                        | Controlled unit fixtures passed. Regular E2E passed with its keyless development server; this is not a populated production check.                                                                                                         |
| Focused populated-layout regression                                          | The existing focused regression passed with 25 synthetic videos. No approved saved-data digest or regression run against it exists.                                                                                                        |
| Valid-credential build and production E2E                                    | Blocked on the approved route and credential clearance. The keyless bypass build is only a compile check.                                                                                                                                  |
| Live API integration after deployment                                        | Pending an authorized Production deployment identifying its revision.                                                                                                                                                                      |

## Commands and outcomes

| Command                                                                                                                                                                          | Result                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci --no-audit --no-fund`                                                                                                                                                    | Exit 0; 987 packages installed.                                                                                                   |
| `npm test -- app/videos/__tests__/page.test.tsx components/VideoGallery/__tests__/VideoGallery.test.tsx components/VideoCard/__tests__/VideoCard.test.tsx`                       | Exit 0; 3 files, 49 tests passed.                                                                                                 |
| `npm run lint`                                                                                                                                                                   | Exit 0.                                                                                                                           |
| `npm run type-check`                                                                                                                                                             | Exit 0.                                                                                                                           |
| `npm test`                                                                                                                                                                       | Exit 0; 38 files, 348 passed, 1 skipped.                                                                                          |
| `env -u YOUTUBE_API_KEY -u FOURTHWALL_STOREFRONT_TOKEN FLAGS_SECRET=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA npm run test:e2e -- --max-failures=1 --workers=1 --reporter=dot` | Exit 0; 71 passed, 5 skipped in 3.5 minutes. This excludes the `@production` populated check.                                     |
| `npm run verify:videos`                                                                                                                                                          | Exit 1 at preflight: missing `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN` and `FLAGS_SECRET`. No reports or metrics produced. |
| `ALLOW_MISSING_API_KEYS=true FLAGS_SECRET=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA npm run build`                                                                             | Exit 0; keyless production compile, not a valid-credential populated build. Generated sitemap changes were removed.               |

An initial E2E invocation used a malformed synthetic `FLAGS_SECRET` and was
interrupted after the server reported its invalid length. The corrected command
above passed. This task changed no executable behavior, so there was no
meaningful new behavior test to run red, no production fix or refactor, and no
green rerun to claim. The next admissible measurement needs the external
receipts and independent credential clearance bound to the then-current PR
head; a populated website failure would require a focused failing test before
repair.
