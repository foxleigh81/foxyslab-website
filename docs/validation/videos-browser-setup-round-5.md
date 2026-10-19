# Browser verification setup: revision round 5

Inspected checkout: `f18605ab1fbf47c7829648cbee36c320214bdb74` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`, 2026-10-19.
This note is an uncommitted documentation change on that checkout. The harness
will assign the resulting head; these local results do not verify that future
head or reconcile the live PR. No current-head failure evidence was supplied.

## Build and browser path

The existing `npm run verify:videos` entry point runs `npm run build`, serves
that artifact using `next start` on an unused loopback port, and targets
`/videos`. It runs `e2e/videos-gallery.spec.ts` with
`playwright.videos-production.config.ts` on desktop Chromium and Pixel 7
Chromium, then three sequential mobile Lighthouse runs with simulated
throttling. The production-tagged tests are included unconditionally in this
configuration. The regular E2E configuration excludes those tests.

Repeatable approved-run command sequence:

```sh
npm ci
npx playwright install --with-deps chromium
npm run lint
npm run type-check
npm test
export CHROME_PATH="$(node -p 'require("@playwright/test").chromium.executablePath()')"
npm run verify:videos
```

Use this sequence only on an authorized runner with data credentials supplied
after independent approval of its exact checkout SHA. The manual workflow
accepts `expected_sha`, checks it against the PR before checkout, and checks
both the checkout and live PR again before invoking the verifier. Its artifact
name and job summary carry that SHA. Record the successful build's SHA, workflow
run URL, report link, browser outcomes, first-thumbnail priority observation,
and all three CLS/LCP pairs together. The minimized `summary.json` alone does
not contain the commit SHA; preserve its workflow association. Require each CLS
below 0.1, and do not infer a network-dependent LCP improvement.

The credential boundary still requires independently verified environment
reviewers and branch restrictions, absence of equivalent bypassable secrets,
and a trusted default-branch dispatch path. Local configuration tests cannot
prove GitHub settings or independent approval. See
[the credential review](videos-credential-review.md) for the previously
recorded access limitations and required evidence; those remote observations
were not rechecked in this round. No credentials were retrieved or released.

## Observed local checks

Runtime: Node `v24.21.0`, npm `11.19.0`; the workflow specifies Node 22.

- `npm ci --cache /work/repo/.npm-cache --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test -- lib/__tests__/videos-browser-config.test.ts lib/__tests__/verify-videos.test.ts lib/__tests__/videos-workflow-security.test.ts lib/__tests__/videos-artifact-retention.test.ts`:
  exit 0, 38 tests passed across four files.
- `npm test`: exit 0, 343 passed, one skipped across 38 files.
- `npm run test:e2e -- e2e/videos-gallery.spec.ts`: exit 1 at server readiness
  because `FLAGS_SECRET` was missing. With the synthetic value below, the same
  smoke tests exited 0: four passed and four controlled-state tests skipped
  because no state fixtures were supplied. This exercises the missing-data
  page on desktop Chromium and mobile WebKit, not populated production data.
- `npm run verify:videos`: exit 1, reporting missing `YOUTUBE_API_KEY`,
  `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` before build or browser work.

Repeat the credential-free smoke check with an explicitly synthetic flag key:

```sh
FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc npm run test:e2e -- e2e/videos-gallery.spec.ts
```

No production build commit, populated browser observation, or mobile CLS/LCP
measurement was produced locally. The credential preflight failure is expected
enforcement, not a demonstrated setup defect. Existing setup checks remain
green; no production or test code was changed. This documentation-only change
has no meaningful red-green-refactor behavior test, and no red run is claimed.

Release verification remains outstanding: independently approve the resulting
head and credential boundary, build with valid data on the authorized runner,
and inspect the populated desktop/mobile browser results and three mobile
measurements. Ashley's and Macklin's independent verdicts remain separate.
