# PR #79 pre-merge verification route

## Revision round 5: populated exact-head verification remains blocked

On 2026-10-20 at 15:23:44 UTC, fresh unauthenticated GitHub REST reads
against `https://api.github.com/repos/foxleigh81/foxyslab-website` returned:

| Read | Result |
| --- | --- |
| `GET /pulls/79` | 200; open draft, head `f3a188c507b90856371f02949d0e49f6524e6da4`, matching local HEAD |
| `GET /contents/.github/workflows?ref=main` | 200; only `ci.yml` |
| `GET /environments/videos-verification` | 404; effective protections remain unknown to this reader |

These reads used Python's `urllib.request`, without authentication, with
`Accept: application/vnd.github+json`; no workflow was dispatched. The local
branch is `eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t` and was clean
before this documentation update. This records the inspected commit, not the
future harness commit. The round 4 observations below are historical.

No authorized operations surface or independent clearance receipt is available
in this session. The branch-local workflow requires dispatch on main, where it
is absent. Public metadata does not establish a safe alternate route, effective
credential controls, approved saved-data provenance, or clearance of Macklin's
reported block. Studio incident provenance, permissions and terminal run status
cannot be independently verified through the available tools. The operations
handoff described below remains outstanding; this record does not complete it.

Fresh local checks against the recorded source revision:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0;
  987 packages installed, with npm configuration/deprecation/install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 345 tests passed, 1 skipped.
  This includes the existing populated-fixture layout regression.

No executable behavior changed and no current-head application failure was
supplied or reproduced. This documentation-only update has no meaningful new
behavior test, red/green cycle or refactor; no red run is claimed.

No populated production build, E2E run or Lighthouse measurement was attempted
in this revision. Initial response/footer stability, the three mobile CLS/LCP
measurements, emitted thumbnail priority and populated gallery interactions
remain unverified against approved saved data. Local unit results do not satisfy
those criteria. No new production artifacts or report links exist.

The next action remains the external operations handoff: establish a usable
reviewed route and effective controls, obtain independent clearance, then
revalidate the live head before populated verification. Live API integration
requires a separate authorized post-deployment viewer. No secrets were copied,
credentialed execution performed, or external messages sent. Release readiness
remains **no**.

## Revision round 4: operations capability remains unavailable

**Blocked operations handoff; not completed operations verification.** On
2026-10-20 at 15:16:07 UTC, fresh unauthenticated GitHub REST inspection began
against `https://api.github.com/repos/foxleigh81/foxyslab-website`:

| Read | Result |
| --- | --- |
| `GET /pulls/79` | 200; open draft, head `9025a4de337fdaf1e6c6652a47e2f3bde949ee38`, base `eca93e0605ecf22f3eb8943a5fc84a37a65e11b1` |
| `GET /contents/.github/workflows?ref=main` | 200; only `ci.yml`, no populated-verification entry point |
| `GET /actions/workflows` | 200; populated verification ID `384502981` is listed as active; listing does not demonstrate dispatchability |
| `GET /environments/videos-verification` | 404; effective protections unknown to this reader |
| `GET /actions/secrets` | 401; secret-name inventory unavailable to this reader |

The observed head matches local HEAD and the supplied previous checked head.
It does not verify the future harness commit. Available session tools expose
no Studio operations, approval, or dispatch interface; `gh` is not installed,
and origin is the local harness mirror. Public reads cannot establish Studio
permissions, source-evidence provenance or terminal status for the supplied
runner incident. No authenticated operations inspection was possible.

The precise missing capability remains a trusted pre-merge controller that
binds an independently approved immutable controller revision and live PR head
to restricted credential release. The branch-local workflow is a candidate,
not that capability: it requires dispatch on main, where it is absent. No
dispatch was attempted. This task cannot establish the external route by
editing website documentation or by passing local tests.

Availability must be observed on an authorized operations surface: Marcus
records the controller identifier, immutable revision, permitted caller and
pre-merge entry point, with a credential-free capability receipt identifying
PR #79 and its freshly read head. That receipt must demonstrate acceptance of
the approved subject and rejection of changed-head/unapproved-controller
subjects. A workflow listing or a successful ordinary CI run is insufficient.
This is an outstanding handoff, not a request delivered to Marcus.

Before any credentialed dispatch, the same operations record must provide:

- Independent exact-head approval and recheck evidence, including reviewer,
  approved controller revision, approval invalidation on changes, and the
  live-head check immediately before credential release.
- Effective environment reviewers, self-review prevention, administrator
  bypass and allowed deployment refs; repository/organization secret-name
  inventories and consumers that could bypass the environment gate. The
  404/401 responses above prove neither protection nor absence of bypasses.
