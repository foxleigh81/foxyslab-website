# Round 44: reviewed-head evidence and access blockers

Reviewed checkout: `b9a05ea9263faae70bdb338ee94d08ca2e353977`, on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. Both local
`git rev-parse HEAD` and `GET /repos/foxleigh81/foxyslab-website/pulls/79`
returned this SHA. The working tree was clean before this documentation change.
All API observations below were made on 2026-10-15. Earlier round notes are
historical evidence, not measurements for this checkout.

## Current-head remote evidence

The deployments API queried with `?sha=b9a05ea9263faae70bdb338ee94d08ca2e353977`
returned Preview deployment `7093125723`. Its statuses endpoint reports success
at `2026-10-15T12:55:11Z`, with environment URL
`https://foxyslab-website-a4vg0tksu-foxleighco.vercel.app`.
An unauthenticated request to `/videos` returned HTTP 302 to Vercel SSO.
No gallery or performance claim is based on that response.

The exact-head [credentialed workflow run](https://github.com/foxleigh81/foxyslab-website/actions/runs/38738105449)
is completed with conclusion `success`. Its jobs endpoint identifies job
`116432475646` at the reviewed SHA and successful install, Chromium install,
verification, artifact upload, and evidence-link steps. The configured commands
are `npm ci`, `npx playwright install --with-deps chromium`, and
`npm run verify:videos`, with repository secrets supplied by Actions. The verifier
runs `npm run build`, serves that production build, and invokes:

```sh
node node_modules/@playwright/test/cli.js test e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts
```

It then invokes the following three times with separate output paths:

```sh
node node_modules/lighthouse/cli/index.js "$VIDEOS_BASE_URL/videos" --form-factor=mobile --throttling-method=simulate --output=json --output=html --output-path="$REPORT_PREFIX" --chrome-flags=--headless --quiet
```

These are configured remote commands, not commands observed in downloaded logs.
The public job metadata alone does not establish populated content, individual
browser outcomes, or performance acceptance.

The API lists unexpired artifact `11973564599`, named
`videos-verification-b9a05ea9263faae70bdb338ee94d08ca2e353977`:
[report artifact](https://github.com/foxleigh81/foxyslab-website/actions/runs/38738105449/artifacts/11973564599).
Its API ZIP endpoint returned HTTP 401. The web artifact URL redirected to
`/suites/104975301815/artifacts/11973564599`, which returned HTTP 404.
The run logs endpoint returned HTTP 403. No authenticated GitHub session is
available in this sandbox. No report contents were retrieved or certified as
credential-redacted.

## Acceptance evidence still unavailable

| Requested observation | Current-head result available here |
| --- | --- |
| Mobile run 1 CLS / LCP | Unavailable; report access blocked |
| Mobile run 2 CLS / LCP | Unavailable; report access blocked |
| Mobile run 3 CLS / LCP | Unavailable; report access blocked |
| Each CLS below 0.1 | Not established; verifier checks metric presence, not this threshold |
| Emitted first-thumbnail priority hint | Not inspected on a populated page |
| Initial cards and footer through hydration, desktop/mobile | Covered by configured production test; individual report unavailable |
| Direct playlist URL, empty search, clearing search | Covered by configured production test; individual report unavailable |
| Playlist dropdown interaction and populated pagination | Not exercised by the configured production test |
| Server-side empty/error behavior | Unit coverage only; no populated browser observation |

The production test discovers a populated playlist and navigates to its URL;
this is not an interaction with the playlist dropdown. No missing outcome is
inferred from the successful job badge. No application or runner change is
justified by the inaccessible reports.

## Historical failure

The commit API resolves `122d26f5` to
`122d26f5a5daf0f7d8fbac3d9df87fcb48615dd8`. Its credentialed workflow run
`38717478040` reports failure and retains artifact `11962944845` named for
that SHA. Fresh retrieval attempts returned HTTP 401 for its ZIP and HTTP 403
for its logs. Its assertion and rendered page state remain unavailable.
This is a historical evidence limitation; the precise cause cannot be classified
as tooling, credentials/environment, or application behavior. The current job's
success metadata does not diagnose that historical failure.

## Local verification

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 36 files passed, 314 tests passed, one skipped.
- `npm run test:e2e -- e2e/videos-gallery.spec.ts`: exit 1 before tests;
  `config.webServer` timed out after 60000 ms. The development server repeatedly
  reported `flags: Missing FLAGS_SECRET` at `app/layout.tsx:122` while rendering
  the root layout. This is a local environment/setup failure, not a gallery
  assertion failure. No rendered gallery state was reached.
- `npm run verify:videos`: exit 1 at preflight, listing missing
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
  No production build, populated browser run, or Lighthouse run started locally.
- `git diff --check`: exit 0.

The exact blocker for the next task is access to the existing current-head
report contents through an authorized GitHub session, followed by populated
browser checks for the uncovered interactions. Keep build credentials in the
existing same-repository Actions environment. The local missing credentials
are an environment limitation, not a reproduced application failure or a
diagnosis of the older child. No credentials were copied into the sandbox.

This round changes only this evidence record. There is no new executable
behavior for a meaningful red-green-refactor test; no red run or refactor is
claimed. Production-equivalent acceptance remains unverified here.
