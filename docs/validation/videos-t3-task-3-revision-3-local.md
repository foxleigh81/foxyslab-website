# Videos task 3, revision round 3: local verification

Checked 2026-10-23 UTC on `2df26ba210ff9e451642cb87c45489e818931807`.
The supplied current-head failure list was empty. No website defect was
demonstrated in this checkout, so this round changes no executable behavior.
There is no behavior-test red run, production fix, or refactor rerun to report.
This record is local evidence for that checkout, not verification of the later
harness commit or PR head.

| Criterion | Observed result |
| --- | --- |
| Initial populated cards and footer stability through hydration | The focused server-render test passed with 25 synthetic saved videos. The populated production browser check did not run. |
| Search | Synthetic component and E2E checks passed. Populated live-data behavior was not observed. |
| Playlist filtering and direct playlist URLs | Synthetic component and E2E checks passed. Populated live-data behavior was not observed. |
| Forward and back pagination | Synthetic component and E2E checks passed. Populated live-data behavior was not observed. |
| Empty and fetch-error states | Focused unit checks passed. The ordinary E2E run skipped controlled-state checks without a fixture directory; a separate fixture-backed E2E run passed four browser cases. Live API states were not observed. |
| Three mobile CLS values below 0.1, paired LCP, and emitted first-thumbnail priority | Not measured. The production verifier stopped at credential preflight before browser or Lighthouse checks. No performance improvement is claimed. |
| Valid-credential, populated build | Not run: the required credentials were absent. The successful build below used a synthetic flags secret and allowed missing API keys. |
| Live API after deployment | Pending an authorized deployment with an identified revision. |

| Command | Result |
| --- | --- |
| `npm ci --no-audit --no-fund` | Exit 0; 987 packages installed. |
| `npm test -- app/videos/__tests__/page.test.tsx components/VideoGallery/__tests__/VideoGallery.test.tsx components/VideoCard/__tests__/VideoCard.test.tsx` | Exit 0; 49 passed. |
| `npm run lint` | Exit 0. |
| `npm run type-check` | Exit 0. |
| `npm test` | Exit 0; 348 passed, 1 skipped. |
| `env -u YOUTUBE_API_KEY -u FOURTHWALL_STOREFRONT_TOKEN FLAGS_SECRET=<synthetic test key> npm run test:e2e -- --max-failures=1 --workers=1 --reporter=dot` | Exit 0; 71 passed, 5 skipped. The ordinary config excludes `@production` tests and the server had no YouTube API key. |
| `VIDEOS_STATE_FIXTURE_DIR=/work/repo/.videos-state-fixtures npm test -- app/videos/__tests__/page.test.tsx` | Exit 0; 10 passed and wrote controlled-state server markup. |
| `env -u YOUTUBE_API_KEY -u FOURTHWALL_STOREFRONT_TOKEN FLAGS_SECRET=<synthetic test key> VIDEOS_STATE_FIXTURE_DIR=/work/repo/.videos-state-fixtures npm run test:e2e -- e2e/videos-gallery.spec.ts --grep controlled --workers=1 --reporter=dot` | Exit 0; four empty/error browser cases passed. The temporary fixture directory was removed afterward. |
| `ALLOW_MISSING_API_KEYS=true FLAGS_SECRET=<synthetic test key> npm run build` | Exit 0; compiled and generated 39 static pages. This is a keyless build. |
| `npm run verify:videos` | Exit 1 before build: `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` absent. |

Production-shaped saved data and the valid-credential route were unavailable
here. Current-head populated browser outcomes, the emitted priority hint in a
real response, and three mobile Lighthouse reports remain outstanding. The
build-generated sitemap date changes were removed after verification.
