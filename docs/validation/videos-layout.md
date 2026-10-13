# Videos initial layout: task 1 validation

For the repeatable credentialed build, browser smoke check, and three retained
mobile Lighthouse reports, see [Production /videos checks](videos-production-checks.md).
The historical results below are not new measurements from that procedure.

Run date: 2026-10-12. Starting revision: `eca93e0`.

## Scope

The server page resolves playlist and page parameters before rendering the
existing client gallery. The header-only Suspense fallback and the gallery's
`useSearchParams` dependency are removed. Duplicate parameters retain the first
value, matching the previous URLSearchParams behavior. Search remains local
client state. The route now renders per request; YouTube fetch caching remains.

There are no ESLint configuration or thumbnail-priority changes. The starting
revision already passed `priority={index === 0}` to VideoCard, which passes it
to Next Image. This is source inspection only, not a browser measurement of
the emitted preload or fetch priority. The separate thumbnail task still needs
production measurement.

## Observed red-green-refactor

1. Before editing production code, added `app/videos/__tests__/page.test.tsx`.
   It renders the actual page and gallery to HTML with mocked YouTube data.
   The navigation hook suspends to model Next's static-render bailout, rather
   than letting the global URL hook mock hide the missing initial grid.
2. Red: `npm test -- app/videos/__tests__/page.test.tsx` exited 1.
   Six tests failed and one passed. Default and direct-playlist responses had
   zero card headings instead of 12; page-two responses had zero instead of
   one. The empty-state text was also absent. The error-state test passed.
3. Made the render-boundary change. Green: the same command exited 0 with all
   seven tests passing.
4. Refactored duplicate parameter normalization into `firstParam`, simplified
   the test's page invocation, migrated interaction tests to server-provided
   URL props, and removed videos from the static-page expectation list.
   `npm test -- app/videos/__tests__/page.test.tsx components/VideoGallery/__tests__/VideoGallery.test.tsx`
   exited 0 with 29 passing tests.
5. Added navigation/search state coverage; the same focused command exited 0
   with 30 passing tests. Updated the stale ISR comment to describe fetch caching.

## Configured checks

- `npm ci`: passed.
- `npm run lint`: passed.
- `npm run type-check`: passed.
- `npm test`: passed, 30 files; 280 tests passed, one skipped.
- Final focused rerun after the caching-comment update: 30 passed.
- Post-change `npm run build`: exited 1, again unable to download Poppins
  from Google Fonts. A credentialed production build remains unverified.
- `npm run test:e2e -- --reporter=line --workers=2`: exited 1 because the
  development server could not start without `FLAGS_SECRET` (60-second timeout).
  Retried the same command with a process-local, randomly generated flags secret;
  the server started, but browser launches failed because Playwright Chromium
  and WebKit executables are not installed (52 failed). No browser assertions ran.

## Production measurement limits

The pre-change `npm run build` exited 1: Next could not download Poppins from
Google Fonts. The sandbox permits GitHub and package registries, not Google
Fonts or the YouTube API. No YouTube data credentials are configured.

No production-equivalent baseline or three post-change Lighthouse runs could
be collected. There are no measured CLS or LCP results from this run and no
claim of improved network-dependent LCP. An error page or fixture-only build
would not satisfy the requested measurement.

The added Playwright test requires populated YouTube data. It checks default
and direct-playlist markup with scripts held back, then releases scripts and
asserts the same cards and less than two pixels of footer movement. It also
exercises search, clearing an empty result, and axe accessibility checks on
both URLs. It can use a separately started production server on port 3000 via
the existing Playwright `reuseExistingServer` option. Actual browser execution
and the credentialed production measurements remain required before acceptance.

## Revision 2 validation attempt

Run date: 2026-10-12. Starting revision: `d4d9314`.

This revision updates only this validation record. No production or test code
changed, so there is no new red-green-refactor cycle or meaningful automated
behavior test for this documentation change. The earlier cycle above is the
previous implementation's recorded evidence. No raw initial-layout red log was
found in the checkout; its full original output is unavailable. The summary
above must not be treated as a captured failure transcript or a newly observed
red run.

Checks rerun directly in this sandbox:

