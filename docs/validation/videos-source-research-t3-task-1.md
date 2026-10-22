# Issue #71 saved-video source research (2026-10-21)

This is a read-only source and access inventory for task 1. It does not
approve dataset use, release credentials, or verify populated website behavior.

## Revision round 3: private operations gate, 2026-10-22

Local checkout HEAD is `7b39956eca9d8bd7286dba82fb75b17626f507b3`,
matching the brief's previous checked PR #79 head. The working tree was clean.
The live remote head was not queried; this record does not validate the future
harness commit. Reused the research below, the
[source reconciliation](videos-source-reconciliation-round-5.md), and the
[current control handoff](videos-t4-task-1-round-1.md).

**Gate status: blocked; operations validation is incomplete.** The requested
authorized operations path outside the website runner is not exposed by this
session. No source-owner or operations contact interface, private inventory
locator, approval receipt or independent assessment was supplied. Repository
documentation cannot establish those external facts.

| Required gate item | Evidence status at this checkout |
| --- | --- |
| Source custodian and use approval | Blocked: unidentified owner; no source-owner approval receipt. Marcus is the named coordinator, not an established custodian. |
| Immutable dataset version/digest and coverage | Blocked: no approved manifest or measured video, playlist or membership counts. Coverage must include pagination beyond 12 eligible videos, playlist filtering and direct playlist URLs. Synthetic fixtures and live API reads do not establish this. |
| Permitted private exact-head build/browser route | Blocked: no authorized controller locator, immutable revision, executor or invocation receipt. The recorded branch workflow is a candidate, not an established private route; the existing verifier has no saved-source input. |
| Credential source and validity | Blocked: no approved credential-source reference or validity attestation. No secret values were requested, inspected or copied; a missing-key runner was not dispatched. |
| Retention and cleanup | Blocked: no effective audience, expiry, storage, cleanup owner or deletion receipts covering success, failure, cancellation and runner loss. Existing proposed controls are not validated settings. |
| Exact PR SHA and Macklin assessment | Blocked: the local SHA above is observed, but live-head binding and an independent assessment of that head, dataset and controller are absent. Ashley's and Macklin's blocks remain unresolved. |

The precise private resource locator and its permission model remain unknown.
No private-resource access request was made and no refusal was observed in this
round. The historical GitHub issue-comment HTTP 401 below concerns publication
only; it is not evidence of denied access to the dataset or operations inventory.
An authorized operations owner must provide the locator and required permission,
then record the actual access outcome through that route. An observed refusal
must name the resource, requested permission, time and sanitized response; an
unknown resource must not be represented as a denied request.

Acceptance criterion 1 remains blocked by the missing receipts in the table.
For criterion 2, no credentialed execution occurred in this session; external
gate enforcement remains unverified. All gate items must be validated together
against the then-live PR SHA before credentialed execution. No workflow,
deployment, external message or driver change was made. Populated build/browser
checks, three mobile CLS/LCP measurements and report links remain outstanding.

This is documentation only: no executable behavior changed, so no meaningful
automated red-green-refactor test applies. No red run or refactor is claimed.
Fresh local checks all exited 0:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: 987 packages
  installed, with npm configuration, deprecation and install-script warnings.
- `npm run lint`.
- `npm run type-check`.
- `npm test`: 38 files passed, 346 tests passed and 1 skipped; Vite emitted
  its configuration-loader compatibility warning.

These checks cannot validate the private operations gate or populated
performance. Release readiness remains **no**.

## Revision round 2: T4 task 2 handoff

Inspected local source HEAD `4b0826fec11f5cd2ee66f9cebcefceaf1f771808`
on the assigned branch, with an initially clean working tree. This section
records local observations only; the remote PR head and issue contents were
not queried again. The GitHub responses below belong to the previous round.

The supplied current-head failure evidence is empty. Local inspection of
`lib/youtube.ts`, `app/videos/page.tsx`, `components/VideoGallery/index.tsx`
and `scripts/lib/verify-videos.mjs` confirms live YouTube reads, up to 200
eligible videos, 12 cards per gallery page, and a verifier with no immutable
saved-source input. No new website defect is established by this inspection.

| Task acceptance criterion | Current disposition |
| --- | --- |
| Source-owner approval, immutable identity, coverage and permitted access recorded on issue #71 | Blocked: no owner or approval receipt, snapshot identifier/digest, actual coverage counts or access grant was supplied. Pagination needs more than 12 eligible videos; playlist membership and direct playlist coverage also need evidence. These requirements are not measured dataset counts. No issue update was made in this revision. |
| Private exact-head build/browser route with retention and cleanup | Blocked: the existing live-data verifier does not ingest an approved snapshot. The private controller, immutable revision, invocation and effective access/retention/cleanup receipts remain unidentified. |
| Macklin's independent assessment before release | Blocked: no assessment for the dataset, controller and exact PR SHA was supplied. No data or credentials were released and no credentialed run was started. |

