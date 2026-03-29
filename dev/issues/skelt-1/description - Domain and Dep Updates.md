# [SKELT-1]: Migrate from `guise.io` to `guise.dev` domain and update dependencies.

## Objective

Migrate all references from the `guise.io` domain to `guise.dev` across the entire project, update copyright year ranges, and upgrade all npm `devDependencies` to their latest versions.

## Problem

The Guise project is moving its web presence from `guise.io` to `guise.dev`. The Guise Skeleton codebase currently contains hardcoded `guise.io` URLs in CSS file headers, build resource preambles, `package.json`, and `readme.md`. These references will become stale after the domain migration. Additionally, the project's npm `devDependencies` have not been updated in some time—several packages are multiple major versions behind their current releases.

## Desired Behavior

- All URLs referencing `guise.io` point to the equivalent path under `guise.dev`.
- Copyright year ranges in file headers and preamble resources are extended through the current year where applicable.
- All npm `devDependencies` in `package.json` are updated to their latest stable versions and the project builds cleanly with the updated tooling.

## Constraints

- The domain change is a simple host substitution (`guise.io` → `guise.dev`); URL paths remain the same.
- Copyright notices for third-party files (e.g., `bootstrap-reboot.css`) must not be modified.
- `bootstrap-reboot.css` should be updated to the latest Bootstrap release. Its third-party copyright header should reflect the upstream version used.
- Dependency upgrades must not break the existing build pipeline (`npm run build`). The build uses `clean-css-cli`, `copyfiles`, `cross-var`, `cross-zip-cli`, `foreach-cli`, `mkdirp`, `preamble-cli`, `replace-in-file`, `rimraf`, and `stylelint` with `stylelint-config-recommended`.

## Acceptance Criteria

- No occurrence of `guise.io` remains anywhere in the repository (verified by full-text search).
- `package.json` `homepage` field uses `https://guise.dev/skeleton/`.
- All GlobalMentor copyright headers in source CSS files and `src/main/resources/min-preamble-footer.css` reflect the current year in their date range.
- All `devDependencies` in `package.json` reference the latest stable version of each package.
- `npm install` completes without errors after dependency updates.
- `bootstrap-reboot.css` contains the latest Bootstrap Reboot CSS.
- `npm run build` completes successfully with the updated dependencies and domain references.

## Non-Goals

- Changing the npm package name, version, or publishing configuration.
- Modifying the build pipeline scripts themselves (beyond what is required for compatibility with updated dependency versions).

## Guidance

### Orientation

- **Domain references in CSS headers**: Every `src/main/css/guise-skeleton-*.css` file and `src/main/css/guise-skeleton.css` contain a header comment with the URL `https://guise.io/skeleton/`. The same URL appears in `src/main/resources/min-preamble-footer.css`, which is injected into minified output during the build.
- **`package.json`**: The `homepage` field at `package.json` line 8 contains `https://guise.io/skeleton/`.
- **`readme.md`**: Contains three `guise.io` links—two on line 5 and one on line 69.
- **Copyright year ranges**: GlobalMentor copyright lines appear in each `guise-skeleton-*.css` source header and in `src/main/resources/min-preamble-footer.css`. The end year varies by file (2018, 2019, 2020, 2022).
