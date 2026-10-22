# T4 task 2: private saved-data route disposition

## Task 2 recheck, revision round 10, 2026-10-22

This section supersedes earlier dispositions below for this sandbox run. The
initially clean checkout is on the assigned branch at
`776078026f8ad8c34cea20d486cbbdd7ffeaf830`, matching the brief's previous
checked head. This is a local source identity, not a refreshed live PR or
Preview identity. The later harness commit needs its own verification.

**Blocked before private populated-data verification.** The supplied current
exact-head failure evidence is `[]`. The [task-1 investigation](videos-lead-handoff-round-9.md)
records an unavailable Studio ownership inventory and original lookup trace;
it does not resolve operation `r20261022-400067055107`. No terminal-state
receipt or driver revalidation of permissions, provenance and live PR #79 was
supplied for this run. This sandbox exposes no Studio inventory/operation or
owner-contact tool. A sanitized receipt/reference was requested in-session;
no owner contact, external hold, dispatch or independent approval is claimed.

### Inspected route and outstanding receipts

Inspected both workflows, the verifier entry point and library, ordinary and
production Playwright configurations, `e2e/videos-gallery.spec.ts`,
`lib/youtube.ts`, Lighthouse configuration and artifact-retention tests before
considering changes. These observations establish local implementation facts,
not the effective controls of an external runner.

| Boundary | Observed implementation | Specific remaining dependency |
| --- | --- | --- |
| Saved populated source | YouTube data comes from live API fetches. The verifier accepts no saved-source identifier or digest. Empty/error browser fixtures use synthetic page-test markup. | Marcus must obtain data-owner approval, immutable source ID/digest and capture time, coverage for search/playlists and more than one page, plus an approved ingestion command shared by build and runtime. No private payload belongs in this record. |
| Exact-head private route | The candidate workflow requires a dispatch on `main`, compares the supplied SHA with PR head, and checks out that SHA. The verifier records local Git HEAD, builds and serves on loopback. | Driver resolution/revalidation receipt, immutable accessible controller identity, private runner/access receipt, exact PR head and actual build/Preview identity. This run neither revalidated the live PR nor executed a build. |
| Credential release | The candidate names the `videos-verification` environment and injects dedicated secrets into the verification step before its shell recheck. Install and browser setup run earlier on the same runner. | Macklin's independent assessment must cover the exact head, controller and source, including effective approval before credential release and PR-code execution. A named environment or SHA comparison is not proof of those controls. Valid credentials must remain with their approved owner/runner. |
| Retention | Production browser traces/screenshots are off. The verifier suppresses child output and removes raw browser/Lighthouse reports in its browser-stage cleanup. The candidate uploads summaries for 14 days and prints them in the job summary. Ordinary Lighthouse uses `temporary-public-storage`. | Independently assessed readership, allowed summary content, log/artifact expiry and cleanup of build caches/scratch data on success, failure and cancellation. PR-generated summaries and filename allowlists alone do not establish safe publication. Ordinary Lighthouse is unsuitable for private data without approved containment. |

The existing conditional command is `npm run verify:videos`: it runs the
production build, loopback server, production browser checks and three mobile
Lighthouse runs. It is a live-data command, not an executable saved-data route.
No credentialed command was launched and no data, key, raw artifact or new
measurement report was published. Network access here excludes application
API, thumbnail and Preview origins. Source access and valid-credential behavior
remain untested.

### Acceptance and local validation

Task criterion 1 remains blocked on Macklin's review and effective private
retention controls. Criterion 2 has the specific external dependencies recorded
above; it does not yet have an approved route or populated results. Criterion 3
has no setup-code change to validate: no new setup defect was reproduced from
the available evidence. This documentation-only update has no meaningful
automated behavior red/green/refactor cycle; none is claimed.

Fresh local checks:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0;
  987 packages installed, with npm configuration/deprecation/install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 346 tests passed, 1 skipped, including
  the existing verifier, workflow-security and artifact-retention checks.
  Vite emitted its configuration-loader compatibility warning.