| Command | Observed result |
| --- | --- |
| `npm ci` | Exit 0; installed 987 packages. |
| `npm run lint` | Exit 0. |
| `npm run type-check` | Exit 0. |
| `npm test -- app/videos/__tests__/page.test.tsx components/VideoGallery/__tests__/VideoGallery.test.tsx` | Exit 0; 30 tests passed. |
| `npm test` | Exit 0; 30 files passed, 280 tests passed, one skipped. |
| `npm run build` | Exit 1; `app/layout.tsx`: `next/font` failed to fetch Poppins from Google Fonts. |
| `npm run test:e2e -- --reporter=line --workers=2` | Exit 1; configured development server returned `flags: Missing FLAGS_SECRET` and timed out after 60000ms. No browser assertions ran; no production server was available. |

The focused green run covers initial default, direct-playlist and paginated
markup, empty/error states, and gallery interactions with mocked data. It does
not establish browser hydration behavior or production performance.

Environment inspection checked presence only: `YOUTUBE_API_KEY`,
`FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` are all unset. Only
`.env.example` is present. Neither Playwright Chromium nor WebKit is installed.
The sandbox's permitted network destinations exclude Google Fonts and the
YouTube API. A credentialed production build therefore remains blocked even
if the font download were independently resolved.

No pre-change production-equivalent Lighthouse baseline or post-change
Lighthouse measurements were produced. CLS below 0.1, LCP, footer stability
through hydration, and production interaction behavior remain unverified.
The first-thumbnail priority observation remains source-only:
`VideoGallery` passes `priority={index === 0}` to `VideoCard`, which forwards
it to Next Image. No emitted production preload or fetch-priority hint was
inspected, and no thumbnail-priority code was changed.

## Revision 9: populated-check navigation diagnostic

The production-only browser check now bounds `/videos` navigation to five
seconds and reports a fixture/data diagnostic if the default or direct-playlist
navigation fails. It still waits for the response to commit while scripts are
held back for the initial-layout measurement. This changes verification
behavior only; the gallery rendering and thumbnail priority are unchanged.

Observed TDD cycle:

- Red: `npm test -- lib/__tests__/videos-navigation.test.ts` exited 1 because
  a failed navigation surfaced `Navigation timeout` rather than the fixture/data
  diagnostic. The same command exited 1 for the direct-playlist case because
  it used `domcontentloaded` instead of the required `commit` wait state.
- Green: the focused command exited 0 after each minimal change. Refactoring
  the route check into `isVideosRoute` kept
  `npm test -- lib/__tests__/videos-navigation.test.ts lib/__tests__/videos-fixture.test.ts`
  green (nine tests).

`npm ci`, `npm run lint`, `npm run type-check`, and `npm test` exited 0. The unit
suite passed 297 tests with one skipped across 35 files. The regular E2E command
below passed 51 tests with one skipped using an ephemeral local flags secret:

```sh
NODE_OPTIONS=--max-old-space-size=1536 FLAGS_SECRET="$(node -e 'process.stdout.write(require("node:crypto").randomBytes(32).toString("base64url"))')" npm run test:e2e -- --reporter=line --workers=1 --retries=0
```

The production-only check was run against an intentionally unpopulated local
development server with `VIDEOS_BASE_URL=http://127.0.0.1:3000`, a local report
directory, and the production Playwright config. It exited 1 in about five
seconds with `Gallery fixture/data unavailable: videos navigation failed` and
the underlying five-second navigation timeout. The cold development compile
took longer than five seconds. This exercises the diagnostic path, not a
production-equivalent populated browser check.

`NODE_OPTIONS=--max-old-space-size=1536 npm run build` compiled and passed its
integrated checks, then exited 1 prerendering because `FLAGS_SECRET` is absent.
`npm run verify:videos` exited 1 at the credential gate, listing the missing
`YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` names only.
No populated baseline, three mobile Lighthouse runs, CLS/LCP values, or emitted
thumbnail-priority hint were obtained in this sandbox.

Completion still requires valid data credentials and access to the data and
image origins. Build and serve both baseline `eca93e0` and the final revision
there, capture three mobile Lighthouse runs for the populated videos route,
inspect the first image's emitted priority hint, and run the production E2E
check against the final build. Record per-run CLS and LCP and retain the
reports. These production acceptance items remain open.
