# Poppins

Unmodified Latin normal WOFF2 files from `@fontsource/poppins@5.2.7`
(npm registry), weights 300, 400, 500, 600, 700 and 900. Licensed under the
SIL Open Font License; see `OFL.txt` for the upstream copyright and license.

The root layout uses `next/font/local` to bundle these files with the build,
keeping Poppins available without contacting Google Fonts at build time.
The existing CSS variable, weights, Latin character set and swap display
behavior are preserved.

Verified against `npm pack @fontsource/poppins@5.2.7` on 2026-10-19. To
reproduce, compare `sha256sum public/fonts/poppins/*.woff2` with each matching
`package/files/` member of that tarball. Both sides produced these SHA-256
digests:

| Weight | SHA-256                                                            |
| ------ | ------------------------------------------------------------------ |
| 300    | `78bc3aa78faec288bbb3bf26c9a0fa4eb67b1e69da94a17233c5cab60525efdb` |
| 400    | `7d93459d86585bfcdbb7e0376056226adb25821ee54b96236fe2123e9560929f` |
| 500    | `cd36de204aca2d5fa263a731f7c20009b5e3d754ba1f1e03c33e93a48f3e7446` |
| 600    | `f4e80d9dfd374d02989b87a27b5ed4cb78fbb177c27f1478e9a8b0afb7513149` |
| 700    | `9338e65fc077355c7a87ae0d64cc101e23b9bf8ad78ae65f0f319c857311b526` |
| 900    | `17ea10196a490a8d3b8da162c7d4af9c301c5229f70af90dad6fa33eb951d83f` |
