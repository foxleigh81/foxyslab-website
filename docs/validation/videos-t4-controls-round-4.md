# T4 task 1: populated-data verification controls

Revision round 4, inspected 2026-10-20 starting at 22:15:32 UTC. This is the
current controls packet; older validation records describe historical evidence,
not effective controls for this head.

## Subject and remote observations

Local HEAD is `6f9a269912dae905dce1355c1dce141dda018438` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. The tree was clean
before this documentation change. Fresh unauthenticated GitHub REST reads used
Python `urllib.request`, without credentials, against
`https://api.github.com/repos/foxleigh81/foxyslab-website`:

| Read | Observed result |
| --- | --- |
| `GET /pulls/79` | 200; open draft; head matches local HEAD; base `eca93e0605ecf22f3eb8943a5fc84a37a65e11b1` |
| `GET /contents/.github/workflows?ref=main` | 200; only `ci.yml`; populated-verification workflow absent |
| `GET /environments/videos-verification` | 404; effective protections unavailable to this reader |
| `GET /actions/secrets` | 401; repository secret inventory unavailable |
| `GET /actions/permissions/artifact-and-log-retention` | 401; effective retention settings unavailable |
| `GET /deployments?sha=6f9a269912dae905dce1355c1dce141dda018438&per_page=10` | 200; one Preview deployment, ID `7211663515`, matching SHA, created `2026-10-20T21:35:31Z` |
| `GET /deployments/7211663515/statuses?per_page=1` | 200; latest returned status `success`, created `2026-10-20T21:35:32Z` |

The reported Preview URL is
`https://foxyslab-website-nngjr1r6u-foxleighco.vercel.app`; the browser target
would be `/videos`. The sandbox permits GitHub and package registries, not that
origin, so no Preview request was made. Its access protections and populated
content were not observed. Deployment metadata is not a browser result or an
attestation of build inputs. These reads bind only the inspected source, not
the future harness commit.

## Inventory for independent assessment

| Control | Observed source evidence | Blocker and observable condition needed to proceed |
| --- | --- | --- |
| Approved populated saved data | `lib/youtube.ts` fetches live YouTube v3 data with Next cache revalidation. `test/fixtures/youtube.ts` contains synthetic objects; `app/videos/__tests__/page.test.tsx` expands one into 25 synthetic videos. The verifier generates only synthetic empty/error markup. | No approved saved dataset, manifest or production ingestion route was identified in the inspected sources. A data owner must identify the approved source, capture time, immutable digest, video/playlist counts, pagination coverage and build ingestion route. Cached live responses and synthetic fixtures do not establish saved-data provenance. |
| Exact-head binding | Branch-local `.github/workflows/videos-verification.yml` compares `expected_sha` with the live PR before checkout and before verification, checks local HEAD and disables persisted checkout credentials. The verifier records `git rev-parse HEAD`. | No independently approved controller revision or exact-head approval receipt is available. Approval must bind controller and reviewed head, reject changed subjects and revalidate the head at release. A summary SHA alone is not approval. |
| Private build/browser route | Candidate workflow requires dispatch on `main` and environment `videos-verification`; it is absent from `main`. `scripts/lib/verify-videos.mjs` runs a production build without missing-key bypass, starts `next start` on an unused loopback port, runs dedicated desktop/mobile Chromium checks and three mobile Lighthouse runs. GitHub reports the exact-head Preview above. | Neither candidate is an established accessible private verification route here. An authorized operator must identify the immutable controller, entry point, permitted caller and private browser access with a credential-free capability receipt. YouTube, Fourthwall and image origins are also outside this sandbox's network allowance. |
| Credential-release boundary | Candidate YAML names environment secrets `VIDEOS_VERIFY_YOUTUBE_API_KEY`, `VIDEOS_VERIFY_FOURTHWALL_STOREFRONT_TOKEN` and `VIDEOS_VERIFY_FLAGS_SECRET`. The verifier passes credentials to build/server, excludes them from browser/Lighthouse environments and suppresses child output. | Required reviewers, self-review prevention, bypass settings, allowed refs, equivalent repository/organization secrets and issuer restrictions are unverified. Credentials enter the verification step environment before its shell checks, so those checks are not the release gate. Installation and later commands execute PR-controlled code on the same runner. Macklin must assess the effective external gate and whole execution route before any credential release. |
| Raw-artifact classification | Dedicated Playwright config disables traces/screenshots but writes browser JSON and a browser-artifacts directory. Reports can contain content, errors, URLs and attachments. The verifier minimizes diagnostics and deletes everything except `summary.json` in the browser/measurement `finally` path. | Treat raw reports, fixture HTML and build/cache outputs as potentially sensitive pending private classification; disabled capture does not certify every output. No actual archive was inspected. Ordinary cleanup does not prove cleanup after runner termination, nor cover every build/server-start failure or `.next` cache. Require evidence of private runner access, scratch-data destruction and cancellation/failure handling. |
| Retention and access | Candidate upload allows only `run-*/summary.json`, requests 14 days and links the artifact in the job summary. General CI separately retains Playwright output for 14 days; its build allows missing API keys. | Effective artifact/log/job-summary readership and expiry are unknown (retention endpoint returned 401). The minimized summary is still produced by PR-controlled code and needs independent assessment before publication. Historical containment records are not fresh classification/removal receipts. An operator must confirm access, expiry and outstanding historical disposition without publishing raw content. |

