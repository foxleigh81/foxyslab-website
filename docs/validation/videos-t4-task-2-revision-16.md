# T4 task 2: populated verification admission, revision 16

Date: 2026-10-23. Disposition: **BLOCKED; not admitted**.

## Subject and evidence limits

The initially clean local checkout is on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t` at
`4231edc9cd6a0779d3edaf70665c28146f1738b3`, matching the supplied previous
PR #79 head. The live PR head and later harness commit were not verified.
The supplied runner head `49c973d6b5a037489aedf045cf6285ee7440360e` differs;
no owning-system receipt reconciles that operation with this checkout.
Chris coordinates that separate delivery-system disposition and tested
dispatch boundary. This document does not establish either control.
The supplied current exact-head failure evidence is empty, so it provides
no reproduced website defect to repair.

## Admission record

| Prerequisite | Observed evidence and disposition |
| --- | --- |
| Approved production-shaped saved-video dataset and digest | **Blocked.** No approved source identifier, capture time, immutable SHA-256 digest or source-owner approval was supplied. The initial-layout unit test uses 25 synthetic videos and a playlist containing the last 13. These fixtures do not establish approved saved-data provenance. `lib/youtube.ts` fetches live API data; the existing verifier exposes no saved-snapshot input or digest binding. An approved ingestion route and population receipt covering pagination, playlists and search are required. No synthetic digest is substituted for an approved dataset digest. |
| Credential-safe retained-artifact route | **Blocked.** The candidate workflow retains `.lighthouseci/videos/run-*/summary.json` for a requested 14 days and prints it in the job summary. The verifier excludes application credentials from browser children and discards raw reports in `finally`; the browser configuration disables screenshots and traces. These code controls do not establish approved readership, effective access/expiry, summary classification, cancellation cleanup or historical artifact disposition. An authorized owner must identify the private destination and provide those control receipts before retained reports or links are produced. |
| Valid build-time credential availability | **Blocked.** Presence-only inspection found `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN` and `FLAGS_SECRET` absent. Validity is unverified; no values were read or copied. The candidate verifier builds with `NODE_ENV=production` and `ALLOW_MISSING_API_KEYS=false`, then serves that build with `next start`. Secret references in workflow YAML do not prove availability or validity. A non-secret receipt must attest valid credentials available to the approved build route after independent approval of the exact PR head. Required application API/image origins are outside this sandbox's permitted network. |
| Macklin's independent credential disposition | **Blocked / not recorded.** No independent decision for this head, approved source and execution route was supplied. Require reviewer identity, timestamp, exact subjects, scope and explicit disposition before credential release. This implementer's inspection is not that decision. |

The existing configuration remains a candidate route, not an admitted run.
Its workflow requires `main` and the `videos-verification` environment;
availability on that dispatch ref and effective environment protections were
not revalidated here. The authorized external owner must establish an approval
gate before PR-controlled code receives secrets, invalidate it on head changes,
and bind the dataset digest, controller revision, build identity and retained
reports to the revalidated head. No CI, deployment or credential-handling
configuration changes are needed for this admission record.

## Task outcome and remaining work

Admission criteria 1 and 2 remain blocked; criterion 3 is addressed by this
explicit blocker record. Missing prerequisites are neither product failures
nor passes. This record does not create an external scheduler hold or claim
that an owner accepted a handoff.

No credentialed verification, production build, browser or Lighthouse run was
started. After the separate operation/dispatch disposition and all admission
receipts are established, exact-head verification still needs populated
initial markup and hydration/footer observations, three mobile CLS/LCP pairs,
the first-thumbnail priority hint, search/filter/pagination/direct-URL and
empty/error-state results, and populated build/E2E evidence with approved
report links. Live API integration remains pending an authorized Production
deployment of an identified revision. No release or independent review
approval is claimed.

## Local validation

Documentation only: executable behavior is unchanged, so a focused automated
red/green/refactor test is not meaningful. No red run or refactor is claimed.
Fresh local checks:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0;
  987 packages installed, with configuration/deprecation/install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 39 files passed, 353 tests passed, 1 skipped. Vite
  emitted its configuration-loader compatibility warning.
- `git diff --check`: exit 0.

These checks do not establish populated production acceptance or verify the
future PR head. No populated measurement artifacts or report links were produced.
