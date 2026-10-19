# PR #79 head-to-evidence reconciliation

Observed 2026-10-19. The local checkout and GitHub's live, open draft PR #79
both point to `79cb880a44c382044bb97876d7043b36be8af71e` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. The PR targets
`eca93e0605ecf22f3eb8943a5fc84a37a65e11b1` and lists 82 changed files;
its file list matches the local base-to-head diff. This remains the single
review path. No new workflow was dispatched for this reconciliation.

| Evidence | Head binding | What it establishes |
| --- | --- | --- |
| [CI run 39290824396](https://github.com/foxleigh81/foxyslab-website/actions/runs/39290824396), jobs 118190717964, 118190717411, 118190717912 | All three job records name `79cb880a44c382044bb97876d7043b36be8af71e` and succeeded | Reusable exact-head lint/type-check/unit, E2E, and generic build/Lighthouse job results. The generic build sets `ALLOW_MISSING_API_KEYS=true`; it cannot establish populated `/videos` or valid build-time data credentials. |
| CI artifacts `coverage` (12205338093) and `playwright-report` (12205965857) | Attached to run 39290824396 | Artifact metadata exists; anonymous download returned HTTP 401 and job logs returned HTTP 403. No `lighthouse-results` artifact was listed. Browser assertions, emitted thumbnail hint, and numeric CLS/LCP results cannot be read from these artifacts here. |
| Reported thumbnail regression result from the completed implementation run | Reported as `3b5d7172d7c96c5a289e93cbe65c67a019ef7765` | Mismatched with the live PR head. This SHA is absent from the local object store and GitHub's commit lookup returned HTTP 422; its changed files and test output cannot be independently inspected here. It is not exact-head regression evidence. |
| Earlier [populated videos run 39285022085](https://github.com/foxleigh81/foxyslab-website/actions/runs/39285022085) | `dc64483aca760a7ed7a6172212b8359defadc824` | Historical success only. The live PR includes later commits, so its results cannot verify the present head. |

GitHub's exact-head check list contains the three CI jobs and Vercel Preview
Comments, but no credentialed `Populated Videos Verification` check. The
Actions run search for the exact SHA returns only CI run 39290824396. PR #79's
reviews API returns no reviews. These metadata checks do not substitute for
Macklin's independent security review or Ashley's QA verdict.

Remaining ticket evidence: an approved, credentialed production-equivalent
build and populated browser observations for initial cards and hydration/footer
stability; search, playlist selection, forward/back pagination, direct playlist
URLs, and labelled empty/error states; the emitted first-thumbnail priority
hint; three numeric mobile CLS/LCP pairs with each CLS below 0.1; and a focused
initial-layout regression tied to the resulting head. The existing CI run may
be reused for its stated checks only. No new behavior defect is demonstrated by
this reconciliation, so there is no meaningful red-green-refactor code test.