No credential values, raw archives or raw logs were requested or read. No
credentialed build, workflow, browser measurement or external message was
dispatched. HTTP 401/404 proves this reader's limitation, not the absence or
effectiveness of safeguards.

## Assessment handoff and routing

This file is the reviewable packet for the harness/lead to route to Macklin.
No independent assessment receipt is available; no direct submission or approval
is claimed. The decision must identify the inspected immutable subjects and
evidence for data provenance, controller/head binding, credential release and
artifact handling. The specific blockers are unavailable approved saved-data
provenance, no established accessible premerge route, and unobserved effective
credential/artifact controls. Source configuration alone cannot clear them.

After those controls are evidenced and independently cleared, the authorized
verification owner revalidates the then-live head and records observed, failed
or blocked results for populated initial cards/footer stability; three mobile
CLS values below 0.1 with paired LCP and emitted first-thumbnail priority;
search, playlist filtering, pagination, direct URLs and empty/error states;
the focused regression, lint, type-check, unit/E2E checks and populated build.
The supplied historical baseline is CLS 0.511 in each run and LCP 3.8, 4.3 and
11.8 seconds. No new measurements or network-dependent LCP improvement are
claimed. A reproduced website failure would require a test-first repair; the
supplied current-head failure list is empty.

Scheduler initial-dispatch and retry/resume testing belongs to Chris's separate
authorized Engineering work. It is not a PR #79 premerge dependency and no
scheduler outcome is claimed. Live API integration remains post-deployment work
requiring an identified Production revision, not a premerge dispatch task.
Studio provenance, permissions, plan generation 28 and run
`r20261020-0901bf067803` state are not inspectable through this session's tools;
the calling driver retains those checks.

## Local validation

Only documentation changes. There is no executable behavior for a meaningful
new automated red/green/refactor cycle; no red run, repair or refactor is claimed.
Local checks do not establish populated acceptance criteria.

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0;
  987 packages installed, with configuration/deprecation/install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 345 tests passed, 1 skipped. This includes
  the existing populated synthetic layout regression. Vite emitted a config
  compatibility warning.
- `git diff --check`: exit 0.

No populated production build, E2E run or Lighthouse run was attempted in this
inventory revision. No new production report links exist; ordinary unit results
cannot substitute for the blocked populated checks.

Release readiness remains **no**: independent controls clearance, populated
verification and the later Production integration result are outstanding.
