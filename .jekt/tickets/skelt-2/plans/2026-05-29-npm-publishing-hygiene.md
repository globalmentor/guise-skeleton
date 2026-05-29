# [SKELT-2] Plan: npm Publishing Hygiene

## Overview

This plan is monolithic; the work is concentrated in `package.json` and `readme.md`, with no shared-interface changes that would create natural chunk boundaries.

- Step 1: Add `license.md` at the repository root
- Step 2: Add tarball composition and entry-point metadata to `package.json`
- Step 3: Add `exports` map
- Step 4: Add `prepublishOnly` script with SNAPSHOT guard
- Step 5: Add `release:prepare` and `develop:prepare` version-management scripts
- Step 6: Update `readme.md` with consumer integration paths and `npm pack --dry-run` verification
- Step 7: Verify the produced tarball via `npm pack --dry-run`

## Step 1: Add `license.md` at the repository root

**Partially done.** The file `license.md` has been created with the full Apache License 2.0 text in Markdown format. Still needed: add a copyright notice line at the top of the file:

```
Copyright 2018–2026 GlobalMentor, Inc.
```

followed by a blank line before the license text. This is standard practice for Apache-licensed projects — it formally declares copyright ownership in the license file and is extracted by license-scanning tools for compliance reports.

The lowercase filename is consistent with the project's convention (`readme.md`). npm's license detection accepts this form. GitHub's license detection (via the [licensee](https://github.com/licensee/licensee) Ruby gem) also recognizes `license.md` as a valid license filename pattern.

**Testing:** presence in the tarball verified in Step 7.

## Step 2: Add tarball composition and entry-point metadata to `package.json`

Add the following top-level fields, placed alongside the existing identification block (between `"bugs"` and `"devDependencies"` for readability):

- `"files": ["dist", "readme.md", "license.md"]` — explicit whitelist. The published tarball stops shipping raw `src/`, `scripts/`, `.gitattributes`, `.jsbeautifyrc`, `.stylelintrc.json`, the build helper, and the unrelated `target/` contents.
- `"main": "dist/css/guise-skeleton.css"` — legacy default entry honored by older tooling.
- `"style": "dist/css/guise-skeleton.css"` — older convention recognized by Parcel and some legacy CSS-aware tools.
- `"sideEffects": ["**/*.css"]` — prevents bundlers from tree-shaking a bare `import "@guise/skeleton"` that has no JS-visible exports.

The existing `target/guise-skeleton-{version}.zip` artifact remains produced by the `package` script for non-npm distribution; it is excluded from the tarball by virtue of not being listed in `files`.

**Testing:** verified in Step 7 (`npm pack --dry-run` file-list inspection).

## Step 3: Add `exports` map

Add an `"exports"` block declaring the modern entry points. Subpaths enumerate the published components by canonical name, with a `./css/*` escape hatch for any file under `dist/css/` not individually named (notably the `.min.css` and `.min.css.map` companions).

```json
"exports": {
  ".":              "./dist/css/guise-skeleton.css",
  "./min":          "./dist/css/guise-skeleton.min.css",
  "./reboot":       "./dist/css/bootstrap-reboot.css",
  "./base":         "./dist/css/guise-skeleton-base.css",
  "./layout":       "./dist/css/guise-skeleton-layout.css",
  "./avatar":       "./dist/css/guise-skeleton-avatar.css",
  "./button":       "./dist/css/guise-skeleton-button.css",
  "./card":         "./dist/css/guise-skeleton-card.css",
  "./hero":         "./dist/css/guise-skeleton-hero.css",
  "./menu":         "./dist/css/guise-skeleton-menu.css",
  "./page":         "./dist/css/guise-skeleton-page.css",
  "./pane":         "./dist/css/guise-skeleton-pane.css",
  "./panel":        "./dist/css/guise-skeleton-panel.css",
  "./rotulus":      "./dist/css/guise-skeleton-rotulus.css",
  "./table":        "./dist/css/guise-skeleton-table.css",
  "./thumbnail":    "./dist/css/guise-skeleton-thumbnail.css",
  "./css/*":        "./dist/css/*",
  "./package.json": "./package.json"
}
```

