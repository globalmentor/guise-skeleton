# [SKELT-2] Summary: npm Publishing Metadata

The `@guise/skeleton` package now exposes its built CSS distribution through standard npm entry-point metadata, enabling bundler import, direct file reference, and CDN consumption — all of which were broken in the published v0.1.0 tarball.

## Outcome

`package.json` declares `files` (explicit tarball whitelist), `main`, `style`, `sideEffects`, and a full `exports` map with per-component subpaths (`@guise/skeleton/button`, etc.), a minified aggregate (`@guise/skeleton/min`), and a `./css/*` escape hatch. A `prepublishOnly` script gates `npm publish` behind a `-SNAPSHOT` version check (using `/-SNAPSHOT(\+|$)/i`) followed by `clean`, `test`, and `build`. A `license.md` with the full Apache 2.0 text and copyright line is included in the tarball.

The readme documents three consumer integration paths (bundler, direct reference, CDN) and a Publishing subsection explaining the publish gate and version convention.

## Key Decisions

- `src/` excluded from the tarball — the unminified `dist/` files are effectively the sources (see minutes, 2026-05-29 "Exclude `src/`" Decision).
- Per-project version-management scripts were initially implemented but then removed in favor of general-purpose workflow scripts (`npm-prepare-release.sh`, `npm-prepare-develop.sh`) in the shared tools repository, parallel to the existing Maven workflow (see minutes, 2026-05-29 Pivot).
- `npm version --no-git-tag-version` is the correct version-write mechanism (validates SemVer), not `npm pkg set` (see minutes, 2026-05-29 Lesson).

## Handoff Notes

- Source maps in the tarball (`dist/css/*.min.css.map`) reference `src/` paths without embedded `sourcesContent`. Browser devtools will not reconstruct original source from the npm-installed package. The unminified CSS files serve that role. Fixing requires build-pipeline changes deferred to a future ticket.
- The `./css/*` exports pattern makes all files under `dist/css/` addressable by specifier without requiring explicit `exports` entries for future additions.
- The general workflow scripts (`npm-prepare-release.sh`, `npm-prepare-develop.sh`, `npm-get-ver.sh`, `npm-perform-release.sh`, `npm-tag-ver-release.sh`) are designed but live outside this repository; they are not yet committed elsewhere at time of writing.
