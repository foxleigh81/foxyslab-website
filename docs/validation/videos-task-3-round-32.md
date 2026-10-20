# Task 3: populated-data environment preparation, revision 32

Recorded 2026-10-20. Environment preparation remains blocked; no populated
production build, browser measurement, or new performance baseline was obtained.
This record describes the available path and the concrete prerequisites for it.

## Identity and provenance

`git rev-parse HEAD` and a fresh public
`GET https://api.github.com/repos/foxleigh81/foxyslab-website/pulls/79` both
reported `64e17a2775162386c4206814556a5a205f293f06`. PR #79 is open, draft,
targets `main`, and uses branch
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. The worktree was clean
before this documentation change. These observations do not verify the future
harness commit or establish independent approval of this head.

The historical diagnostic subject is generation 14, run
`r20261020-39cac83c2a0e`, PR #79 at
`2cceb96ac7b70a46617bd27341a8d0c0dec2bcd0`. It differs from the current head.
The [driver inspection record](videos-driver-inspection-round-30.md) still
does not identify the driver maintainer or an authorized inspection operation.
No driver lookup or website workflow was dispatched here. The supplied empty
failure list is neither a diagnostic result nor acceptance evidence.

## Data contract and missing saved dataset

Inspection of `app/videos/page.tsx`, `lib/youtube.ts`, `types/youtube.ts`, and
`scripts/lib/verify-videos.mjs` establishes the current path:

- The page requests up to 200 videos, playlists, and each playlist's video IDs
  from YouTube through Next's fetch cache. That cache is not an identified,
  immutable saved-data fixture. The verifier has no saved-dataset input.
- Video records contain `id`, `title`, `description`, `thumbnail`,
  `publishedAt`, string counts (`viewCount`, `likeCount`, `commentCount`),
  ISO duration `duration`, and `url`. Playlist records contain `id`, `title`,
  `description`, `thumbnail`, and numeric `itemCount`; membership is a list
  of video IDs. The page derives slugs and counts matching loaded videos.
- The existing initial-markup test uses 25 synthetic videos, a playlist with
  13 matching IDs, and 12 cards per page. This exercises pagination and direct
  playlist rendering, but its mock thumbnails/data are not a production saved
  dataset. Generated empty/error HTML fixtures serve separate state checks.

Before measurements, the data owner must supply an approved populated snapshot
or a documented, reproducible source/cache preparation method. Record its
provenance, capture time, immutable identifier/digest, video count, membership
counts, selected playlist slug, thumbnail availability, and loading method.
Use enough matching records to exercise pagination (more than 12), realistic
titles/durations/images, and at least one populated playlist. Credentials must
remain outside the dataset and retained evidence. If a saved snapshot is
required, an Engineering implementation owner must supply and test the missing
loader; none is assumed to exist. No dataset identifier or digest is invented
in this record, and live API results must not be labelled saved-fixture results.

## Credential and artifact boundaries inspected

The existing `.github/workflows/videos-verification.yml` is a manual workflow
restricted in YAML to `main`, using the `videos-verification` environment. It
checks the requested PR SHA before checkout and again before verification,
checks out that SHA without persisted credentials, and removes `GH_TOKEN`
before running the verifier. These checks establish SHA equality, not approval.
An administrator still needs to demonstrate independent approval of the exact
head, environment reviewer/branch protections, dedicated environment secrets,
and availability of the trusted workflow on `main`. Those settings were not
inspected here. No CI or secret configuration was changed.

The verifier requires `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and
`FLAGS_SECRET`, rejects the missing-key bypass, and supplies data credentials
only to the production build/server. State fixtures receive synthetic values;
browser and Lighthouse children receive no data credentials. Child output is
suppressed, browser diagnostics are bounded, and raw browser/Lighthouse outputs
are removed after the browser/measurement stage. These are inspected code
boundaries, not certification of the external runner or its approval settings.

The intended entry point is `npm run verify:videos`, after `npm ci` and Chromium
installation on an authorized host with API and thumbnail access. It runs the
production build, `next start`, the focused state-fixture test, the dedicated
desktop/mobile browser suite, then three mobile Lighthouse runs. See
[the command procedure](videos-production-checks.md) for exact child commands.
The local preflight command was run directly and exited 1:

```text
Missing required credentials: YOUTUBE_API_KEY, FOURTHWALL_STOREFRONT_TOKEN, FLAGS_SECRET
```

No credential values were read, copied, or printed. The sandbox's allowed
network excludes the production APIs, thumbnail origins, and Preview host.
The preflight stopped before creating a report directory or invoking a build.

Expected retained output is `.lighthouseci/videos/run-*/summary.json`, including
`verification.head`, build settings, credential-presence markers, bounded browser
outcomes, and measured CLS/LCP pairs when those stages run. The workflow uploads
only those summaries as `videos-verification-<expected_sha>` with 14-day retention
and prints the artifact URL and summary in the job summary. A partial summary
does not establish success. No new artifact URL or measurement exists this round.

For the subsequent run, retain the live repository/PR/head, approval reference,
workflow run URL/ID, dataset identity, build command, summary path/artifact URL,
and outcomes together. Reconcile `verification.head` and the artifact SHA with
the live head before interpreting results. Earlier records remain historical.

## Blockers and ownership handoff

| Blocker | Required repair or evidence | Ownership status |
| --- | --- | --- |
| Driver research prerequisite unresolved | Supported read-only operation, permission/provenance contract, maintainer citation and diagnostic trace for the historical subject | Marcus owns ordered research; Chris coordinates Natalya's external research per the brief. Driver repair owner remains unidentified. |
| No authorized credentialed runner established here | Exact-head independent approval, verified environment protections, valid dedicated credentials and service access | Requires the repository/environment administrator; individual assignment is unavailable in this sandbox. Marcus must obtain that assignment. |
| No identified saved dataset or production loader | Approved data manifest and reproducible loading path, with a focused tested repair if a loader is needed | Requires an Engineering data/verification implementation owner; Marcus must obtain that assignment. |

These are concrete capability gaps, not evidence of an application defect or
proof that the external services lack the capabilities. No external assignment
or completed repair is claimed. Task 3's owner/environment criteria remain
incomplete until the assignments and setup evidence are delivered.

All ticket gates remain open for release verification: populated initial layout
and footer stability; three mobile CLS values below 0.1 with paired LCP values
and first-thumbnail priority inspection; search, playlist, pagination, direct
URLs and empty/error checks; the populated regression and credentialed build.
Ashley's and Macklin's independent gates, including the reported security
block, are unresolved. Live API integration remains a separate post-deployment
check. No fixed LCP improvement, review pass, or merge authority is asserted.

## Local validation

Only this documentation record changes. There is no executable behavior change
for a meaningful new automated behavior test, so no red-green-refactor cycle or
refactor is claimed. The missing-credential preflight is a setup failure, not
a TDD red run. Fresh local results:

| Command | Result |
| --- | --- |
| `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund` | Exit 0; 987 packages installed. |
| `npm run lint` | Exit 0. |
| `npm run type-check` | Exit 0. |
| `npm test` | Exit 0; 38 files passed, 345 tests passed, 1 skipped. |
| `npm run verify:videos` | Exit 1 at credential preflight, as recorded above; no production build, browser or Lighthouse stage ran. |

These checks do not establish populated-data acceptance or verify the future
harness commit. No production code, CI, deployment or credential configuration
was changed.