Rationale for shape:
- The component subpaths use bare semantic names (`@guise/skeleton/button`) rather than the file-name form (`@guise/skeleton/guise-skeleton-button`), giving consumers a clean import surface decoupled from internal file naming. The mapping handles the internal-name resolution.
- `./min` exposes the aggregated minified bundle; a per-component `./min/*` family is not added because the typical consumer who wants minification wants the aggregate bundle, and per-component subpaths combined with the consumer's bundler's own minification cover the rare case.
- `./css/*` is the pattern escape hatch — it makes every file under `dist/css/` (including `.min.css`, `.min.css.map`, and any future additions) reachable as `@guise/skeleton/css/<filename>` without requiring `exports` updates.
- `./package.json` is exposed because some tooling reads it via the package specifier.

**Testing:** import resolution is verified by `npm pack --dry-run` listing the referenced files, plus the smoke check in Step 7 confirming `node -e "require.resolve('@guise/skeleton/button')"` resolves against an installed tarball.

## Step 4: Add `prepublishOnly` script with SNAPSHOT guard

Add to the `scripts` block:

```json
"prepublishOnly": "node -e \"if(require('./package.json').version.toUpperCase().includes('SNAPSHOT'))process.exit(1)\" && npm run clean && npm test && npm run build"
```

The inline Node check refuses to publish if `version` still contains `SNAPSHOT` (case-insensitive). This is the primary defense against accidentally publishing a development version. The remainder chains the existing `clean`, `test`, and `build` scripts unchanged.

`prepublishOnly` runs on `npm publish` but **not** on `npm install` or `npm pack`, which is the correct gate: the consumer-side `npm pack --dry-run` verification (Step 7) inspects the working `dist/` without forcing a clean rebuild every time, but actual publishing cannot succeed with stale, untested, or snapshot-versioned output.

**Testing:** verified by inspecting the script's effect on a dry `npm publish` (no actual publish performed in this ticket).

## Step 5: Add `release:prepare` and `develop:prepare` version-management scripts

Add two Node scripts under `scripts/` mirroring the Maven release/develop workflow:

**`scripts/release-prepare.mjs`** — strips `-SNAPSHOT` from `version` in `package.json`:

- Read the current version from `package.json` (via `JSON.parse` of the file content).
- If `version` does not end with `-SNAPSHOT` (case-insensitive), exit with an error: `"Current version is not a SNAPSHOT: {version}"`.
- Compute the release version by stripping the `-SNAPSHOT` suffix (e.g., `0.2.0-SNAPSHOT` → `0.2.0`).
- Write it back via `execSync("npm pkg set version=" + release)`. This uses npm's own `package.json` update facility, which preserves indentation and formatting.
- Print the resulting version to stdout.

**`scripts/develop-prepare.mjs`** — sets the next development version:

- Read `process.argv[2]`. If absent, exit with an error: `"Usage: npm run develop:prepare -- <version>"`.
- Validate that the argument is a clean SemVer (no prerelease suffix). If it already contains `-SNAPSHOT` or any `-` prerelease, exit with an error.
- Write it via `execSync("npm pkg set version=" + next + "-SNAPSHOT")`. No manual file I/O needed.
- Print the resulting version to stdout.

Both scripts exit non-zero on validation failure without modifying `package.json`, so there is no partial state to recover from.

Add the corresponding entries to `package.json` `scripts`:

```json
"release:prepare": "node scripts/release-prepare.mjs",
"develop:prepare": "node scripts/develop-prepare.mjs"
```

The publish workflow then becomes:

```
npm run release:prepare         # 0.2.0-SNAPSHOT → 0.2.0
npm publish                      # uploads 0.2.0 (prepublishOnly gate passes)
npm run develop:prepare -- 0.3.0 # 0.2.0 → 0.3.0-SNAPSHOT
```

**Testing:** the scripts are exercised manually during Step 7 verification. Formal unit tests for these helpers are not warranted (trivial single-purpose utilities).

## Step 6: Update `readme.md` with consumer integration paths and `npm pack --dry-run` verification

Two edits to `readme.md`:

**4a. "Using Guise™ Skeleton" section** — restructure to lead with the npm-install paths, keeping the current zip/manual-file content as the third option. Document three consumer paths:

