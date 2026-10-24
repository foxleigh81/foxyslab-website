# T3 task 3, round 7: local exact-head verification

Checked 2026-10-22 UTC against local SHA
`1bdfe222e43518eff2b8daebe9566d5d7265a072`. The public PR #79 API
reported that same open draft head. This is the source head tested here; the
harness will create a later commit from this working tree.

## Criterion status

| Criterion | Status | Evidence and limit |
| --- | --- | --- |
| Initial populated response and footer position through hydration | Blocked | The 25-video synthetic server-render regression passed, including direct playlist and page-2 markup. There was no populated PR-build HTTP response or before/after footer measurement. |
| Three mobile CLS/LCP pairs, each CLS below 0.1, and emitted first-thumbnail priority | Blocked | No Lighthouse run or populated thumbnail markup was captured. Source and unit tests set `fetchpriority="high"` on the first card, but that is not emitted PR-build evidence. No LCP improvement is claimed. |
| Search, playlist filtering, pagination, direct playlist URLs | Blocked for populated PR behavior | Synthetic interaction tests and server-rendered URL tests passed; no populated PR-build interactions were observed. |
| Distinct empty and error states | Observed in controlled fixtures; production behavior blocked | Desktop and mobile browser fixtures exercise both states separately. Missing-key local requests also entered the fetch-error path, but no valid-credential production response was tested. |
| Focused populated-layout regression, lint, types, unit/E2E, valid-credential build | Partial | The synthetic 25-video regression, lint, type-check, unit suite, regular E2E suite, and compile-only build passed locally. The valid-credential build and saved-data regression were blocked at credential preflight. |
| Post-deployment live API/gallery integration | Blocked | No authorized Production deployment or live API observation was available. |

## Commands run locally

| Command | Outcome |
| --- | --- |
| `npm ci --no-audit --no-fund` | Exit 0; 987 packages installed. |
| `npm test -- app/videos/__tests__/page.test.tsx` | Exit 0; 10 tests passed. This uses 25 synthetic videos, not approved saved data. |
| `npm run lint` | Exit 0. |
| `npm run type-check` | Exit 0. |
| `npm test` | Exit 0; 38 files, 348 passed, 1 skipped. |
| `FLAGS_SECRET=<synthetic> npm run test:e2e -- --reporter=line --workers=1 --max-failures=1` | Exit 0; 71 passed, 5 skipped. The regular config excludes `@production`. |
| `ALLOW_MISSING_API_KEYS=true FLAGS_SECRET=<synthetic> npm run build` | Exit 0; compile-only build, with no populated data or valid credentials. Generated sitemap timestamps were removed from the working tree afterward. |
| `npm run verify:videos` | Exit 1 at preflight: `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` absent. It launched no build, browser run, or Lighthouse measurement. |

The public exact-head workflow [run 39849846745](https://github.com/foxleigh81/foxyslab-website/actions/runs/39849846745)
completed successfully: [lint/types/unit](https://github.com/foxleigh81/foxyslab-website/actions/runs/39849846745/job/120072762411),
[Build & Lighthouse](https://github.com/foxleigh81/foxyslab-website/actions/runs/39849846745/job/120072762505),
and [E2E](https://github.com/foxleigh81/foxyslab-website/actions/runs/39849846745/job/120072762614).
Its public artifact listing contained zero artifacts, so these job statuses do
not supply populated layout evidence, individual CLS/LCP pairs, or a report
link for those measurements. The preview was not browsed from this sandbox.

No approved pagination-capable saved-data source, digest, private loader, or
credential-boundary clearance was supplied in this checkout. No executable
behavior changed in this verification task, so there is no meaningful new
red/green/refactor cycle to report. Populated PR-build verification and the
post-deployment live API check remain outstanding. Release readiness: no.
