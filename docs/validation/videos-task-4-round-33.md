# T4 task 1: restricted populated-data setup

Observed 2026-10-20, revision round 33. Setup is **blocked**. This record
supersedes the setup observations in `videos-exact-head-inventory-2026-10-20.md`
for this subject; it does not promote that document's historical CI results.

## Subject and public preflight

Local `git rev-parse HEAD` and a fresh unauthenticated GitHub
`GET /repos/foxleigh81/foxyslab-website/pulls/79` both returned
`cea01bcc008fc9c52d9ea5f8e80fd11418f91dbd`. The PR is open and draft on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. The supplied runner
subject `481c2e56b194ab3a6f12ce301cab2c22ed9ba459` differs; no results from it
are attributed to this PR head. The harness will produce another head after
this documentation change, requiring fresh identity checks and approval.

Read-only GitHub API observations (repository-relative endpoints):

| Endpoint | Result | Meaning |
| --- | --- | --- |
| `pulls/79` | HTTP 200, head above | Public PR identity only; not approval |
| `actions/workflows/videos-verification.yml` | HTTP 200, ID `384502981`, state `active` | Workflow registry entry exists |
| `contents/.github/workflows/videos-verification.yml?ref=main` | HTTP 404 | Dispatchable workflow source on main could not be confirmed |
| `environments/videos-verification` | HTTP 404 | Environment existence/protection cannot be established with this access |

The 404s do not prove deletion or misconfiguration. The workflow metadata's
main-branch URL is not evidence that its source exists there. No dispatch,
environment mutation, credential retrieval, or operator contact was performed.
An authorized repository Actions/environment maintainer, coordinated by Marcus,
owns authenticated inspection of the main-branch source, dispatch availability,
required reviewers, prevention of self-approval, bypass permissions and secret
scope. Resolution evidence is an inspectable gated run bound to the approved SHA,
not merely an active registry entry.

## Authorization and credential boundary

| Required setup evidence | Current observation / owner |
| --- | --- |
| Authorized operator identity and authority | Not supplied or independently verified. Marcus must identify the operator and authorization record. |
| Environment approval | No approval record available; public endpoint returned 404. Environment maintainer must establish the gate. |
| Independent exact-head approval | Not available. A matching SHA and YAML `environment` field do not constitute approval. Independent reviewer and operator must record approval of the final SHA before releasing secrets to PR code. |
| Restricted credential validity and scope | Not tested. Local preflight reports absent `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, `FLAGS_SECRET`. Credential owner must validate restrictions and validity inside the approved environment. |
| Authorized API and image access | Sandbox network permits only GitHub and npm/PyPI registries. Production API/image access must be demonstrated in the approved external environment. |

`npm run verify:videos` exited 1 with only the three missing credential names,
before build, server, browser or Lighthouse stages. No values were printed,
copied, or requested. The existing workflow references environment secrets named
`VIDEOS_VERIFY_YOUTUBE_API_KEY`, `VIDEOS_VERIFY_FOURTHWALL_STOREFRONT_TOKEN` and
`VIDEOS_VERIFY_FLAGS_SECRET`; those references do not establish secret presence
or validity. Its head checks precede checkout and verification, but independent
approval must cover the exact code that will execute with those secrets.

## Saved-data provenance and consumption

No authorized saved dataset, capture identity/date, content digest, actual record
counts, or build-consumption evidence is available. This is a distinct blocker
even after credential and workflow access are repaired.

Inspection of `app/videos/page.tsx`, `lib/youtube.ts`, `types/youtube.ts` and
`scripts/lib/verify-videos.mjs` establishes the current path: the request-rendered
page requests up to 200 latest videos, playlists and playlist membership;
YouTube fetches use Next's cache. The verifier builds and serves the application
with missing-key bypass disabled. It does not configure a saved-data source.
A fetch cache alone does not establish a provenance-controlled saved dataset.

The operator must record the authorized source/capture time, immutable digest,
schema, actual video/playlist/membership counts, thumbnail availability and
ordering, plus the mechanism and evidence showing the approved PR build/server
consumes that same saved snapshot. Expected application video fields are `id`,
`title`, `description`, `thumbnail`, `publishedAt`, `viewCount`, `likeCount`,
`commentCount`, `duration`, and `url`; playlist records include ID, title,
description, thumbnail and item count, with membership IDs resolved separately.
The dataset must exercise multiple pages (page size 12), search, a populated
playlist and direct playlist URLs. These are required shape properties, not
observed dataset counts. Marcus owns arranging the source and consumption path;
no new product data-loading mode is implemented by this setup-only task.

Synthetic populated unit fixtures and generated empty/error browser fixtures
are separate evidence. They do not populate the production build with saved
production-shaped data. General CI explicitly allows missing API keys, so its
build badge cannot satisfy this setup or the populated performance criteria.

## Artifact boundary and next evidence

The existing workflow uploads only `.lighthouseci/videos/run-*/summary.json`
under a SHA-named artifact with 14-day retention and links it in the job summary.
Permitted evidence for this handoff is sanitized head/run identity, stage
outcomes, numeric CLS/LCP measurements, allowlisted browser outcomes and
non-secret provenance metadata. The authorized operator must confirm the actual
summary satisfies this boundary before retention. No new run artifact was
produced here.

Raw API responses, saved datasets, credentials, environment dumps, Next caches,
build output and raw browser/Lighthouse reports are outside this retention
boundary. Do not attach them to this PR or import them into the sandbox. Raw
diagnostics, if needed, require restricted inspection in the approved environment.

After setup is established, the separate verification task must supply initial
response/hydration/footer evidence, three actual mobile CLS/LCP pairs with each
CLS below 0.1, first-thumbnail priority inspection, populated interaction results,
and saved-data regression/build/check results at the revalidated head. All remain
unobserved here; there are no measurement links to report. Live API integration
is a separate post-deployment check. The Studio driver investigation remains
outside this website task, coordinated by Chris with an authorized maintainer.

## Local checks

Documentation only: no executable behavior changed, so no meaningful new behavior
test, red-green cycle or refactor applies. The failed credential preflight is a
setup observation, not a claimed TDD red run.

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0,
  987 packages installed.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 345 tests passed, 1 skipped.
- `npm run verify:videos`: exit 1, missing credentials as detailed above.

Release readiness remains no: authorization, environment availability, saved-data
provenance/consumption and populated verification are unresolved.
