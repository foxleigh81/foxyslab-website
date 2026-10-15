# Round 40: empty-data browser failure reproduced; CI artifact unavailable

Investigated on 2026-10-15. The checkout is
`16274ef2fa4dd8b8aa1c10bd0fa6276f6082d6d1`; GitHub's PR #79 API reports the
same head. The exact-head Preview is deployment `7090035353`, with successful
status at `2026-10-15T10:24:59Z` and URL
`https://foxyslab-website-ndwzewwsn-foxleighco.vercel.app`. Its `/videos` route
redirects to Vercel SSO, so it is not accessible for populated verification.

## Reported CI child

The round-39 supplied log for [run 38717478040, job 116363584813](https://github.com/foxleigh81/foxyslab-website/actions/runs/38717478040/job/116363584813)
shows `npm run verify:videos` reached `Browser smoke...` after the build and
server readiness stages. Its sanitized failure names the child:

```text
node node_modules/@playwright/test/cli.js test e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts
```

and reports `line 21: failed; populated gallery data unavailable; no rendered
video cards` for desktop and mobile. The relevant behavior assertion is in
`e2e/videos-gallery.spec.ts:37`: `selectPlaylist` receives the count of
`main h2` elements before selecting a populated playlist. At line 27 of
`e2e/helpers/videos-fixture.ts`, a zero count throws the no-rendered-cards
diagnostic. The original artifact `11962944845` is still listed as unexpired,
but its ZIP endpoint returned HTTP 401 `Requires authentication`; job logs are
not available through authorized GitHub access here. The exact CI page snapshot
and deeper cause therefore remain unavailable. The stage output establishes a
browser assertion failure after build/readiness, but cannot distinguish invalid
or inaccessible data credentials from an application/data-service failure.

## Controlled reproduction

Installed dependencies with `npm ci --no-audit --no-fund` (exit 0). Since the
required site credentials are absent locally, built the documented empty-data
mode using an ephemeral local `FLAGS_SECRET`:

```text
FLAGS_SECRET=<ephemeral-local-key> ALLOW_MISSING_API_KEYS=true npm run build
```

The production build passed. Then ran the production Playwright child against
that build with `ALLOW_MISSING_API_KEYS=true` at runtime. Both Desktop Chrome
and Mobile Chrome failed at `selectPlaylist` with `no rendered video cards`.
The retained local Playwright snapshots show `/videos` rendered its page header
and the application's error state: “Unable to load videos right now / Please
try again later or visit our YouTube channel directly.” `main h2` had count
zero. This confirms the test's missing-card failure and classifies this local
reproduction as missing data/environment, not a runner defect. It does not
establish that the credentialed CI run had the same cause.

The ordinary `npm run verify:videos` command exits at preflight with missing
`YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`, so no
credentialed verification or Lighthouse measurements are available in this
sandbox. No application or runner change is justified by the accessible
evidence. This documentation-only update has no meaningful behavior test; no
red-green-refactor cycle is claimed.

## Checks

- `npm ci --no-audit --no-fund`: exit 0.
- `FLAGS_SECRET=<ephemeral-local-key> ALLOW_MISSING_API_KEYS=true npm run build`:
  exit 0.
- Production Playwright child, filtered to
  `default and playlist grids keep the footer stable through hydration`: exit 1
  as expected for the empty-data reproduction; both projects failed at the
  zero-card assertion with the error state recorded above.
- `npm run verify:videos`: exit 1 at credential preflight; no secret values
  were present or printed.

Credential-redacted CI artifacts remain inaccessible. The exact CI root cause,
populated gallery behavior, CLS/LCP, and first-thumbnail priority hint remain
unverified for this checkout.