- Credential owner and issuer-enforced resource restrictions, runner access,
  and approved saved-data source, capture time, digest, counts, playlist and
  pagination coverage, plus the build ingestion route. None is established
  here; the existing verifier's live API path is not saved-data provenance.
- Effective artifact, log and job-summary access and expiry, including
  historical artifact containment. The candidate's numeric summaries and
  14-day retention are configured intent, not verified remote policy.
- Macklin's independent decision on those effective controls and the exact
  subject. His reported secret-release block remains in force.

No secrets were requested or copied, and no credentialed PR execution,
deployment, settings mutation or external message was performed. Populated
build/browser/Lighthouse evidence and independent current-head reviews remain
blocked. Live API integration remains a separate post-deployment handoff for
an authorized viewer, not a check for this SSO-blocked website sandbox.

This revision changes only the capability record; there is no executable
behavior to test with a meaningful red/green/refactor cycle. No red run or
application repair is claimed. Fresh local checks against this working tree:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0,
  987 packages installed; npm configuration/deprecation/install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 345 tests passed, 1 skipped.
- `git diff --check`: exit 0.

These checks cannot clear the operations block. No populated production build,
browser run or Lighthouse measurement was attempted in this revision.
Release readiness remains **no**.

## Revision round 3: T4 verification disposition

Local checks on 2026-10-20 tested committed application source
`ef533c901128cc31378fa1b6184cca5fe2fab97a` on the requested branch. The only
revision change is this evidence record. This SHA identifies the local subject,
not a freshly revalidated live PR head or the later harness-created commit.
No remote inspection, credential release, workflow dispatch or deployment was
performed. The round 2 operations handoff below remains unresolved; the supplied
current-head failure list is empty and supplies no application repair to make.

| Ticket criterion | Status in this revision | Evidence and remaining work |
| --- | --- | --- |
| Initial populated layout and hydration/footer stability | Blocked for production; synthetic regression observed | Focused page tests render first-page and direct-playlist cards before hydration using 25 synthetic videos. They do not measure browser footer movement with approved saved data. |
| Three mobile CLS values below 0.1, LCP values and first-thumbnail priority | Blocked | No approved populated build or measurement route is established. Card priority unit checks pass; no production DOM priority inspection or new CLS/LCP values are available. |
| Search, playlist filtering, pagination, direct URLs, empty/error states | Observed in unit fixtures; populated production checks blocked | Focused gallery/page/card tests pass. Production behavior still needs the approved dataset and exact-head browser run. |
| Install, lint, type-check, unit/E2E tests and valid-credential populated build | Partial; production build blocked | Local command results below. General development-server checks cannot establish populated production acceptance. |
| Independent current-head Ashley and Macklin reviews | Blocked | No current-head review or clearance of the reported credential-release block is evidenced. |
| Live API integration after deployment | Blocked | Requires an authorized deployment and subsequent integration check. |

Fresh local command results:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0;
  987 packages installed, with npm configuration/deprecation warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 345 tests passed, 1 skipped.
- `npm test -- app/videos/__tests__/page.test.tsx components/VideoGallery/__tests__/VideoGallery.test.tsx components/VideoCard/__tests__/VideoCard.test.tsx`:
  exit 0; 3 files and 49 tests passed.
- `env -u YOUTUBE_API_KEY -u FOURTHWALL_STOREFRONT_TOKEN FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc npm run test:e2e -- --max-failures=1 --workers=1 --reporter=line`:
  exit 0; 71 passed, 5 skipped, in 4.6 minutes. The flags value is the existing
  synthetic CI fixture. Desktop Chromium and iPhone WebKit used the development
  server; the server reported no YouTube API key. Controlled state fixtures were
  not supplied and the configured suite excludes production-tagged checks.
  Synthetic interaction/streaming checks passed; these are not saved-data
  production evidence. Watcher/cache warnings did not fail the run.
- `git diff --check`: exit 0.

No executable behavior changed, so this documentation-only revision has no
meaningful new automated behavior test, red/green repair or refactor cycle.
No red run is claimed. Existing passing regressions are supporting evidence,
not new TDD cycles or production measurements.

The next required action remains external: establish the separately reviewed
pre-merge controller and effective credential/data/artifact controls, clear the
independent credential-release block, and revalidate the live PR head. Only then
can an authorized runner execute populated build/browser/Lighthouse verification
and obtain independent current-head reviews. No credential values are needed in
this sandbox. Release readiness remains **no**.

## Prior revision evidence

