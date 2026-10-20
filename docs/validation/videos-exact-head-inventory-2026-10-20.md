# PR #79 populated-data verification setup

Updated 2026-10-20, T4 task 1 of 2, round 1. Setup is **blocked**.
This record supersedes the older-head inventory previously in this file.

## Revalidated subject and environment

During this run, the public GitHub API at
<https://api.github.com/repos/foxleigh81/foxyslab-website/pulls/79> returned
an open, draft PR with head `eed0d2774c61d21f75f9a5aa13277dd48deb73e6` and branch
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`.
Local `git rev-parse HEAD` and `git branch --show-current` matched those values.
Observation date: 2026-10-20 UTC (local check timestamp 10:56:10Z).
The worktree was clean before this documentation change.

The environment is `/work/repo`, Linux, Node v24.21.0, npm 11.19.0.
The existing protected workflow specifies Node 22; this sandbox is not that
production verification environment. Network access is restricted to GitHub
and npm/PyPI registries; production APIs, thumbnail origins and Preview hosts
are outside the permitted destinations.

Public head identity does not establish independent approval, driver provenance,
permissions, or terminal status of a previous Studio run. This sandbox exposes
no authorized Studio inspection surface or identified maintainer for those
checks. Chris's coordination and an authorized Studio maintainer's inspection
remain external prerequisites, with no Studio repair assigned to this website
worktree. The supplied current exact-head failure list is empty; no website
regression has been established. The reported historical runner SHA
`877560b67a3762c4cda4c11b0f8cf6b2391d01fa` is not evidence for this PR head.
The harness will create a new head from this change; these observations do not
verify that future head.

## Data provenance and setup attempt

`npm run verify:videos` exited 1 at credential preflight, before creating reports,
building, starting a browser target, or measuring Lighthouse:

```text
Missing required credentials: YOUTUBE_API_KEY, FOURTHWALL_STOREFRONT_TOKEN, FLAGS_SECRET
```

Only missing variable names were emitted. No credentials were obtained, copied,
logged, or committed. No populated dataset was obtained and no dataset provenance
can be attested. No empty-data or permissive build was substituted.

Inspection of `lib/youtube.ts` and `scripts/lib/verify-videos.mjs` shows that the
production path fetches live YouTube data with Next's fetch cache. The verifier
has no configured saved-dataset input. Its synthetic unit/state fixtures do not
populate the production build and cannot establish saved-data acceptance.
The intended browser target is the production build served by `next start`,
using `playwright.videos-production.config.ts` for desktop/mobile Chromium.
Neither build nor browser readability of populated saved data was demonstrated.

## Access path and artifact handling

The existing `.github/workflows/videos-verification.yml` describes a manual
workflow on `main`, an exact-head comparison before checkout and verification,
and the `videos-verification` environment. Restricted environment secret names
are `VIDEOS_VERIFY_YOUTUBE_API_KEY`, `VIDEOS_VERIFY_FOURTHWALL_STOREFRONT_TOKEN`,
and `VIDEOS_VERIFY_FLAGS_SECRET`. No workflow or credential handling was changed.

The YAML is a candidate access path, not proof of an approved one. Independent
approval of the exact head, required reviewers, restriction to trusted `main`,
workflow availability there, and restricted credential provisioning have not
been established in this run. No credentialed workflow was dispatched.

The existing verifier suppresses credentialed subprocess output, separates
browser credentials from build/server credentials, and deletes raw browser and
Lighthouse artifacts on stage exit. The workflow uploads only numeric
`run-*/summary.json` artifacts under a SHA-specific name for 14 days and links
those reports in its job summary. No measurement artifact or report link was
produced by this preflight failure. Raw datasets, API responses, screenshots,
traces and credential-bearing URLs must not be added to the shared handoff.

## Observable conditions for resuming

Marcus / the authorized verification operator needs an independently approved
restricted-credential environment for the newly revalidated PR head, with
production API and image access. Its owner must establish the protection and
approval settings above before releasing credentials to PR code. Credentials
must remain outside this sandbox.

The operator also needs a permitted, production-shaped saved dataset and a
supported way for the build and browser target to consume it, or an explicitly
accepted live-data equivalent. The provenance record must identify its source,
capture date, non-sensitive identifier/digest, video and playlist counts,
playlist membership sufficient for filtering/direct URLs, and enough eligible
videos for pagination. Demonstrate populated initial cards from that source in
both the built response and browser before performance measurement. No such
dataset or ingestion path is supplied here; inventing synthetic provenance
would not resolve this condition.

Chris must separately establish the prior run's terminal status and provenance
through an authorized Studio inspection surface. That surface and its authorized
maintainer are currently unspecified. A specific website failure observed on the
revalidated head can then be routed to a focused test-first repair.

| Criterion | Current observation | Required evidence |
| --- | --- | --- |
| Head identity | Observed: GitHub and checkout match | Revalidate the next head before approval and execution |
| Populated saved-data build/browser setup | Blocked: absent credentials, dataset and consumption path | Approved environment, provenance, successful populated build and browser target |
| Initial layout and hydration/footer stability | Blocked on populated target | Initial cards or stable reservation and footer observations |
| Mobile performance | Blocked; no CLS/LCP measurements | Three mobile CLS values each below 0.1, paired LCP and first-thumbnail priority inspection, linked reports |
| Search, playlists, pagination, direct URLs, empty/error states | Unit tests only; populated browser evidence blocked | Head-bound browser results, with fixture states identified separately |
| Checks and regression | Local checks below; populated build/E2E blocked | Populated layout regression and successful production verification |
| Live API integration | Not performed | Check after independently authorized deployment |
| Independent QA/security | Not established here | Current-head verdicts from the respective reviewers |

## Local checks and delivery scope

This change updates only the setup record. There is no executable behavior
change and therefore no meaningful new automated behavior test, red/green cycle,
or refactor. The failed credential preflight is not a TDD red run.

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0;
  987 packages installed. npm emitted existing dependency/configuration warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 test files passed, 345 tests passed, 1 skipped.
- `npm run verify:videos`: exit 1 at credential preflight as recorded above;
  production build, populated E2E and three Lighthouse runs did not execute.

Release readiness remains **no** until the blocked setup and ticket verification
criteria are observed. No later PR head, deployment, or release is certified.
