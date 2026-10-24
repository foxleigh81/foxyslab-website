# Task 2, revision 32: bounded populated-data verification procedure

Recorded 2026-10-24 UTC against the checked-out branch head
`67596d84f725297e5523f8f4e72965c2465ae564`. This revises the verification
handoff only. No new run was started. The supplied empty failure list (`[]`)
does not establish that the populated-data criteria passed or that the earlier
terminal operation was reconciled. The previous results remain historical and
must not be carried forward as exact-head evidence.

## Dispatch gate

Task 2 must not be dispatched until these prerequisites have receipts bound to
the freshly revalidated PR #79 head:

1. **Run reconciliation (Chris):** account for the terminal operation, record
   its final state and determine whether any operation remains unresolved. An
   empty failure list is not a terminal-operation receipt.
2. **Delivery path (Marcus):** trace selected-head resolution, CI lookup,
   Preview lookup, and readiness-`no` handling in the delivery driver's owning
   workflow. Identify that repository and workflow from inspectable provenance
   before scoping any driver repair. Keep driver defects on their own change
   path; they are not website failures.
3. **Head and admission (Marcus):** freshly revalidate the live PR head. Supply
   a sanitized receipt naming the approved populated saved-video dataset and
   digest, a valid build-time credential source, private execution and report
   retention controls, and the controller/run identity. Macklin's independent
   disposition must cover that same head, dataset, controller, credential
   release, and retention boundary before credentialed PR code runs.

If any item is missing, stale, or mismatched, record Task 2 as **blocked** and
do not launch credentialed checks. Do not infer approval from a workflow
configuration, successful CI summary, artifact listing, or head equality.

## Thomas-owned Task 2

**Inputs:** the reconciled terminal-run receipt; the freshly revalidated PR
head; the admitted immutable populated dataset and digest; and the approved
private build/browser route and retention location. The dataset must contain
realistic video and thumbnail records, at least one populated playlist, and
more than one page of matching records so pagination can be exercised. Keep
private payloads and credential values out of the retained report.

**Procedure:**

1. Build the PR head with the admitted dataset and valid credential source.
   Record the build ID and dataset digest in the private run summary.
2. Capture the initial `/videos` HTML. Record whether first-page cards or an
   equally stable reserved layout is present before hydration.
3. In the browser, measure the footer position before hydration and after the
   gallery settles. Record both positions and the observed displacement.
4. Run the focused initial-layout regression using the admitted saved data.
5. Exercise search, playlist filtering, forward pagination, back pagination,
   and a direct playlist URL. Separately exercise the empty and fetch-error
   states. For every path, capture the observed result and whether it used the
   admitted dataset or a controlled state fixture.
6. Run lint, type-check, unit tests, E2E tests, and a production build using the
   admitted data. Record each command and exit status.

For every observed website failure, first add and run a focused failing check
that demonstrates the expected missing behavior. Then make the smallest
supported repair, rerun that focused check, and rerun the affected checks.
Classify a setup/tooling failure separately from a website behavior failure;
do not weaken populated-content assertions to make setup pass.

**Output:** a private, sanitized, criterion-by-criterion receipt with one
`observed`, `failed`, or `blocked` result for initial HTML, footer stability,
focused regression, each interaction, each state, lint, type-check, unit/E2E
tests, and the valid-data production build. Bind every result to the revalidated
head, build ID, and dataset digest. Include artifact/report links and explain
any blocked or failed path. Synthetic fixtures may support state-specific
checks but cannot be reported as populated-data results.

## Separate mobile measurement gate

After Task 2's admitted build and browser verification, run three distinct
production-equivalent mobile Lighthouse measurements against that same build,
head, and dataset digest. Record each run independently with its CLS and LCP;
each CLS must be below `0.1` for the measurement criterion to pass. Capture and
evaluate the emitted priority hint on the first visible thumbnail. Compare the
results with the ticket's historical baseline (CLS `0.511`; LCP `3.8`, `4.3`,
and `11.8` seconds) while making no fixed or network-independent LCP improvement
claim. A setup failure, blocked run, missing report, or missing measurement
stays explicit and cannot be counted as a pass.

Ashley and Macklin review independently after the evidence is available; this
plan grants neither a review pass nor protected-branch merge authority. The
live API/gallery integration check remains pending an authorized Production
deployment and a receipt naming the deployed revision.

## Current disposition

The prerequisite receipts and approved populated dataset are not supplied in
this revision. The existing local verifier requires live service credentials
and has no approved saved-dataset input, so this plan does not claim that the
private route is executable. Task 2 and the three mobile measurements remain
blocked at the dispatch gate. No measurement or new browser run was attempted.
Release readiness is **no**.

## Validation

This is a documentation-only plan revision; no executable behavior changed, so
there is no meaningful automated behavior test or TDD red/green/refactor cycle.
No application, CI, deployment, or credential configuration changed.
