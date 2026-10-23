# T3 task 3, revision round 9: local evidence

Checked 2026-10-23 UTC on local SHA
`2cf3426ec1bbdf7f1c1669683a00440d372972de`. The public GitHub PR #79
API reported the same open draft head. Its Preview deployment `7285925029`
reported success at 2026-10-23T18:34:39Z, but this sandbox's permitted network
does not reach the Preview. Exact-head CI run `40004224332` reported success;
its public artifact listing contained zero artifacts. Neither status contains
populated layout or Lighthouse evidence.

| Criterion | Status | Observation or blocker |
| --- | --- | --- |
| Initial populated response and footer position through hydration | Blocked | The 25-video synthetic server-render regression passed. No populated PR-build HTTP response or before/after footer measurement was available. |
| Three mobile CLS/LCP pairs below 0.1 and emitted first-thumbnail priority | Blocked | No mobile Lighthouse run or emitted PR-build thumbnail markup was captured. There are no CLS/LCP values or report links; no LCP improvement is claimed. |
| Search | Observed only in synthetic tests; populated PR build blocked | Unit and browser fixture tests passed, but no populated PR-build interaction was observed. |
| Playlist selection and direct playlist URL | Observed only in synthetic tests; populated PR build blocked | The focused server-render and browser fixture tests passed; no populated PR-build navigation was observed. |
| Forward and back pagination | Observed only in synthetic tests; populated PR build blocked | The 25-video fixture exercised both directions; no admitted saved-data run was available. |
| Empty and fetch-error states | Observed in controlled fixtures; live behavior blocked | Four fixture-backed browser checks passed on desktop and mobile. No valid-credential production response was tested. |
| Focused populated-layout regression | Partial | Ten focused tests passed with synthetic videos, not approved saved video data. |
| Install, lint, type-check, unit and E2E | Observed | All local commands below passed. Regular E2E excludes `@production` populated-gallery checks. |
| Valid-credential production build | Blocked | All three required credential variables were absent. The verifier failed preflight before build, browser checks or Lighthouse. A separate missing-key compile check passed. |
| Post-deployment live API integration | Blocked | No authorized Production deployment revision or accessible live API observation was supplied. |

## Local commands

| Command | Outcome |
| --- | --- |
| `npm ci --no-audit --no-fund` | Exit 0; 987 packages installed. |
| `npm test -- app/videos/__tests__/page.test.tsx` | Exit 0; 10 passed. |
| `npm run lint` | Exit 0. |
| `npm run type-check` | Exit 0. |
| `npm test` | Exit 0; 38 files, 348 passed, one skipped. |
| `npm run test:e2e -- --reporter=line --workers=1 --max-failures=1` with a synthetic 32-byte `FLAGS_SECRET` | Exit 0; 71 passed, five skipped. An earlier attempt used an invalid-length synthetic key and stopped before tests; it was corrected and rerun. |
| `ALLOW_MISSING_API_KEYS=true npm run build` with a synthetic 32-byte `FLAGS_SECRET` | Exit 0; compile-only, without valid data credentials. |
| `VIDEOS_STATE_FIXTURE_DIR=/work/repo/.lighthouseci/videos/local-states npm test -- app/videos/__tests__/page.test.tsx` | Exit 0; 10 passed and generated controlled-state markup. |
| `VIDEOS_STATE_FIXTURE_DIR=/work/repo/.lighthouseci/videos/local-states npm run test:e2e -- e2e/videos-gallery.spec.ts --grep controlled --workers=1 --reporter=line` with the synthetic key | Exit 0; four passed. |
| `npm run verify:videos` | Exit 1 at credential preflight: `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` absent. No measurement started. |

This was a measurement task with no production-code change, so there is no
meaningful red/green/refactor cycle. Saved-data provenance and private delivery,
valid credential approval, accessible exact-head Preview or equivalent runner,
three mobile measurements, and the authorized post-deployment integration check
remain outstanding. Release readiness: no.