The precise inaccessible source resource and its custodian **remain unknown**.
The earlier reference to an operations/source inventory describes the record
needed, not a discovered resource or verified permission denial. Marcus is the
named research coordinator, not an established source owner. An authorized
operations contact must first supply the inventory locator and its access
custodian; this checkout has no interface to that inventory or owner-contact
route. Repeating website-sandbox inspection cannot establish those identities.

The existing [control handoff](videos-t4-task-1-round-1.md) specifies the
required private route: bind dataset digest, controller revision and live PR
SHA; ingest the same approved snapshot at build and runtime; assess release
before PR-controlled code runs; document authorized readers, finite expiry,
cleanup ownership and deletion on success, failure, cancellation and runner
loss. These are proposed controls, not observed settings. Marcus must obtain
the source/route receipts and Macklin must independently assess them before
release. Sanitized receipts belong on issue #71 through an authorized writer;
this local document is not an issue publication or an approval.

Populated build/browser results, three mobile CLS/LCP pairs, first-thumbnail
priority and hydration/footer stability remain unobserved. The later harness
commit needs its own exact-head verification and approved report links. Live
API/gallery verification separately needs a Production revision and observation
time. Missing-key CI cannot establish any populated acceptance criterion.

This revision changes documentation only, so there is no meaningful automated
behavior test for a red-green-refactor cycle. No red run or refactor is claimed.
Fresh local checks (all exit 0):

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: 987
  packages installed; npm configuration, deprecation and install-script warnings.
- `npm run lint`.
- `npm run type-check`.
- `npm test`: 38 files passed, 346 tests passed and 1 skipped; Vite emitted
  its configuration-loader compatibility warning.
- `git diff --check`.

No populated production build, E2E or Lighthouse run was performed in this
revision; the required approved source and private route remain unavailable.

Release readiness remains **no** pending source identification and approval,
the private route, independent assessment and populated verification.

## Previous round: records inspected

- Public GitHub issue #71 (`GET /repos/foxleigh81/foxyslab-website/issues/71`):
  the ticket requires production-shaped, populated saved video data; the issue
  currently has no comments naming a source or approver.
- Public draft PR #79 (`GET /repos/foxleigh81/foxyslab-website/pulls/79`):
  head `9275aeb0a3daa0c1b0b20964e99264c427de053b`; its description
  reports missing populated verification and does not identify a saved source.
- Public GitHub issue search for `"saved video"` in this repository: only
  issue #71 matched.
- `site.config.ts` and `lib/youtube.ts`: the configured channel handle is
  `foxyslab`; production reads live YouTube v3 uploads, videos, playlists, and
  playlist membership using `YOUTUBE_API_KEY`. This identifies the live upstream
  service, not an approved immutable saved-video dataset or its custodian.
- `.github/workflows/videos-verification.yml` at the PR checkout: a candidate
  manual workflow names the `videos-verification` environment and verification
  secrets. Public `GET /repos/foxleigh81/foxyslab-website/contents/.github/workflows/videos-verification.yml?ref=main`
  returned 404. The candidate is not evidenced as an installed trusted route;
  it also passes secrets to PR-controlled build/server code.
- `docs/validation/videos-operations-round-9.md` and
  `docs/validation/videos-operations-round-10.md`: prior local assessments
  explicitly lack source approval, an immutable dataset identity, an authorized
  operator, and independent controls clearance. These are handoff records, not
  approvals or evidence of effective external settings.

## Finding and required access

No inspected record identifies the saved-video source, its custodian, or the
person authorized to approve its use. Marcus is the named Engineering research
coordinator, not an evidenced data custodian or dataset-use approver. The exact
private saved-data resource cannot be named from the accessible public records.
Marcus needs read access to the Foxtail Engineering operations/source inventory
that records the saved-video asset and its owner, and the source owner must
provide an approval receipt covering the immutable snapshot, permitted use and
delivery route. The inventory's exact resource identifier and access-control
owner are not exposed here; they must be supplied by Studio operations rather
than guessed from the website repository.

The candidate GitHub Actions workflow is not an authorized private route.
An operations owner must identify the trusted controller revision, permitted
executor and data-delivery boundary, then obtain Macklin's independent control
assessment before any dataset or credential release. The website sandbox has
no access to Studio operations records, protected GitHub environment settings,
or the private saved dataset; its network is limited to GitHub and package
registries. No private access was attempted and no populated data or credentials
were released.

Posting this finding to issue #71 requires authenticated GitHub Issues write
access for `foxleigh81/foxyslab-website`; the current sandbox has no `gh`
executable, GitHub token environment variable, or configured credential helper.
`POST /repos/foxleigh81/foxyslab-website/issues/71/comments` returned HTTP 401
`Requires authentication`, so this local record has not been posted to the issue.