Updated 2026-10-20, revision round 2, T4 task 2 of 4. **Blocked: no supported,
credential-safe pre-merge dispatch route has been established.** This replaces
the previous setup inventory. It is a handoff for Marcus's independent review,
not evidence that the handoff or workflow has been approved.

## Operations inspection status (revision round 2)

The local subject for this revision is committed HEAD
`ed34334b4c65d24665f4a4ef7988e458435440e3` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. The GitHub reads
below belong to the previous revision; they are historical observations,
not a revalidation of the live PR head. No new remote inspection was performed.
The harness-created head after this edit must be independently revalidated.

The requested authorized operations inspection is outside the website
sandbox. This run is restricted to `/work/repo` and cannot perform that
inspection or establish Studio permissions, ticket provenance or terminal-run
status. Repeating local tests or public metadata reads cannot establish these
controls. The following is a blocked handoff, not a completed operations record.

| Control | Evidence available in this revision | Specific next action outside this sandbox |
| --- | --- | --- |
| Pre-merge execution route | Previous public inspection found no verification workflow on main; no approved controller is evidenced | Marcus's separately reviewed workflow-integration deliverable must identify an existing trusted pre-merge controller or record the unsupported capability; a main merge requires separate authorization |
| Independent exact-head approval and recheck | Local candidate compares the live PR SHA before checkout and again before verification; no independent approval record is available | Record reviewer identity, approved PR SHA and immutable controller revision; revalidate the live SHA before delegation and credential release, invalidating approval on changes |
| Effective environment protection | Local YAML names `videos-verification`; historical unauthenticated 404 establishes no protection settings | Authorized operator records actual required reviewers, self-review prevention, administrator bypass and deployment-ref restrictions, with observation time and settings evidence |
| Equivalent secret bypasses | Local candidate references `VIDEOS_VERIFY_*`; current local general CI permits missing API keys and does not reference repository data secrets. Historical main observations below are a separate revision | Inspect current repository and organization secret-name inventories, environment placement, repository access policies and every consumer; remove or restrict equivalent ungated credential paths before release |
| Restricted credential access | No issuer-side restriction or effective access policy is evidenced | Record credential owner, permitted API/resource scope and runner access policy without exporting secret values; establish restrictions at the issuer and controller |
| Populated saved-video data provenance | Local verifier requires API credentials; no approved saved-data capture identifier, digest or production ingestion route is evidenced | Supply the authorized saved dataset's source, capture time, digest, counts, playlist membership and pagination coverage, and establish how the exact build consumes it |
| Safe artifact retention | Local candidate requests only `run-*/summary.json` for 14 days; verifier suppresses child output and removes raw reports | Inspect effective retention and access for artifacts, logs and job summaries, including historical artifacts and other upload paths; record evidence URLs, expiration and any required containment |
| Independent assessment | No Macklin receipt, current-head approval or block clearance is available | Coordinator submits the completed operations record to Macklin and records receipt and his independent decision against the revalidated head |

Macklin's reported credential-release block remains unresolved. No credentialed
PR execution, settings mutation or reviewer notification was performed. This
file is prepared for coordinator handoff; it does not establish that Macklin
received it. The task's effective-controls and independent-review acceptance
criteria remain blocked until the external actions above are evidenced.

## Observed subject and dispatch capability

Read-only public GitHub API inspection on 2026-10-20 UTC (local timestamp
14:36:39Z) returned the following. Paths are relative to
`https://api.github.com/repos/foxleigh81/foxyslab-website`.

| Read | Observed result |
| --- | --- |
| `GET /pulls/79` | HTTP 200; open, draft; head `bc7ae09683441c8986a3e4fb687496c85c63ccbc`, base `eca93e0605ecf22f3eb8943a5fc84a37a65e11b1` |
| `GET /branches/main` | HTTP 200; commit `eca93e0605ecf22f3eb8943a5fc84a37a65e11b1` |
| `GET /contents/.github/workflows?ref=main` | HTTP 200; only `ci.yml` |
| `GET /contents/.github/workflows/videos-verification.yml?ref=main` | HTTP 404; proposed entry point absent from main |
| `GET /actions/workflows` | HTTP 200; verification workflow ID `384502981` listed as active; CI and dynamic Copilot/Dependabot entries also listed |
| `GET /environments/videos-verification` | HTTP 404 to the unauthenticated reader; effective protections cannot be determined |

At that inspection, local HEAD matched the observed PR head. Local `origin/main` matched the
observed main commit; its tree contains only `ci.yml` under workflows.
The remote is a local harness mirror and `gh` is unavailable. No authenticated
settings inspection or dispatch was performed. The harness will create a new
head from this documentation change; these observations do not verify it.

