# Videos layout and thumbnail measurements, revision round 12

Inspected 2026-10-23 on branch
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t` at source HEAD
`0535bc0464e81bddd44e1616b075dcaab05d43d4`. The starting tree was clean.
This is local source evidence only; the live PR head and any later harness
commit were not revalidated in this session.

## Measurement disposition

**Blocked before populated production/browser verification.** The supplied
exact-head failure list is empty. The local private-controls record describes
the outstanding saved-data route and independent assessment, and no owner
receipts or authorized private runner are available in this workspace. The
network boundary here does not reach the application's data, image or Preview
origins. No credentials or private payloads were accessed, and no credentialed
build or external dispatch was attempted.

| Observation                                                                        | Result                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Initial response with approved production-shaped saved video data                  | Not observed. The focused page test renders populated initial HTML from 25 synthetic fixture videos; this is regression coverage, not production data evidence.                                                    |
| Hydration and footer movement through the viewport                                 | Not observed in a browser. The existing production E2E check records response markup and compares footer positions before/after hydration, with a two-pixel tolerance, but requires a populated production server. |
| First visible thumbnail's emitted priority hint                                    | Not inspected in a browser response. Source passes `priority` for gallery index zero; `VideoCard` maps it to `fetchPriority="high"`. This source inspection does not establish the emitted HTML or image preload.  |
| Three mobile Lighthouse CLS/LCP pairs                                              | Not measured. The recorded live baseline remains CLS 0.511 on all three runs and LCP 3.8s, 4.3s and 11.8s; these are not PR measurements.                                                                          |
| Search, playlist filtering, pagination directions, direct URLs, empty/error states | The focused page test covers initial URL-selected default/playlist/page states and empty/error server markup. Production interaction and both pagination directions were not exercised in a browser this round.    |
| Production build with populated saved data and post-deployment live API            | Not run. No approved saved-data ingestion route is available; no authorized Production deployment revision was identified.                                                                                         |

No application defect was reproduced from the supplied empty failure evidence or
the local regression test. No production code changed. The existing browser and
measurement tooling remains conditional on the documented private-data and
independent-review prerequisites; this record does not establish those controls.

## Local validation

This round records measurements and existing implementation behavior; it does
not change executable behavior, so no meaningful new red/green/refactor test
applies. The first focused-test invocation exited 127 because dependencies were
not installed (`vitest: not found`); that was an environment setup failure, not
a behavior-test red result. After installation:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0; 987
  packages installed, with npm configuration, deprecation and install-script
  warnings.
- `npm test -- app/videos/__tests__/page.test.tsx`: exit 0; 1 file and 10 tests
  passed.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 348 tests passed and 1 skipped. Vite
  emitted its existing configuration-loader compatibility warning.
- `npx prettier --check docs/validation/videos-task-2-round-12.md`: exit 0.
- `git diff --no-index --check /dev/null docs/validation/videos-task-2-round-12.md`:
  no whitespace errors (the command's normal differing-file status is 1).

Release readiness remains **no**. The ticket still needs the approved populated
build/browser observations, all three mobile CLS values below 0.1 with paired
LCP values, emitted first-thumbnail hint, production interaction coverage, and
the authorized post-deployment API check against an identified revision. No
measurement report link or fixed LCP improvement is claimed.
