# Videos current-head evidence, task 1 round 18

Inspected 2026-10-24. This record binds public GitHub metadata to the live PR
head and reports what could be inspected without credentials or saved data.

## Subject and receipts

| Item | Observation |
| --- | --- |
| Local branch and HEAD | `eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t` at `530620ab6c79f10d55ddb6063a9e0897296b57e4`. |
| Live PR #79 | Public GitHub API returned open draft, same branch and head `530620ab6c79f10d55ddb6063a9e0897296b57e4`; base `eca93e0605ecf22f3eb8943a5fc84a37a65e11b1`. |
| Delivery gate subject and lookup trace | **Blocked.** The supplied exact-head failure evidence is `[]`; no selection trace or delivery-system admission/rejection receipt is available. |
| Approved populated saved-video dataset and digest | **Blocked.** No owner approval, immutable dataset identity/digest, or coverage receipt was supplied. |
| Valid build credentials and approved credential-safe route | **Blocked.** No independent credential disposition or route receipt was supplied. No credential values were requested or exposed. |
| Effective artifact access and retention route | **Blocked.** GitHub reports one retained artifact, but anonymous archive retrieval returned HTTP 401; effective access controls are not established by that response. |

## Current-head CI observations

The Actions API lists one completed successful general CI run for this exact
head: [run 40037402275](https://github.com/foxleigh81/foxyslab-website/actions/runs/40037402275),
created 2026-10-23 and completed 2026-10-23 UTC. Its three jobs all report
success:

| Check | Run evidence | Disposition |
| --- | --- | --- |
| Lint | Job `120700145154`, step `npm run lint` completed successfully. | **Observed successful** on exact head; approved-dataset binding is unavailable. |
| Type-check | Job `120700145154`, step `npm run type-check` completed successfully. | **Observed successful** on exact head; approved-dataset binding is unavailable. |
| Unit tests | Job `120700145154`, step `npm run test:coverage` completed successfully. | **Observed successful** on exact head; approved-dataset binding is unavailable. |
| E2E tests | Job `120700144948`, step `npm run test:e2e` completed successfully. | **Observed successful** on exact head; populated approved-data coverage is unavailable. |
| Build | Job `120700145231`, step `npm run build` completed successfully. | **Observed successful ordinary CI build**; valid-credential and approved-data conditions are unverified. |
| Lighthouse | Job `120700145231`, steps `npm run test:lighthouse` and numeric extraction completed successfully. | **Observed ordinary CI run**, but measurements could not be inspected. It is not evidence of the required populated /videos runs. |
| Populated-layout regression and browser interactions | No exact-head run or approved dataset evidence identified. | **Blocked** pending approved dataset and route receipts. |
| Three mobile CLS/LCP measurements and first-thumbnail priority inspection | No inspected numeric artifact or populated run. | **Blocked**; no values or priority observation claimed. |
| Live API after deployment | No authorized Production revision supplied. | **Blocked / pending deployment.** |

The run exposes one unexpired artifact, `lighthouse-results` (`12537922015`,
276 bytes, expiry 2026-11-06T23:07:35Z). Its ZIP endpoint returned HTTP 401,
so no numeric values or report links could be inspected. Artifact metadata and
green job status are not measurement evidence. The run's ordinary CI build and
Lighthouse commands are observed from step metadata only; they do not establish
valid credentials, populated saved data, or the required three mobile runs.

## Verification boundary and next evidence

No website repair is indicated by the observed evidence. The missing items are
external receipts and inaccessible artifact contents, so changing application
code or verification setup would be speculative. The delivery owner must supply
the gate subject/lookup trace and tested exact-head admission/wrong-head
rejection; the source owner must supply approved dataset provenance and digest;
and the independent credential/artifact-control disposition and retrieval route
must bind those inputs to the revalidated head. Then rerun and inspect populated
browser and three mobile Lighthouse artifacts for that same head and dataset.

This is a documentation-only evidence update. A focused behavior test and
red/green/refactor cycle are not meaningful; no red or green behavior run is
claimed. The live API check remains pending an authorized Production deployment
with an identified revision.