GitHub's `workflow_dispatch` requires the workflow to exist on the default
branch. Active workflow metadata does not establish dispatch capability.
Independently, the candidate's only job requires
`github.ref == 'refs/heads/main'`, so selecting the draft branch would skip
verification even if an event were accepted. Changing this condition would
not establish a trusted default-branch entry point.

The inspected main `ci.yml` has only push and pull-request triggers, no manual
or reusable-workflow entry point, no exact-head approval environment, and
permits missing API keys for its build. It references repository secrets in
ordinary jobs; actual secret presence and equivalent bypass paths remain
uninspected. It is not an established protected verification route. The dynamic
workflows do not demonstrate an approved arbitrary verification entry point.

## Candidate integration and precise missing capability

The candidate is `.github/workflows/videos-verification.yml`, with inputs
`pr_number=79` and `expected_sha=<independently reviewed live PR head>`,
dispatched on trusted `main`. Candidate source revision is
`bc7ae09683441c8986a3e4fb687496c85c63ccbc`; workflow Git blob is
`8d5a542099e43b581af383b9c0f0236b6a57158b`. These identify review material,
**not a trusted or approved workflow revision**. No successful pre-merge
verification dispatch or dispatchable trusted revision is established here.

Static inspection shows live PR-head checks before checkout and verification,
checkout of the requested SHA without persisted credentials, and a checkout
SHA comparison before verification. It names the `videos-verification`
environment and dedicated `VIDEOS_VERIFY_*` secrets. Those checks alone do
not establish independent approval or effective environment protection. A
moving main ref also does not identify an approved immutable workflow revision.

The missing capability is an already trusted, dispatchable controller binding
an independently approved immutable workflow revision to an independently
approved PR head, with verified restricted credential release before PR #79
merges. No such controller is demonstrated by the available workflows. Edits
confined to this draft branch cannot install a workflow on main.

A protected-branch integration is a **separate future approval dependency**,
not an authorized preliminary merge or a completed part of this plan. Marcus
must obtain a separately reviewed integration proposal and protected-branch
authorization, or identify an existing approved external controller. This
sandbox cannot establish the requested outside-sandbox operations route.
No workflow or secret configuration was changed; no dispatch POST or
credential use was attempted.

## Review and operations handoff

Before credentialed execution, the authorized operator needs to record:

1. The controller entry point, immutable trusted workflow revision and observed
   pre-merge dispatch capability. Revalidate the live PR head before delegation
   and execution; identify the tested head on each later measurement.
2. Independent approval of that exact head, environment reviewers, self-review
   and bypass settings, trusted-ref restrictions, and repository/organization
   secret equivalents. The unauthenticated 404 proves neither absence nor safety.
3. Restricted credential and populated saved-video dataset provenance: source,
   capture identifier/digest, counts, playlist membership and pagination data.
   The current verifier uses live YouTube data; no saved-dataset ingestion route
   is demonstrated. Unit fixtures do not populate the production build.
4. Artifact controls and head binding. The candidate uploads numeric
   `summary.json` files for 14 days and links them in the job summary; the
   verifier suppresses child output and deletes raw reports. Effective controls
   still need independent inspection.

Any subsequent workflow implementation needs a focused behavior test that
first fails for changed-head or untrusted-workflow acceptance, then passes
with the guard implemented, followed by refactoring and green checks. This
handoff changes no executable behavior: no meaningful new automated behavior
test, red/green repair or refactor cycle applies or is claimed. Testing document
wording would not establish remote dispatch capability.

Studio provenance, permissions and prior-run terminal status require an
external authorized operations surface and were not inspected here. The
supplied empty failure list establishes no new application regression.

## Local checks and remaining evidence

Fresh local checks for revision round 2 on this working tree (all exit 0):

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0,
  987 packages installed; existing npm configuration/deprecation warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 345 tests passed, 1 skipped.

This revision changes only this handoff document. No production behavior was
changed, so no meaningful automated behavior test, red run, production fix or
refactor rerun applies. No red run is claimed. Local checks do not establish
effective remote controls or populated production measurements.

No credentialed build, browser or Lighthouse run was attempted. The historical live mobile baseline
remains CLS 0.511 on each run, with LCP 3.8, 4.3 and 11.8 seconds; these are not
measurements of this head.

The trusted route and protection inspection, populated initial layout and
hydration checks, three mobile CLS values below 0.1 with LCP and thumbnail
priority, gallery interactions, production build/browser checks, independent
current-head reviews and post-deployment live API integration remain open.
Release readiness remains **no**.