These checks cannot replace approved populated build/browser evidence, three mobile CLS values
below 0.1 with paired LCP and thumbnail-priority observations, or the authorized
post-deployment live API check. The recorded baseline remains CLS 0.511 for
all three runs and LCP 3.8, 4.3 and 11.8 seconds. Release readiness remains
**no**.

## Task 2 recheck, revision round 12

Recorded 2026-10-21 at local source HEAD
`8d3251e54e038a2ef3f4a3a8de084c2bab551653` on the assigned branch. This
matches the brief's previous checked head; the then-live remote PR head was not
queried. This section is the current local coordination record; older sections
retain historical observations only.

**Disposition: blocked before credentialed dispatch.** Inspection of
`lib/youtube.ts`, `scripts/verify-videos.mjs`, its library and the candidate
workflow still identifies a live-API build/browser route, not immutable saved
data ingestion. No data-owner approval, approved source identifier/digest,
access-check receipt, Macklin assessment or Dennis tested-gate receipt was
supplied. The empty current-head failure evidence does not establish an
application defect. No website repair, CI change or new verification launch is
justified by these observations.

| Required durable receipt | Current evidence and accountable continuation |
| --- | --- |
| Data-owner approval and immutable populated source | Missing. Marcus must obtain the owner's approval reference, private immutable source ID/digest, capture time and coverage counts without recording payloads or credentials here. |
| Source access check | Not performed: no approved source or authorized access route is available. Marcus must record a credential-free capability result and the authorized private access-check receipt. A synthetic fixture is not this evidence. |
| Executable private route and run command | Existing `npm run verify:videos` builds, serves and browses live data; it accepts no saved-source input. Marcus must identify the private controller repository/revision and exact invocation that supplies the approved source to both build and runtime, plus required network access. No executable saved-data command can presently be recorded. |
| Head binding | Local source SHA above is observed only. Before dispatch, the controller must resolve the live PR #79 SHA and bind source digest, controller revision and independent approval to that exact SHA; a mismatch requires renewed assessment. |
| Independent controls assessment | Missing. Macklin must assess credential release before PR-code execution, effective access, log/artifact retention and cleanup on success, failure and cancellation for the same source/controller/head. The candidate's shell SHA recheck occurs after secret injection and does not establish independent approval. |
| Tested dispatch gate | Missing. [Dennis's round-11 investigation](videos-driver-gate-round-11.md) records that the actual driver repository and tested gate remain unidentified. It is a blocker record, not a tested-gate receipt. |
| Sanitized receipt location | This file records local coordination only. No external private receipt location or published issue #71 coordination link was supplied. Marcus must record the approved private receipt URI and sanitized report link; Dennis must link the gate receipt from its owning repository, and Macklin must link the independent assessment before dispatch. |

The current task cannot close any of its three acceptance criteria: source
approval/access remain unavailable, the saved-data route is not established,
and both independent prerequisite receipts are absent. No credentialed dispatch
was attempted. No applied hold in the external driver, owner contact, approval,
source accessibility or cleanup result is claimed by this local record.

The [production runbook](videos-production-checks.md) describes the conditional
live-data commands and their limitations. Its historical head is not approval
for this checkout or the later harness commit. The next authorized private run
must publish sanitized, exact-head results for populated initial layout and
hydration/footer stability, browser behavior, three mobile CLS/LCP pairs and
thumbnail priority. Post-deployment API evidence must separately identify the
Production revision and observation time. None was measured in this round.

This update changes documentation only; there is no executable behavior for a
meaningful red/green/refactor cycle. No red run or production refactor is claimed.
Local configured checks (all exit 0):

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: 987 packages
  installed; npm configuration, deprecation and install-script warnings.
- `npm run lint`.
- `npm run type-check`.
- `npm test`: 38 files passed, 346 tests passed and 1 skipped; existing Vite
  configuration-loader warning.
- `git diff --check`.

These local checks do not prove source access, independent approval or populated
production behavior. Release readiness remains **no** until the missing receipts
and the remaining ticket verification are complete.

## Task 1 recheck, revision round 7

Inspected locally on 2026-10-21 at source HEAD
`11346443c345565e30107c96f0424e623925a580`, on the assigned branch. This
matches the previous checked head supplied in the brief; the live PR head and
external controls were not revalidated in this round. The round 6 observations
below remain historical evidence, not fresh API results.

**Disposition: blocked before credential release.** Local inspection still
finds a live YouTube v3 producer and no approved saved-data ingestion route.
The candidate workflow requires a `main` dispatch and injects credentials before
its shell recheck; neither its presence nor a shell SHA comparison establishes
effective independent approval. No approved dataset manifest, executable private
controller receipt or Macklin assessment was supplied. This sandbox has no
owner-contact interface and its network excludes the application data/image
origins. No credentials were requested, copied or released, and no workflow was
dispatched. No application defect is established by the supplied empty failure
evidence, so no website repair or CI change is justified by this task.

Resolution must be observable as Marcus's route receipt identifying the immutable
saved-data source/digest and ingestion command, private runner/controller revision,
exact PR SHA, and effective access/retention/cleanup controls, followed by
Macklin's independent assessment of those same subjects before credential
injection. Unresolved findings block execution. The receipt must include a
credential-free capability check and an executable invocation that binds build
and runtime to that dataset; the current live-data verifier alone cannot do so.
Subsequent results must identify the actual tested SHA and report links. This
implementer record is not an owner receipt or independent assessment.

Containment remains unresolved for the previously inventoried artifacts
`12308356111`, `12218763710` and `12216535219`; their current remote existence,
contents and disposition were not checked. The linked historical records require
an authorized operator's private classification and, if unsafe, removal and any
necessary credential-owner remediation. No deletion or safe-content finding is
claimed. Local inspection found no `.lighthouseci`, `playwright-report`,
`test-results` or `.next` directory before checks, so there is no local generated
verification output to contain. Ordinary Lighthouse still uses public temporary
storage; the candidate's PR-generated summaries and job logs still need effective
private retention and independent publication validation. A filename allowlist
does not establish safe content.

This is a blocker-record update only. There is no changed executable behavior
for a meaningful red/green/refactor test; none is claimed. Populated production
build, browser and Lighthouse checks remain blocked. The separate post-deployment
API observation still requires an identified Production revision.

Local configured checks for this round:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0,
  987 packages installed; configuration/deprecation/install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0, 38 files passed, 346 tests passed and 1 skipped;
  existing Vite configuration-loader warning.
- `git diff --check`: exit 0.

These checks do not establish private-route approval or populated measurements.
Release readiness remains **no**.

## Historical round 6 record

Revision round 6, inspected 2026-10-21. Credential release remains **blocked**.
This replaces the earlier task-2 inventory with current observations. It is an
implementer record for Marcus and Macklin, not either owner's approval receipt.

## Exact-head reconciliation

The clean starting checkout and fresh anonymous GitHub `GET /pulls/79` identify
`0b5ec39c2361be7af3d8c93403328b0e4d56e1fb`, open and draft. Both workflow files
fetched through `GET /contents/.github/workflows/<file>?ref=<head>` match the
local files byte-for-byte. These observations do not verify the harness's next
commit.

Round 5's removal of ordinary CI Playwright uploads is present. The quality and
E2E jobs run checks without uploading reports. The populated candidate still
uploads `.lighthouseci/videos/run-*/summary.json` and prints it in the job
summary; ordinary Lighthouse still uploads `.lighthouseci/` and configures
`temporary-public-storage`. These are distinct retention paths. Do not pass
private saved data to ordinary CI or its Lighthouse command.

The head-filtered Actions API returned
[CI run 39519975583](https://github.com/foxleigh81/foxyslab-website/actions/runs/39519975583)
in progress, with no artifacts listed at inspection. This is neither a final
CI result nor proof of containment. Historical artifact `12308356111` remains
subject to the owner classification/disposition receipt described in
[round 5](videos-artifact-containment-round-5.md); no archive was accessed or
removed in this revision.

## Route and access inventory

| Boundary | Current observation | Specific prerequisite still missing |
| --- | --- | --- |
| Saved-video source | `lib/youtube.ts` fetches YouTube v3 with cache revalidation. The verifier has no saved-data input. Unit fixtures are synthetic. | Data-owner-approved private source identifier, capture time, immutable digest, counts and playlist/pagination coverage; approved ingestion into both production build and runtime. No saved-data route is established. |
| Controller | `GET /contents/.github/workflows?ref=main` returned 200 with only `ci.yml`. The branch-local candidate requires `main`. | Accessible private premerge controller at an immutable revision, permitted caller, exact PR SHA and credential-free capability receipt. The candidate cannot currently serve as its own default-branch entry point. |
| Credentials | `GET /environments/videos-verification` returned 404. Candidate data secrets enter the step environment before its shell checks. | Effective reviewers, self-review/bypass/ref restrictions and equivalent-secret inventory; independent approval before secret injection, including PR install/build/server execution on the runner. A shell SHA check does not supply approval. |
| Artifacts and logs | `GET /actions/permissions/artifact-and-log-retention` returned 401. Candidate requests 14 days. Summary content originates in PR-controlled code. | Effective private readership/expiry for logs, summaries and artifacts; independently assessed publication validation; scratch/build-cache destruction on success, failure and cancellation. Filename selection alone cannot certify content. |
| Browser access | Verifier builds production, starts a loopback server and runs desktop/mobile checks plus three mobile Lighthouse runs. | Authorized private runner with approved data and required network/image access. This sandbox cannot reach the application data/image origins. |

HTTP 401/404 records this reader's access limit, not proof that protections are
absent. No secrets, saved payloads, raw logs or archives were requested.

## Conditional run procedure and owner handoff

The [production runbook](videos-production-checks.md) now states these entry
gates before its commands and explicitly identifies its existing live-data
source. Once the saved-data route exists and is independently approved, the
owner must bind its invocation to the manifest digest and exact reviewed head;
the present `npm run verify:videos` command cannot claim that binding.

The existing command sequence is `npm ci`, Chromium installation, `npm run lint`,
`npm run type-check`, `npm test`, and `npm run verify:videos`. The verifier runs
`npm run build`, loopback `next start`, dedicated production Playwright checks
and three mobile Lighthouse runs. Its browser children do not receive data
credentials. Its summary retains head/build metadata, browser outcomes and
numeric measurements; partial summaries can exist after failure. Raw reports,
rendered markup and caches require private containment, including paths outside
the verifier's browser-stage cleanup. Only independently validated permitted
fields may be published, with a report link and explicit completion status.

Marcus's required receipt must identify the source, controller, access and
retention evidence in the table. Macklin's independent assessment must bind
those immutable subjects and the exact PR head before any credentialed PR-code
run. Neither receipt is supplied or obtainable through an authorized owner
contact interface in this session. No contact, approval or rejection by those
owners is claimed. An implementer-created approval would not satisfy this gate.
Changes to the head, controller or dataset require renewed assessment.

## Acceptance disposition

| Task criterion | Result |
| --- | --- |
| Exact-head procedure identifies data, access, commands and retained outputs | Partial: existing commands and boundaries reconciled; approved saved-data source and accessible private route specifically blocked above. |
| Changed boundaries have red/green checks; existing security tests stay green | No executable boundary changed. Existing workflow/artifact/verifier checks pass: 38 tests. |
| Macklin assesses before credentialed PR execution | Blocked on independent receipt. No credentialed run initiated. |

The populated build, browser behavior, hydration/footer stability, three mobile
CLS/LCP pairs and emitted thumbnail priority remain unobserved on approved saved
data. No measurement report links or performance improvement are claimed.
Post-deployment live API observation belongs to a separate task naming a
Production revision; it is not a premerge dependency. The external Studio task
graph is not implemented here and was not changed.

## Local validation

Documentation only: there is no changed executable behavior for a meaningful
red/green/refactor test. No failing test, production fix or refactor is claimed.

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0,
  987 packages installed; npm configuration/deprecation/install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test -- lib/__tests__/videos-workflow-security.test.ts lib/__tests__/videos-artifact-retention.test.ts lib/__tests__/verify-videos.test.ts`:
  exit 0, 3 files and 38 tests passed.
- `npm test`: exit 0, 38 files and 346 tests passed, 1 skipped. Existing Vite
  configuration-loader warning emitted.

No populated production build or browser/Lighthouse run was attempted without
its prerequisites. Release readiness remains **no** until the private route,
independent assessment and populated verification are complete.
