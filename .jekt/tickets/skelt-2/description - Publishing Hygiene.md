# [SKELT-2] Publishing Hygiene

## Objective

The `@guise/skeleton` package, when installed from the npm registry, exposes the built CSS distribution through standard package-entry metadata, so that bundler-based and direct-reference consumers can integrate it using conventional npm workflows.

## Acceptance Criteria

- The published tarball contains only the built distribution (`dist/`), `readme.md`, and `license`, and excludes raw sources, build scripts, dotfiles, and the `target/` zip.
- `package.json` declares `main`, `style`, `exports`, and `sideEffects` such that a bare specifier `@guise/skeleton` resolves to the default stylesheet under Node module resolution, and documented subpaths resolve to the corresponding component stylesheets and to the minified variant.
- `npm publish` cannot succeed without a fresh, tested build: a `prepublishOnly` script runs clean, test, and build.
- `npm pack --dry-run` lists the intended file set, and the result is documented as the verification step in `readme.md`.
- `readme.md` documents three consumer integration paths: `npm install` with bundler import, `npm install` with direct file reference into `node_modules/`, and CDN reference (jsDelivr/unpkg) by stable URL.
- The standalone `target/guise-skeleton-x.y.z.zip` artifact continues to be produced by the existing `package` script for use as a non-npm download.

## Background

The currently published v0.1.0 tarball was generated with npm's default file-selection rules and contains the raw `src/` tree with no `dist/`, no `main`, and no `exports`. A consumer who runs `npm install @guise/skeleton` therefore receives only unminified, non-version-stamped source files, and the bare specifier `@guise/skeleton` does not resolve through any bundler. This blocks every modern integration path — bundler import, direct reference to a known `dist/` location, and CDN URLs that depend on a stable published layout — and leaves manual download as the only viable consumer workflow.

The build pipeline already produces every artifact a modern consumer needs (`dist/css/guise-skeleton.css`, `dist/css/guise-skeleton.min.css`, per-component variants, source maps). The gap is entirely in publication metadata and tarball composition, not in what is built.

## Approach

Limit changes to `package.json` metadata, a `prepublishOnly` gate, and `readme.md`. Do not alter the build pipeline, source layout, version-stamping mechanism, or the existing `package` zip script. The `exports` map enumerates the default entry, a `./min` subpath for the minified variant, per-component subpaths for the published components, and a `./css/*` pattern as an escape hatch for files not individually enumerated.

## Out of Scope

- Replacing or restructuring the bespoke build pipeline (deferred from [SKELT-1]).
- Any change to the local-development workflow that uses a `-SNAPSHOT` version suffix and hand-vendors `dist/css/guise-skeleton.min.css` into consumer projects.
- Consumer-side automation for npm-installed assets in Guise Mummy projects (a separate Guise Mummy concern).
- Adoption of any private registry, dist-tag scheme, or prerelease publication workflow.

## Notes

Follow-up from [SKELT-1], which deferred build modernization and noted the absence of modern publication metadata.

[SKELT-1]: ../skelt-1/
