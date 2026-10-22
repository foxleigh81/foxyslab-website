# Issue #71 source and verification-route inspection (round 4)

Inspected local checkout `28221c5cb2de11962d6568f593774aab99d0cd6a` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t` on 2026-10-22.
This is repository evidence only; no GitHub issue write, operations inventory
read, credentialed run, or website-runner research was performed.

## Sources inspected

| Source | What it establishes | Custodian / use approver |
| --- | --- | --- |
| `lib/youtube.ts` (`getLatestVideos`, `getPlaylists`, playlist membership functions) and `site.config.ts` | The current producer requests live YouTube v3 channel uploads, video details, playlists and playlist items using `YOUTUBE_API_KEY`; the configured channel handle is `foxyslab`. Production builds require the key and fail on missing data unless explicitly opted out. This is a live upstream API path, not a saved immutable dataset. | The channel/data custodian and the approver for saving/replaying this data are not identified by these files. |
| `app/videos/page.tsx`, `components/VideoGallery`, `components/VideoCard` | The page requests up to 200 videos and playlist data; the gallery owns filtering/pagination and cards render thumbnails. | Not identified in source. |
| `scripts/lib/verify-videos.mjs`, `scripts/verify-videos.mjs`, `playwright.videos-production.config.ts`, `e2e/videos-gallery.spec.ts`, `e2e/helpers/videos-fixture.ts` | `npm run verify:videos` performs a production build, starts `next start`, runs the production browser smoke suite and three mobile Lighthouse runs. Its build uses live API credentials. State-fixture files are generated from synthetic test data and exercise browser states; they are not a saved-video capture and do not make the build use a saved dataset. | No private dataset owner or use approver is recorded. |
| `package.json`, `.github/workflows/ci.yml`, `.github/workflows/videos-verification.yml` | Ordinary configured checks are install, lint, type-check and Vitest. The branch contains a manual workflow dispatching from `main`, referring to environment `videos-verification` and secrets, then invoking the verifier. This YAML does not establish that the workflow exists on trusted `main`, that the environment is effectively protected, or that it is an authorized private route. | Workflow/environment administrators and credential owners are not discoverable from repository files. |
| `docs/validation/videos-source-research-t3-task-1.md`, `videos-operations-round-9.md`, `videos-operations-round-10.md`, `videos-t4-private-controls.md` | Prior records describe the same missing source approval and private-route evidence. They are local handoff records, not receipts or an authorized operations inventory. | Their named coordinator is Marcus; that does not establish him as custodian, dataset-use approver, or an authorized operations contact. |

## Disposition

The exact saved-data resource, its custodian, and dataset-use approver remain
unidentified. The operations/source inventory itself is not present in the
inspected repository, and this session exposes no authorized interface or
locator for it. Therefore the precise access gap is: no addressable operations
inventory resource or access custodian was supplied to this repository-only
inspection; no permission result for a specific external resource can be
claimed. Marcus is the named research coordinator in the handoff, but his
inventory access and authority are not evidenced here. No general access was
requested and no owner was guessed.

The only executable candidate found is the branch-local GitHub Actions workflow
and `npm run verify:videos` route described above. The workflow is not evidence
of an available private route: its trusted-ref installation, effective
environment controls, immutable approved dataset input, access/retention
controls and independent clearance are unverified. The verifier currently
builds from live YouTube data and has no immutable saved-source input. Thus no
available private build/browser route using approved populated saved data can
be recorded. No workflow was dispatched and no credential or dataset was
used.

This record has not been posted to issue #71; the supplied task boundary limits
work to `/work/repo`, and no authenticated issue-writing interface was provided.
The acceptance item requiring issue #71 to contain the inspected sources and
feasible route or evidenced access gap remains externally uncompleted until an
authorized issue writer records this evidence. No ticket criterion for
populated verification is treated as passed, and release readiness remains no.

This is a documentation-only task, so there is no meaningful behavior test or
red/green/refactor cycle. No red run is claimed. Existing application behavior
was not changed.
