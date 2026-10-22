# T4 task 2: verification setup, revision 3

Inspected on 2026-10-22 on the assigned branch, initially clean, at
`ad1fc7b42faf47f66ef1be0f67e7882ded83d048`. Fresh anonymous GitHub REST
`GET /repos/foxleigh81/foxyslab-website/pulls/79` returned HTTP 200,
open draft, with that same head. This identifies the inspected source, not
approval or verification of the future harness commit.

## Setup disposition

The [task-1 inventory](videos-t4-task-1-round-1.md) was checked against current
source. No confirmed website controller, retention or cleanup defect requires
a code change in this revision. The current-head failure list supplied with
the task is empty. The following capability gaps remain specific blockers:

| Capability | Current evidence and remaining work |
| --- | --- |
| Approved saved-video source | No approved snapshot, immutable digest, source-owner receipt or pagination/playlist coverage receipt was supplied. Marcus must establish these through the authorized private route. Synthetic unit fixtures do not establish saved-data provenance. |
| Build and runtime ingestion | `lib/youtube.ts` fetches live data; `scripts/lib/verify-videos.mjs` supplies production environment variables to build and server but accepts no saved-source input. The approved source format and private execution route are unavailable; this inspection does not invent a substitute input contract. Marcus must identify how both stages consume the approved digest before a scoped ingestion repair can be defined. |
| Authorized pre-merge controller | Fresh anonymous `GET /repos/foxleigh81/foxyslab-website/contents/.github/workflows?ref=main` returned HTTP 200 and only `ci.yml`. The candidate verification workflow requires main. No approved external controller revision, permitted caller or invocation receipt is supplied. Marcus must establish that capability without requiring a preliminary protected-branch merge. |
| Independent clearance and effective private retention | No exact-head approval or Macklin clearance receipt for source, controller, credential release and artifact/log/job-summary readers and expiry is available. Source configuration alone does not demonstrate these effective controls. The candidate's shell head recheck runs after step credentials enter its environment. |
| Engineering-driver diagnosis | `git worktree list` lists only `/work/repo`. Filename inventory finds historical driver documents, not an executable driver/controller checkout or redacted lookup trace. No authorized separate checkout, trace or Studio operations interface was supplied. Dennis must obtain these externally; no driver diagnosis was dispatched to the website runner or search performed outside the workspace. |

The plan-generation/run association, ready-for-dev provenance and terminal run
status remain unverified through the available tools. This is a local blocker
record, not evidence of an external handoff or a scheduler change.

## Existing retention repair

The inspected live head already contains the repair; it was not repeated:

- Ordinary CI E2E and coverage jobs do not upload raw reports.
- The candidate populated workflow selects only
  `.lighthouseci/videos/run-*/summary.json`, includes hidden files and requests
  14-day retention. It also publishes summary contents to the job summary.
- The verifier suppresses child output, selects child environments and writes
  minimized measurement/browser outcomes. Its `try/finally` covers build,
  startup, browser and Lighthouse failures; nested cleanup discards raw
  run-directory files even if server shutdown throws.
- Existing focused tests exercise these behaviors with synthetic data.

This does not prove cancellation/runner-loss cleanup, removal of `.next` and
caches, historical artifact containment, or private readers and expiration.
Ordinary CI still uploads `.lighthouseci/`, and `lighthouserc.js` uses temporary
public storage. That route is not established as suitable for private inputs.
No private inputs or credentialed reports were produced in this revision.

## Local validation

Fresh commands against the inspected source (all exit 0):

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: 987 packages
  installed.
- `npm run lint`.
- `npm run type-check`.
- `npm test`: 38 files passed, 348 tests passed, 1 skipped.
- `npm test -- lib/__tests__/verify-videos.test.ts lib/__tests__/videos-artifact-retention.test.ts`:
  2 files and 36 tests passed, including existing failure cleanup coverage.
- `env -u YOUTUBE_API_KEY -u FOURTHWALL_STOREFRONT_TOKEN -u SENTRY_AUTH_TOKEN NEXT_PUBLIC_SENTRY_DSN= FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc ALLOW_MISSING_API_KEYS=true NEXT_TELEMETRY_DISABLED=1 npm run build`:
  production compile and 39-page generation passed. The flags value is the
  existing public synthetic CI fixture. This is a missing-key compilation
  check, not the required approved populated build.
- `git diff --check`.

Install emitted npm configuration/deprecation/install-script warnings. Vitest
emitted its existing configuration-loader warning. Build emitted webpack cache
warnings and Sentry missing-token notices; no Sentry release/source-map upload
was performed. No browser or Lighthouse run was attempted: production-shaped
saved-data execution remains blocked by the prerequisites above.

This revision changes only this evidence record. There is no executable behavior
change for a meaningful red-green-refactor test; no red run, production fix or
refactor is claimed.

## Remaining acceptance work

Approved populated initial HTML/footer stability, browser interactions, emitted
thumbnail priority and three mobile CLS/LCP pairs remain blocked and unmeasured.
No production measurement report or CI evidence link was generated. Existing
synthetic checks and a missing-key build cannot establish those criteria.
After source, route and independent clearance are available, Studio must bind
the populated build/browser/Lighthouse measurements and sanitized report links
to the then-current PR head. Ashley's and Macklin's independent reviews remain
outstanding; live API integration remains a separate authorized post-deployment
observation. No credential release, workflow dispatch, deployment or external
message was performed. Release readiness remains **no**.
