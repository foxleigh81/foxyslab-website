# Issue #71 source reconciliation, revision round 2

Inspected local HEAD `59cdbc408c508c915e671061addaa15c03a02bf3` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t` on 2026-10-22.
This record adds current-head findings to the existing source research; it is
repository evidence only. The supplied exact-head failure evidence is empty.
No external inventory, GitHub PR metadata, credentials, or private route was
accessed in this inspection.

## Current producer, fixtures, and checks

| Inspected paths | Current finding |
| --- | --- |
| `lib/youtube.ts`, `site.config.ts`, `app/videos/page.tsx` | The production page requests up to 200 recent videos, playlists and playlist membership through the YouTube API. The current page renders the server-loaded `VideoGallery` using URL search parameters. This is live upstream data, not a saved immutable input. |
| `test/fixtures/youtube.ts`, `app/videos/__tests__/page.test.tsx`, `components/VideoGallery/__tests__/VideoGallery.test.tsx`, `e2e/videos-interactions.spec.ts`, `e2e/helpers/videos-fixture.ts` | Unit fixtures contain a few synthetic videos/playlists; browser-interaction fixtures synthesize DOM. The production helper observes live rendered data. None is a captured, approved, immutable dataset, and none establishes enough real records for pagination coverage. |
| `scripts/verify-videos.mjs`, `scripts/lib/verify-videos.mjs`, `playwright.videos-production.config.ts`, `e2e/videos-gallery.spec.ts`, `lighthouserc.js` | `npm run verify:videos` builds with required live-service credentials, starts the production server, runs browser checks and three mobile Lighthouse measurements. The configured flow has no saved-data input. `lighthouserc.js` is the ordinary local/CI Lighthouse entry point and has no populated-data guarantee. |
| `.github/workflows/ci.yml`, `.github/workflows/videos-verification.yml`, `package.json` | Ordinary CI allows missing API keys for build/Lighthouse and runs synthetic E2E; it cannot establish populated-data results. The branch's manual populated-verification workflow checks a dispatch SHA and references an environment and secrets, but its presence here does not prove trusted-main installation, effective approval, or a permitted private route. |

## Resource and route status

No immutable saved-video input, snapshot identifier/digest, custodian, or
source-use approval is available in the inspected repository. The saved source
resource itself remains unidentified. No trusted private build/browser route
using such a snapshot is established: the verifier consumes live YouTube data,
and the branch workflow is only a candidate definition. Exact-head authorization,
effective secret controls, private data delivery, retention, cleanup and
independent clearance remain unverified.

This is a repository-only inspection. No external inventory resource or
permission refusal was observed, so this report does not characterize missing
repository evidence as denied access. The prior source-research record remains
the source for earlier findings; this revision adds no new owner, approval,
dataset, permission result, or populated behavior result. The operations gate
must supply an inventory locator and authorized custodian before those facts
can be established. No credentialed build/browser run was performed.

Documentation only: no production behavior changed, so there is no meaningful
automated behavior test or red-green-refactor cycle. No red run is claimed.