- **Bundler import.** `npm install @guise/skeleton`, then `import "@guise/skeleton";` (JS entry) or `@import "@guise/skeleton";` (CSS entry). Subpath examples: `@guise/skeleton/min`, `@guise/skeleton/button`.
- **Direct file reference.** `npm install @guise/skeleton`, then reference `node_modules/@guise/skeleton/dist/css/guise-skeleton.min.css` from a `<link>` or copy script. Useful for projects that do not run a bundler over CSS.
- **CDN.** `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@guise/skeleton@x.y.z/dist/css/guise-skeleton.min.css">` (and the equivalent unpkg URL). No install required.

The existing `guise-skeleton` class activation example, mix-and-match component list, and `Getting Started` link are retained as-is below the install paths.

**4b. "Building Guise™ Skeleton" section** — add a brief "Publishing" subsection covering:

- `npm pack --dry-run` to inspect the file list that will be published.
- `prepublishOnly` automatically runs `clean`, `test`, and `build`; `npm publish` cannot succeed without a fresh, tested build.
- Version management: `npm run release:prepare` strips `-SNAPSHOT`; `npm run develop:prepare -- X.Y.Z` sets the next development version.

**Testing:** not applicable; documentation.

## Step 7: Verify the produced tarball via `npm pack --dry-run`

Run `npm pack --dry-run` and confirm the listed files are exactly: every file under `dist/`, `readme.md`, `license.md`, `package.json`. Confirm no `src/`, no `scripts/`, no `target/`, no dotfiles, no `node_modules/`.

As a stronger smoke check, run `npm pack` (without `--dry-run`) to produce `guise-skeleton-{version}.tgz`, install it into a scratch directory, and verify:
- `node -e "console.log(require.resolve('@guise/skeleton'))"` resolves to `dist/css/guise-skeleton.css`.
- `node -e "console.log(require.resolve('@guise/skeleton/button'))"` resolves to `dist/css/guise-skeleton-button.css`.
- `node -e "console.log(require.resolve('@guise/skeleton/min'))"` resolves to `dist/css/guise-skeleton.min.css`.

The scratch directory and produced tarball are discarded; nothing is committed from the verification.

**Testing:** Step 7 itself *is* the verification step for the entire plan. Failures here indicate metadata defects in Steps 1–3.

## Rejected Alternatives

- **Embedding a JS entry point** (e.g., `dist/index.js` that imports the CSS via `import "./css/guise-skeleton.css"`). Rejected: adds no value for a CSS-only library, introduces a JS build step where none exists, and complicates the bundler/non-bundler symmetry. The `"sideEffects": ["**/*.css"]` flag and direct `exports` mapping to `.css` files cover bundler resolution without a JS shim.
- **Replacing the bespoke build pipeline as part of this ticket.** Rejected per ticket Out of Scope; deferred follow-up from [SKELT-1].
- **Adopting SemVer-strict `-snapshot.N` prerelease versions and publishing snapshot dist-tags.** Rejected per ticket Out of Scope; the existing `-SNAPSHOT`-stripped-at-publish convention is preserved.
- **Hijacking `npm version` lifecycle** to perform SNAPSHOT stripping and next-version setting automatically. Rejected: conceptual mismatch (`npm version` was designed around clean SemVer, and the scripts would need to undo/redo parts of what `npm version` did); fragile. Explicit `release:prepare` / `develop:prepare` scripts are more transparent.
- **Including `src/` in the published tarball.** Rejected: the unminified `dist/` files are effectively the sources (the build only adds a `@charset` header and version stamp, with no Sass/PostCSS transformation), so shipping `src/` would be near-duplicate content that adds confusion and bulk without information gain.
- **Manual `JSON.parse`/`JSON.stringify` for `package.json` updates in version-management scripts.** Rejected: rewrites the entire file, risks reformatting or reordering keys. `npm pkg set` is the semantic, official API for modifying individual fields; it preserves formatting and touches only the specified field.

## Skip / Do Not Touch

- The build pipeline (`build:copy-sources`, `build:minify`, `build:add-min-preambles`, `build:add-source-charset`, `build:insert-version`, `package`) is not modified.
- `scripts/build-versioned.mjs` is not modified.
- Source CSS under `src/main/css/` is not modified.
- The `package` script that produces `target/guise-skeleton-{version}.zip` is preserved as-is.
- Local-development conventions (`-SNAPSHOT` suffix in `version`, hand-vendoring `dist/css/guise-skeleton.min.css` into consumer projects) are not affected.
- The `-SNAPSHOT` suffix convention itself is preserved; the version-management scripts automate adding/removing it but do not change the convention.
