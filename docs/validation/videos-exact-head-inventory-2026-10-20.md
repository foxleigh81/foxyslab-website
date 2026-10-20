# PR #79 pre-merge verification route

Updated 2026-10-20, T4 task 1 of 4, round 1. **Blocked: no supported,
credential-safe pre-merge dispatch route has been established.** This replaces
the previous setup inventory. It is a handoff for Marcus's independent review,
not evidence that the handoff or workflow has been approved.

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

Local HEAD matches the observed PR head. Local `origin/main` matches the
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

Fresh local checks on this working tree:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0,
  987 packages installed; existing npm configuration/deprecation warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 345 tests passed, 1 skipped.

No credentialed build, browser or Lighthouse run was attempted. The historical live mobile baseline
remains CLS 0.511 on each run, with LCP 3.8, 4.3 and 11.8 seconds; these are not
measurements of this head.

The trusted route and protection inspection, populated initial layout and
hydration checks, three mobile CLS values below 0.1 with LCP and thumbnail
priority, gallery interactions, production build/browser checks, independent
current-head reviews and post-deployment live API integration remain open.
Release readiness remains **no**.
