# Round 48: credential-safe report retention

Reviewed head: `5dad59005cc8d89680448f493065496487d95d81`. The local checkout
and GitHub PR #79 head matched on 2026-10-15. This record describes that head
and local uncommitted changes; it does not claim a remote run of these changes.

## Reproduced and fixed

A malformed Lighthouse report containing the synthetic value `synthetic48`
caused `JSON.parse` to quote that value in its exception. The CLI prints exception
messages, so the value could enter retained Actions logs. The verifier now emits
only a fixed Lighthouse run-number diagnostic for unreadable or malformed JSON.
It also deletes raw browser and Lighthouse outputs on success and failure,
retaining only the existing minimized numeric summary. Browser diagnostics no
longer direct reviewers to raw reports that are not retained.

The existing workflow uploads only `run-*/summary.json`; no workflow changes
were needed. Tests exercise synthetic credentials in successful browser and
Lighthouse output, malformed JSON, retained files, and captured diagnostics.
The upload-selection regression confirms that only summaries match the workflow
artifact paths. These checks assert exact synthetic-value absence and retained
file inventories, rather than relying on credential-pattern scans.

## Red, green, and refactor

- Red: `npm test -- lib/__tests__/verify-videos.test.ts -t 'omits synthetic credentials'`
  exited 1. The observed parser exception contained `synthetic48`.
- Green: the same command exited 0 after the fixed diagnostic and raw-report cleanup.
- Refactor: extracted `discardRawReports` so the retention policy is explicit.
  `npm test -- lib/__tests__/verify-videos.test.ts lib/__tests__/videos-artifact-retention.test.ts`
  then exited 0, with all 17 tests passing.
- `npm ci --no-audit --no-fund`, `npm run lint`, and `npm run type-check` exited 0.
- `npm test` exited 0: 37 files passed, 318 tests passed, one skipped.
- `git diff --check` exited 0.

## Current-head remote evidence and blocker

The API reports [run 38750910288](https://github.com/foxleigh81/foxyslab-website/actions/runs/38750910288)
failed at job `116476748159`, step 6, "Build, check populated gallery, and measure
three mobile runs". Checkout, npm install, Chromium installation, and the later
artifact/link steps succeeded. The artifacts API reports zero artifacts. This
does not identify which child failed or prove that any populated check passed.

Both `/actions/jobs/116476748159/logs` and `/actions/runs/38750910288/logs`
returned HTTP 403. No raw logs or real credentials were downloaded or retained.
The precise child failure remains blocked by log access; the locally reproduced
parser leak is not claimed as the cause of that CI failure. Safe stage diagnostics
from an authorized Actions session are still required to diagnose it.

The exact-head deployments API identifies Preview deployment `7095282700`, with
successful status and environment URL
`https://foxyslab-website-5cf1dd31p-foxleighco.vercel.app`.
An unauthenticated `/videos` request returned HTTP 302. No rendered-page or
performance claim is based on that redirect.

`npm run verify:videos` exited 1 at preflight with only missing variable names:
`YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
No local credentialed build, populated browser check, or Lighthouse run started.
The same-repository Actions workflow remains the place to run those checks with
repository secrets. This sandbox has no authenticated Actions session to run
the uncommitted changes. Credentialed acceptance and the exact remote failure
diagnosis remain incomplete; no current-head CLS/LCP measurements are claimed.
