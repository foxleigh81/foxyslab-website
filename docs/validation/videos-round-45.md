# Round 45: a557c8c measurements and artifact inspection blocker

Verified checkout: `a557c8c034687ff723e1da556a9f1cedfcd59053`, on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. Local `git rev-parse HEAD`
and `GET /repos/foxleigh81/foxyslab-website/pulls/79` both returned this SHA on
2026-10-15. The working tree was initially clean. This record describes that
checkout, not the future commit containing this documentation change. Earlier
round records describe their own checkouts and are not evidence for this one.

## Production build and populated browser outcome

The exact-head [credentialed run 38740844490](https://github.com/foxleigh81/foxyslab-website/actions/runs/38740844490/job/116441825339)
completed successfully. The API independently confirms its head SHA and success.
The credential-redacted log excerpts supplied with the review record identify
the checkout at `2026-10-15T13:14:12.3601599Z`, the browser stage at
`13:15:26.9640370Z`, and all three measurements below. These excerpts are the
measurement source; the raw logs and reports were not downloaded here.

At this checkout, the workflow installs with `npm ci` and
`npx playwright install --with-deps chromium`, then runs `npm run verify:videos`
with repository secrets in Actions. The verifier uses `NODE_ENV=production`
and `ALLOW_MISSING_API_KEYS=false`. Its underlying commands are:

```sh
npm run build
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port "$PORT"
node node_modules/@playwright/test/cli.js test e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts
node node_modules/lighthouse/cli/index.js "$VIDEOS_BASE_URL/videos" --form-factor=mobile --throttling-method=simulate --output=json --output=html --output-path="$REPORT_PREFIX" "--chrome-flags=--headless --no-sandbox" --quiet
```

`PORT` represents the verifier's allocated loopback port; `VIDEOS_BASE_URL`
points to that production server. The verifier repeats the last command three
times with separate report prefixes. These command details come from the
workflow and verifier at the identified checkout, not downloaded child logs.

The browser child now passes in this run: the verifier awaits its successful
exit before starting Lighthouse. Its production configuration includes both
Desktop Chrome and Mobile Chrome, with no retries, and unconditionally includes
the populated-gallery test. That test requires visible cards and a populated
playlist, default and direct-playlist cards before hydration, footer movement
below two pixels after hydration, empty search and clearing search, and no axe
violations. The subsequent three measurements establish that this gate passed;
this conclusion does not rely only on a green job badge. Individual report
assertions, card counts and screenshots remain unavailable for inspection here.
Dropdown interaction, pagination, and the emitted first-thumbnail priority hint
are not established by this evidence.

## Measurements for this checkout

| Mobile run | Log timestamp (UTC, 2026-10-15) | CLS | LCP (ms, as reported) |
| --- | --- | --- | --- |
| 1 | 13:16:00.6460718 | 0 | 4274.504499999999 |
| 2 | 13:16:13.0195013 | 0 | 6788.319 |
| 3 | 13:16:25.4835163 | 0 | 6787.638000000001 |

All three reported CLS values are below 0.1. LCP is approximately 4.275,
6.788 and 6.788 seconds; no fixed network-dependent LCP improvement is claimed.
The ticket's historical baseline remains CLS 0.511 on three runs and LCP
3.8, 4.3 and 11.8 seconds. It was not remeasured or substituted for this head.

## Preview and retained artifact access

The exact-head deployments API returned Preview deployment `7093579832`.
Its status is successful at `2026-10-15T13:15:00Z`, with environment URL
`https://foxyslab-website-hkdqdf0pr-foxleighco.vercel.app`.
An unauthenticated request to `/videos` returned HTTP 302 to
`vercel.com/sso-api`. This is not a tested gallery. The same-repository
credentialed Actions run above supplies the production measurements instead.

The artifacts API lists unexpired artifact `11976012960`, named
`videos-verification-a557c8c034687ff723e1da556a9f1cedfcd59053`, at
1,357,783 bytes, with SHA-256 digest
`d9179ff76f40db08c2e8d5d294819eb0163b626f9b5eb44b90f8fe71852db22a`.
Its [browser and Lighthouse report link](https://github.com/foxleigh81/foxyslab-website/actions/runs/38740844490/artifacts/11976012960)
identifies the retained evidence, not a certified redacted copy.

Fresh retrieval attempts on 2026-10-15 returned:

| Endpoint under `/repos/foxleigh81/foxyslab-website` | Result |
| --- | --- |
| `/actions/artifacts/11976012960/zip` | HTTP 401 |
| `/actions/runs/38740844490/logs` | HTTP 403 |
| `/actions/artifacts/11962944845/zip` (historical failure) | HTTP 401 |
| `/actions/runs/38717478040/logs` (historical failure) | HTTP 403 |

No authenticated GitHub session or artifact-download channel is available in
this sandbox. Authorized access was requested without requesting secret values.
No raw reports or logs were retrieved, retained locally, or republished. Only
public metadata and the supplied redacted excerpts are recorded here.

**Artifact credential-redaction inspection remains blocked and incomplete.**
Suppressed child console output does not sanitize report files. The existing
upload includes browser JSON, possible failure traces/screenshots, Lighthouse
JSON/HTML and summary JSON without an explicit artifact sanitization step.
Neither job success nor the artifact digest proves those contents are free of
credentials. This round does not certify the already-uploaded artifact as safe.
An authorized reviewer must inspect those contents in a private environment,
including URLs, headers, errors, embedded HTML/JSON, trace resources and images;
redact credential-bearing material before retaining or sharing a reviewed copy,
and record its inventory and digest. That inspection must occur without copying
repository secret values into this sandbox. No runner or CI changes were made
on speculation.

## Historical failure limitation

The failing child at `122d26f5a5daf0f7d8fbac3d9df87fcb48615dd8` belongs to
run `38717478040`, with artifact `11962944845`. Its assertion and rendered page
state remain inaccessible. Its precise cause therefore remains unresolved and
cannot be classified as tooling, credentials/environment, or application
behavior. The successful browser child at `a557c8c` does not diagnose that older
failure or prove which change resolved it.

## Local checks

This is a documentation-only revision: no executable behavior, focused red test,
production fix, or refactor was introduced, so red-green-refactor is not
applicable. Local configured checks executed in this round:

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 36 files passed, 314 tests passed, one skipped.
- `git diff --check`: exit 0.

`npm run verify:videos` exited 1 at credential preflight, listing only missing
variable names: `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, `FLAGS_SECRET`.
No local production build, browser run or measurement started. This local
environment limitation does not replace the exact-head remote measurements.
