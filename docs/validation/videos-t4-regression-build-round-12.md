# T4 regression and build verification, revision round 12

## Subject and scope

Fresh local evidence collected on 2026-10-22 at source HEAD
`7540dce93d05615a3e16dcb242d55af4b12f745e` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. The initial
worktree was clean. Only this verification record changes; application,
tests, CI and driver code are unchanged. This is not verification of the
later harness commit or a fresh confirmation of the live PR head.

This is a verification-only task. No production change, new behaviour test,
red run, green-after-repair run or refactor was performed. Existing tests
were executed without claiming a new red-green cycle.

## Regression assessment and repair-plan finding

`app/videos/__tests__/page.test.tsx` creates 25 synthetic videos from
`test/fixtures/youtube.ts`, mocks the YouTube producers, and assigns 13 videos
to a playlist. It makes `useSearchParams` suspend, then calls `VideosPage`
with resolved URL parameters and inspects `renderToString` output. Assertions
cover 12 headings on the default and direct-playlist first pages, one heading
on playlist page 2, first title, page heading and search input. Empty and
fetch-error states have distinct assertions, including the retry link.

Finding T4-R12-1: this is useful coverage of cards existing in synthetic
server markup, but does not establish the required populated saved-data
layout. It loads no approved saved dataset, renders no root-layout footer,
measures no CSS geometry, and performs no hydration. The global `next/image`
mock also drops `fill`. Passing it cannot establish reserved thumbnail space,
footer stability or real emitted image priority in a production response.

The separate `@production` test in `e2e/videos-gallery.spec.ts` holds scripts,
checks visible cards on default/direct-playlist URLs, and compares footer Y
before and after releasing scripts with a less-than-2-pixel assertion. It
also exercises search and clearing. This is relevant complementary coverage,
but ordinary Playwright configuration excludes it. Its populated execution
was not possible here. Source inspection is not an observed browser result.

Route T4-R12-1 to a separate Thomas test-first repair plan: establish an
approved pagination-capable saved fixture and ingestion path, demonstrate
that a header-only initial response fails the focused layout assertion,
then demonstrate initial cards/reserved space and footer stability on a
production build. Do not treat this finding as a reproduced website defect
or authorization to change the driver or website in this verification task.

## Fresh local checks

Runtime: Node `v24.21.0`, npm `11.19.0` (the checked-in CI uses Node 22).
Commands were run directly, with shell exit codes preserved for logged suites.

| Command                                           | Observed outcome                                                                                                                                      |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci --no-audit --no-fund`                     | Exit 0; 987 packages installed. Deprecation/install-script warnings emitted.                                                                          |
| `npm run lint`                                    | Exit 0.                                                                                                                                               |
| `npm run type-check`                              | Exit 0.                                                                                                                                               |
| `npm test -- app/videos/__tests__/page.test.tsx`  | Exit 0; 10 tests passed. Synthetic data only.                                                                                                         |
| `npm test`                                        | Exit 0; 38 files passed, 348 tests passed, 1 skipped. The credential-gated live Fourthwall image-host test is skipped.                                |
| `npm run test:e2e -- --workers=2 --reporter=line` | Exit 1; development-server readiness timed out after 60 seconds, with `flags: Missing FLAGS_SECRET` from the root layout. No browser assertions ran.  |
| `npm run verify:videos`                           | Exit 1 at credential preflight: missing `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, `FLAGS_SECRET`. No build/browser/Lighthouse stage launched. |

The ordinary E2E suite was rerun with the public synthetic flags value used
in `.github/workflows/ci.yml`:

```sh
FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc npm run test:e2e -- --workers=2 --reporter=line
```

Exit 1: 49 passed, 22 failed, 5 skipped. The first failing iPhone 14 About
accessibility case reported `page.evaluate: Target crashed`; retries and
subsequent cases reported localhost connection refusals. This is an
unsuccessful smoke run, not a reproduced video-layout defect. Its cause is
unresolved; an environment investigation and successful rerun are still
needed. The five skips comprise four controlled state cases without generated
fixtures and the mobile desktop-navigation case. Production-tagged layout and
interaction checks remain excluded. No real credentials were supplied.

## Populated acceptance blockers

All three required credential names were checked for presence only and were
absent. No secret values were read or copied. The existing verifier builds
and serves live API data; it has no saved-dataset input. This session has no
approved saved-data identifier/digest, build/runtime ingestion route, private
controller/retention receipt or independent exact-head credential clearance.
The sandbox's allowed network destinations also exclude the live YouTube
and Fourthwall services. No missing-key build is counted as acceptance proof.

| Required observation                                      | Status and precise blocker                                                                                                                         |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Saved-data initial response and hydration/footer layout   | Blocked by absent approved dataset and ingestion route, credentials and independent clearance; synthetic test results above are narrower evidence. |
| Valid-credential production build                         | Not run; verifier stops before build on the three missing credentials. Saved-data supply and allowed API access are also unavailable.              |
| Production E2E: search, playlist, pagination, direct URLs | Not run; no approved populated production build/server.                                                                                            |
| Separate empty/error browser outcomes                     | Not established by the focused unit run; controlled markup fixtures are distinct from populated acceptance.                                        |
| Mobile Lighthouse runs 1, 2 and 3                         | All unrun; no approved populated build/server. CLS and LCP are unmeasured for every run.                                                           |
| Emitted first-thumbnail priority hint                     | Unobserved on a populated production response. No network-dependent LCP improvement claimed.                                                       |
| Post-deployment live API check                            | Pending authorized deployment and deployed-version identification; no deployment occurred.                                                         |

Earlier general CI successes and missing-key E2E/Lighthouse reports from the
brief are historical context, not newly collected evidence. No new populated
report links or measurements exist. No Engineering-driver checkout or handoff
trace is available within this authorized website workspace; dispatch
admission, terminal-run state and independent review outcomes are not asserted.
This record cannot demonstrate zero website-runner launches or repair that
external dispatch boundary. Release readiness remains **no**.
