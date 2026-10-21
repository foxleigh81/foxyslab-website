# T4 task 2: private saved-data route disposition

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
