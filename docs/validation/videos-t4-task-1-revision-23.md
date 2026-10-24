# T4 task 1: exact-head artifact and private-route receipt

Inspected 2026-10-24 at initially clean local HEAD
`5f801566481ef3ee7f25c83d41d12696a7e5ed27` on the assigned branch.
This receipt covers that source head, not the later harness commit.
Disposition: **blocked**; no credentialed run or duplicate CI was dispatched.

## Retained artifact inspection

Fresh anonymous GitHub API reads established the following:

| Observation | Receipt / disposition |
| --- | --- |
| Supplied job `120738886756` | `GET /repos/foxleigh81/foxyslab-website/actions/jobs/120738886756` identifies successful Build & Lighthouse job in run `40049543793`, attempt 1, at the source SHA above. |
| Retained artifact | Run artifacts endpoint returns one artifact: `12543091725`, `lighthouse-results`, 270 bytes, not expired. Metadata binds its workflow run to the same SHA. |
| Artifact identity | API-reported digest `sha256:69797196bcceed8cd8f2dacf6aa6a5a62cf7d002d4cd7163cc3a6bc3a8a8a8d4`; created `2026-10-24T01:27:26Z`, expires `2026-11-07T01:27:25Z`. This is archive metadata, not a saved-data digest or a locally verified checksum. |
| Numeric readout | `GET /repos/foxleigh81/foxyslab-website/actions/artifacts/12543091725/zip` returned HTTP 401, Requires authentication. No archive bytes or numeric values were obtained. |
| Alternate check output | Check-run endpoint for `120738886756` returns null title, summary and text. It supplies no numeric readout. |

[Run and job](https://github.com/foxleigh81/foxyslab-website/actions/runs/40049543793/job/120738886756)
and [artifact](https://github.com/foxleigh81/foxyslab-website/actions/runs/40049543793/artifacts/12543091725)
identify evidence locations; neither link is a measurement. The checked-in CI
uploads `.lighthouseci/ci/summary.json` and permits missing API keys. That describes
the expected producer, not inspected archive contents. Whether the archive
contains `/videos` samples remains unknown. Successful extraction/upload steps
and its byte size do not prove populated data or numeric coverage. An authorized
reader must inspect this retained archive and record its bounded numeric fields
before deciding that any extraction change or repeat run is needed.

## Private route: unresolved independent controls

Fresh `GET /contents/.github/workflows?ref=main` returned HTTP 200 with only
`ci.yml`. The branch-local `videos-verification.yml` requires a `main` dispatch;
it is not an established premerge controller. Changing that branch condition
would not establish independent control. No configuration change is justified
by an observed extractor failure in this inspection.

| Required receipt | Current disposition and completion requirement |
| --- | --- |
| Controller and executable invocation | Blocked: no independently owned private controller location, immutable revision, permitted caller or credential-free dry-run receipt supplied. Its owner must provide an executable invocation that can check out this draft SHA without a preliminary merge and reject mismatched head/approval/data bindings. |
| Approved populated input | Blocked: no approved manifest, immutable saved-data reference, capture provenance or SHA-256 supplied. Existing live YouTube fetching does not bind build/runtime to saved bytes. Saved-data ingestion is the subsequent planned task. |
| Valid credential source | Blocked: no custodian receipt attesting source, scope, validity and exact-head release authorization. Workflow secret names are not such a receipt. No secret values were retrieved. |
| Independent approval | Blocked: no Macklin disposition binding head, controller revision, manifest digest and credential/output controls supplied. No authorized owner-contact tool is available here; no contact or approval is claimed. Approval must precede credential access by PR-controlled install/build/runtime code. |
| Effective readers and retention | Blocked: environment endpoint returned HTTP 404; artifact/log-retention endpoint returned HTTP 401. These are anonymous access limits, not proof that protections are absent. Archive expiry metadata does not establish private readers or log/summary retention. The independent owner must record effective readers, expiry and publication controls for every output surface. |
| Failure/cancellation cleanup | Blocked: existing verifier tests cover local report cleanup, not isolated runner destruction after cancellation or loss. The controller owner must demonstrate process termination and destruction of inputs, rendered output, caches and raw reports on success, failure and cancellation, with receipts. |

Do not inject private data into ordinary CI. PR-generated summaries require
independent minimization before publication; no saved payloads, secrets or raw
reports belong in PR artifacts. This local record neither creates an external
dispatch hold nor establishes a tested private route. The missing independent
receipts cannot be replaced by another PR-controlled workflow.

## Ticket disposition

- Observed: exact-head job/artifact metadata and anonymous access failures above.
- Blocked: artifact contents/numeric readout and all private-route acceptance
  controls; no measured website failure or extractor defect established here.
- Blocked on approved populated data and private execution: initial cards or
  stable reservation, hydration/footer stability, three mobile CLS values below
  0.1 with paired LCP values, first-thumbnail priority, search, playlists,
  pagination in both directions, direct URLs and distinct empty/error states.
- Blocked: approved-data regression, valid-credential production build and
  populated browser/Lighthouse evidence. Local unit checks cannot satisfy these.
- Pending separate lead-owned operational gate: after authorized Production
  deployment, Marcus records revision, request time and credential-safe live API
  response outcome. This remains a ticket criterion, not a sandbox task.

No LCP improvement, later-head verification, review approval or release readiness
is claimed. Tasks 2 and 3 and the operational gate remain outstanding.

## Local validation

Documentation only: no executable behavior changed, so no meaningful automated
red/green/refactor test or production refactor applies. No red run is claimed.
Fresh configured checks:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0,
  987 packages installed; npm configuration, deprecation and install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0, 39 files passed, 353 tests passed and 1 skipped;
  Vite configuration-loader compatibility warning.
- `git diff --check`: exit 0.

No populated production build, browser run or Lighthouse rerun was attempted.
These checks do not verify the later PR head or satisfy the external gates.
