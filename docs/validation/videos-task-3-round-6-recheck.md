# Task 3 exact-head recheck: revision round 6

Checked 2026-10-22 against local source SHA
`add7cb6b39c4efad993c8a271687650872940350`. The public PR #79 API
reported the same head on two reads. Its only reported Actions run for this SHA
was CI `39752428175`, still in progress at the second read; the deployments API
returned no deployment for this SHA. This identifies the source under test, not
a verified populated build or an independently approved credential release.

No approved saved-video source, immutable digest, private replay route, or
verification credentials were available here. `npm run verify:videos` exited 1
at preflight, naming absent `YOUTUBE_API_KEY`,
`FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`. It created no report and did
not run its build, populated browser checks, or Lighthouse. There are no new
CLS/LCP values, inspected emitted first-thumbnail hint, or populated report
links. The 2026-10-12 live baseline remains three mobile CLS values of 0.511
and LCP values of 3.8, 4.3, and 11.8 seconds; no LCP improvement is claimed.

| Ticket criterion | Outcome for this SHA |
| --- | --- |
| Initial cards or stable reserved space; no hydration/footer displacement | **Blocked** on an approved populated route. Synthetic page unit tests passed, but the live footer was not observed. |
| Three mobile CLS values below 0.1, paired LCP, and emitted priority hint | **Blocked**. No Lighthouse or populated browser run occurred. |
| Search, playlist filter, pagination, direct URLs | **Blocked** for populated data. Controlled unit/E2E cases passed; the ordinary E2E config excludes `@production`. |
| Distinct empty and fetch-error states | **Observed** only in controlled unit/E2E fixtures on desktop and mobile; live outcomes remain blocked. |
| Populated regression, lint, type-check, unit/E2E, valid-data build | **Blocked** as a combined criterion. Local synthetic/missing-key checks passed; the valid-data build and populated checks did not run. |
| Post-deployment live API/gallery observation | **Blocked** until an authorized Production revision containing the change is identified and observed. |

Local commands and outcomes:

| Command | Outcome |
| --- | --- |
| `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund` | Exit 0; 987 packages installed. |
| `npm run lint` | Exit 0. |
| `npm run type-check` | Exit 0. |
| `npm test` | Exit 0; 38 files, 346 passed, one skipped. |
| `npm run test:e2e -- --reporter=line --workers=1 --retries=0` with `ALLOW_MISSING_API_KEYS=true` and a synthetic 32-byte Flags key | Exit 0; 71 passed, five skipped. An earlier attempt with a short synthetic key failed server setup and was stopped; the corrected run completed. |
| `npm run build` with the same missing-key setup | Exit 0; 39 static pages generated, `/videos` dynamic. No populated data was used. |
| `npm run verify:videos` | Exit 1 at credential preflight; no populated artifacts. |

This recheck changes only documentation. No production behavior changed, so
there is no meaningful behavior-test red/green/refactor cycle in this round.
The local checks did not reproduce a website defect. Completion still requires
approved nonempty saved data and private exact-head access, independent
credential clearance, populated browser and Lighthouse evidence, and the later
Production observation. Selector/dispatch eligibility is outside this website
checkout; this note does not establish a persisted gate change.
