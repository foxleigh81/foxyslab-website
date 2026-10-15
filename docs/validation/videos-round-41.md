# Round 41: credentialed verification blocked at populated gallery

Investigated on 2026-10-15 against checkout
`dfc1d9ee6a5208f586aecbf76f7b5f0ae9059e4e`, the exact head named by the review.
The branch is `eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`.

## Reported failure

The supplied redacted run for workflow run `38730535118`, job
`116406916299`, confirms the credentialed `npm run build` completed and the
production server reached the browser smoke stage. The failing child is
`node node_modules/@playwright/test/cli.js test e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts`.
Its reported assertion is in `e2e/videos-gallery.spec.ts:21`, the test
`default and playlist grids keep the footer stable through hydration`. The
reported diagnostic, `line 21: failed; populated gallery data unavailable; no
rendered video cards`, corresponds to `selectPlaylist` receiving a zero
`main h2` count in `e2e/helpers/videos-fixture.ts` before the layout assertions
run. The child failure is therefore the populated-card precondition, not a
measured footer shift.

The diagnostic does not expose the rendered page state or identify which
server/data request failed. The retained artifact link supplied for artifact
`11969344946` returned HTTP 404 when retrieved without authentication. The
workflow log says credentials were present but redacted; it does not establish
that they were valid or that YouTube returned usable data. Consequently the
failure cannot be classified as a runner defect, credentials/environment
failure, or application behavior from available evidence. No runner or
application change is justified without the page snapshot or server-side
failure details.

## Verification status

- Build: passed in the reported credentialed run for this exact checkout.
- Browser: failed in the populated-card precondition described above.
- Lighthouse: not reached; no CLS, LCP, or first-thumbnail priority result was
  produced.
- Local empty-data build: `FLAGS_SECRET=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
  ALLOW_MISSING_API_KEYS=true npm run build` passed. Earlier attempts with
  temporary secrets in the wrong format failed the Flags SDK's 256-bit key
  validation; the passing run used a base64-encoded 32-byte value. This build
  verifies compilation only and does not reproduce the credentialed gallery
  failure.
- Local `npm run verify:videos`: exits at credential preflight because
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` are not
  available in this sandbox. No credential values were requested or printed.
- Red/green behavior test: not applicable to this evidence-only round. There is
  no verified application behavior to change, and changing the test or runner
  to bypass the populated-card assertion would mask the reported failure.

The next diagnostic needs the retained `browser-smoke.json` plus the redacted
page snapshot/trace, or a rerun that records the sanitized server-side YouTube
failure category. Until then populated-gallery verification remains blocked.
