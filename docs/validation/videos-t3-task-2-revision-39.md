# Task 2, revision 39: exact-head local verification

Recorded 2026-10-24 09:10 UTC. The checked-out commit and the draft PR #79
`head.sha` both resolved to `df85bf4f18fd1032e5c13101b677498dab483847`
(GitHub pull API rechecked after the local build). The local build ID was
`unRnUODkX3IObjKfI6lBm`. It used `ALLOW_MISSING_API_KEYS=true`, no YouTube or
Fourthwall credential, and a throwaway Flags key. It is a keyless compilation
check, not a populated build. No approved saved-video source or immutable data
digest, credential-release disposition, or private execution receipt was
available in this sandbox. The data digest for all acceptance criteria is
**unavailable**; no head/build/data triple can be asserted.

| Ticket criterion | Result on approved populated data | Local observation |
| --- | --- | --- |
| Initial cards or reserved layout and footer before/after hydration | Blocked; no populated HTML or browser positions captured | Synthetic 25-video server-render regression passed |
| Focused populated-data regression | Blocked against approved saved data | Focused page/gallery/card suite passed: 49 tests |
| Search, playlist filter, pagination, direct playlist URL | Blocked on admitted build and dataset | Ordinary E2E exercised synthetic interaction fixtures on desktop/mobile |
| Distinct empty and fetch-error states | Blocked on admitted production route | Controlled E2E fixtures and unit tests passed |
| First-thumbnail emitted priority hint | Blocked; no populated response inspected | Source and component test set `fetchpriority="high"` for first visible card |
| Three mobile Lighthouse CLS/LCP pairs | Blocked; no admitted populated build | No runs, metrics, or report links; CLS threshold and LCP remain open |
| Live API integration | Blocked pending authorized deployed revision | No live API check |

## Commands and outcomes

| Command | Outcome |
| --- | --- |
| `npm ci --no-audit --no-fund` | Exit 0; 987 packages installed |
| `npm run lint` | Exit 0 |
| `npm run type-check` | Exit 0 |
| `npm test -- app/videos/__tests__/page.test.tsx components/VideoGallery/__tests__/VideoGallery.test.tsx components/VideoCard/__tests__/VideoCard.test.tsx` | Exit 0; 49 passed |
| `npm test` | Exit 0; 353 passed, 1 skipped |
| `npm run test:e2e -- --workers=1 --retries=0 --reporter=line` with a throwaway 32-byte Flags key and no data credentials | Exit 0; 71 passed, 5 skipped; populated `@production` checks excluded |
| `npm run verify:videos` | Exit 1 at preflight: all three required credentials absent; no browser or Lighthouse run |
| `npm run build` with `ALLOW_MISSING_API_KEYS=true` and a throwaway Flags key | Exit 0; keyless compile only |

The first E2E attempt stopped before a suite result because the throwaway Flags
value was too short; the corrected direct command above is the recorded result.
No website defect was observed on admitted populated data, so this verification
task made no production-code change and has no meaningful red/green/refactor
cycle. Approval of one immutable populated source/digest, valid build-time data,
private execution controls and independent admission remain prerequisites to
the requested browser and Lighthouse measurements. Any observed failure at that
point needs a focused test-first repair. No fixed LCP improvement is claimed.
