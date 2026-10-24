# /videos exact-head local evidence, revision round 15

The checked-out branch was clean at `5ac09f6c73c0e5f55e46bccd4d0d401af91c4a1d`
before verification. The GitHub PR API reported draft PR #79 open at that exact
head. GitHub reported Preview deployment `7184133047` successful at
`2026-10-19T20:24:46Z`. The sandbox's network policy does not permit access to
the Vercel Preview origin, so deployment success supplies no populated-page
observation.

## Fresh local results

| Command | Outcome |
| --- | --- |
| `npm ci` | Exit 0. |
| `npm test -- app/videos/__tests__/page.test.tsx` | Exit 0; 10 focused initial-layout and state tests passed using mocked populated data. |
| `npm run lint` | Exit 0. |
| `npm run type-check` | Exit 0. |
| `npm test` | Exit 0; 344 passed, 1 skipped. |
| `FLAGS_SECRET=<synthetic 32-byte key> npm run test:e2e -- --workers=2 --retries=0` | Exit 1; 50 passed, 5 skipped, 21 failed. All reported failures were iPhone 14 navigation failures after the local development server stopped accepting connections, spanning unrelated pages as well as `/videos`. This is a failed suite, not a pass. |
| `FLAGS_SECRET=<synthetic 32-byte key> npm run test:e2e -- e2e/videos-gallery.spec.ts e2e/videos-streaming.spec.ts --project='iPhone 14' --workers=1 --retries=0` | Exit 0; 6 passed, 2 production-tagged checks skipped. This isolated rerun narrows the full-suite failure but does not replace the failed full-suite result. |
| `ALLOW_MISSING_API_KEYS=true FLAGS_SECRET=<synthetic 32-byte key> npm run build` | Exit 0; local compile/build only, with missing API keys allowed. `/videos` is a dynamic route. |
| `npm run verify:videos` | Exit 1 at preflight: `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` were absent. No credentialed build, populated browser check, or Lighthouse run began. |

The first ordinary E2E attempt used an incorrectly encoded throwaway flags key,
reported `flags: Invalid secret`, and was interrupted. It is not counted as a
test result. The rerun above used a generated base64url encoding of 32 synthetic
bytes. No real credential values entered the sandbox.

## Acceptance evidence still needed

The focused mocked-data regression confirms server markup contains first-page
cards for default and direct playlist URLs, including page 2, and tests the
empty and fetch-failed markup. It does not observe a populated production
response or the footer through hydration. The source sets `priority={index ===
0}` for the first card, but the emitted first-thumbnail `fetchpriority` hint
was not observed on a populated page. Search, playlist selection, pagination,
direct playlist navigation, and controlled empty/error states have existing
fixture coverage; this round obtained no current-head populated browser result.

No current-head mobile Lighthouse CLS/LCP pairs were collected, so the
three-runs-below-0.1 criterion remains unverified and no LCP improvement is
claimed. A valid-credential, production-equivalent run against the exact
reviewed head must supply those measurements and the populated interaction and
hydration observations. The full ordinary E2E suite also needs a clean run on
a stable server. Live API integration remains a post-deployment check.

This round changes verification documentation only. There is no new behavior
to test red-green-refactor, and no red run is claimed.
