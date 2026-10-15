# Round 42: exact-head verification remains data-blocked

Checked out `4207282c54f9979f0518de5bcf4dd8b09f251881` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. The GitHub PR #79 API
reported that same head. Its Preview deployment `7092238581` reported success
and `https://foxyslab-website-59uesnstm-foxleighco.vercel.app` as its
`environment_url`, but `/videos` returned HTTP 302 to Vercel SSO. That is not
a populated page check.

## Credentialed failure supplied by review

Workflow run `38732986996`, job `116415110479`, checked out this exact SHA.
`npm run verify:videos` completed its credentialed build and started its
production server. Its Playwright child then failed:

```text
node node_modules/@playwright/test/cli.js test e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts
line 21: failed; populated gallery data unavailable; no rendered video cards
```

The failure is the populated-card precondition in
`e2e/videos-gallery.spec.ts:37` or the later first-card visibility assertion;
both use the same diagnostic string. The redacted console line does not
distinguish those assertions, show the CI page's rendered state, or reveal the
server-side YouTube result. The layout and Lighthouse assertions were not
reached. A passing build does not prove this request-rendered route received
usable data.

The run's artifact `11970883579` is listed by GitHub as unexpired, but its ZIP
endpoint returned HTTP 401 `Requires authentication`; the artifact page
returned HTTP 404 without a GitHub session. Thus its `browser-smoke.json`,
screenshots, and trace are inaccessible here. The exact cause of the
credentialed failure cannot be classified as tooling, credentials/environment,
or application behavior from the available output. Changing the application
or runner on that evidence would be speculative.

## Local controlled browser run

`npm ci --no-audit --no-fund` passed. Built with a temporary valid-format
`FLAGS_SECRET` and `ALLOW_MISSING_API_KEYS=true` using `npm run build`, then
started `npm run start -- --hostname 127.0.0.1 --port 4173` with the same
empty-data opt-out and a temporary runtime Flags key. The production Playwright
command, with `VIDEOS_BASE_URL=http://127.0.0.1:4173` and
`VIDEOS_REPORT_DIR=.lighthouseci/videos/local-round-42`, failed in both Desktop
Chrome and Mobile Chrome at the same `selectPlaylist` precondition. Their local
error-context snapshots show the `All Videos` heading and `Unable to load
videos right now`, with no cards. Server output identified the local cause as
`No YouTube API key configured`. This local failure is credentials/environment,
and does not establish the credentialed CI run's cause. An initial local server
attempt without a runtime Flags key produced an unrelated application error;
the rerun above supplied that key and is the relevant reproduction.

## Checks and limit

- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0, 36 files passed, 314 tests passed, one skipped.
- Empty-data `npm run build`: exit 0; `/videos` is marked dynamic.
- `npm run verify:videos`: exit 1 at credential preflight; the required
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` are absent
  from this sandbox.

No code changed, so there is no meaningful red-green-refactor behavior test
for this evidence record. Populated browser checks, three mobile CLS/LCP runs,
and first-thumbnail priority inspection remain blocked by the inaccessible
credentialed artifact and unavailable local build-time data credentials. No
measurement from another checkout is presented as evidence for this SHA.
