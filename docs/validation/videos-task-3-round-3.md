# Task 3: exact-head local verification, revision round 3

Recorded 2026-10-20. The checked-out branch and the public PR #79 API both
reported `a7d408b3886c693a07647a3664ab899735b181cf` before this note was
written. PR #79 was open and draft. This note is not evidence for the later
harness commit or a future PR head.

The credential gate has not cleared: the supplied feedback contains no Marcus
approved-data/control inventory or Macklin independent exact-head assessment.
The prior [private-controls record](videos-t4-private-controls.md) identifies
the missing saved-data source, protected runner, credential-release boundary,
and artifact classification. No credentials were read or released, and no
credentialed workflow was dispatched in this revision.

| Ticket criterion | Result at this checkout |
| --- | --- |
| Initial populated cards or reserved space; footer stable through hydration | Blocked for production-shaped data. The synthetic populated server-render regression passed locally; the protected populated browser check did not run. |
| Three mobile CLS values below 0.1, paired LCP values, emitted thumbnail priority hint | Blocked. No current-head populated Lighthouse runs or emitted-priority observation exist here. No measurement/report link is claimed. |
| Populated search, playlist filter, pagination and direct playlist URLs | Blocked. Unit and ordinary E2E coverage uses synthetic data; the production-tagged browser checks did not run. |
| Empty/error behavior | Observed in local unit and ordinary E2E fixtures. This does not establish live API behavior. |
| Focused regression, lint, type-check, unit/E2E tests | Observed locally as listed below. The ordinary E2E config excludes `@production` cases. |
| Valid-credential populated build | Blocked at credential preflight. A separate synthetic-key, missing-API-key build succeeded but contains no populated YouTube data. |
| Live API after deployment | Blocked pending a named Production revision and accessible approved route. |

Local commands and outcomes:

| Command | Outcome |
| --- | --- |
| `npm ci --no-audit --no-fund` | Exit 0; 987 packages installed. |
| `npm test -- app/videos/__tests__/page.test.tsx` | Exit 0; 10 tests passed. |
| `npm run lint` | Exit 0. |
| `npm run type-check` | Exit 0. |
| `npm test` | Exit 0; 38 files, 345 tests passed, 1 skipped. |
| `npm run verify:videos` | Exit 1 at preflight: `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` missing. No build, browser, or Lighthouse stage ran. |
| `FLAGS_SECRET=<synthetic 32-byte key> ALLOW_MISSING_API_KEYS=true npm run test:e2e -- --reporter=line --workers=1` | Exit 0; 71 passed, 5 skipped. The server reported no YouTube API key. Two earlier setup attempts were interrupted after missing/invalid synthetic `FLAGS_SECRET` errors; neither was a behavior-test red run. |
| `FLAGS_SECRET=<synthetic 32-byte key> ALLOW_MISSING_API_KEYS=true npm run build` | Exit 0; Next compiled and generated 39 static pages. This is not a valid-credential or populated build. |

This revision adds only an evidence note and changes no executable behavior.
There is no meaningful new automated behavior test, TDD red/green cycle, or
refactor rerun to claim. The missing-credential preflight is a blocked setup
result, not a reproduced website defect. Release verification still needs the
approved exact-head route, populated dataset, independent credential clearance,
criterion-level browser and Lighthouse results, and post-deployment API check.
