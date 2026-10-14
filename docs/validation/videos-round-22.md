# Round 22: failed-run detail remains access restricted

Checked on 2026-10-14. The checkout is
`c9e25d77fa1b5ab062d752e17d85eead141324ee`, matching PR #79's current head.

## Credentialed verification status

The failed run under investigation is
[run 38610455771](https://github.com/foxleigh81/foxyslab-website/actions/runs/38610455771),
for head `1945660724d736605b0d241233f3ebbcc8cb301e`. The jobs API shows
installation and Playwright setup passed, while
`Build, check populated gallery, and measure three mobile runs` failed. This
workflow step invokes `npm run verify:videos`; its only child command sequence
is visible in `scripts/lib/verify-videos.mjs`: production build, browser smoke,
then three Lighthouse runs. The public API does not reveal which child failed.
The only failure annotation available is `Process completed with exit code 1`.

Tried the full run log endpoint again; it returns HTTP 403 (`Must have admin
rights to Repository`). The retained artifact `11918490047` is listed as
unexpired, but its download endpoint returns HTTP 401 (`Requires
authentication`). These responses prevent inspection of the redacted runner
log and `browser-smoke.json`. Therefore the failing child command, cause, and
tooling-versus-application classification cannot be established from evidence
available in this sandbox. No local credential preflight failure identifies
the cause of the GitHub run.

## Results obtainable on the reviewed head

[Credentialed run 38618958181](https://github.com/foxleigh81/foxyslab-website/actions/runs/38618958181)
completed successfully on the exact reviewed head. Its job metadata says the
credentialed build, populated-gallery check, and three mobile measurements all
completed; report upload and summary linking also passed. The unexpired report
artifact `11921161071` is listed, but the artifact download endpoint returns
HTTP 401. The API provides no summary contents. Thus the successful completion
is obtainable, but not the rendered browser assertions, three CLS/LCP values,
or first-thumbnail priority hint. No measurements or browser details are
claimed here.

## Next verification step

An operator with Actions log and artifact access must inspect run
`38610455771`'s redacted full log and retained browser report, recording the
actual failing child command and error. That evidence determines the handoff:
an application assertion or build failure goes to the relevant application
task; a runner/setup failure goes to verification tooling. Keep secrets out of
the report. Separately, download and inspect `11921161071` to publish the
current-head browser results, first-thumbnail priority, and three CLS/LCP
pairs. A successful parent step alone is not a substitute for these results.

This is an evidence-only revision. The required GitHub logs and artifact are
not accessible here, so there is no behavior change to test and no meaningful
red-green-refactor cycle. No CI or application change is supported by the
available failure evidence.
