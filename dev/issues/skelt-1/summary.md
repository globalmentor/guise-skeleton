# [SKELT-1] Summary: Domain migration, dependency updates, and readme overview.

Migrated all `guise.io` references to `guise.dev` across CSS source headers, build resource preambles, `package.json`, and `readme.md`. Updated all npm `devDependencies` to their latest stable versions, eliminating 42 known vulnerabilities.

The most significant build change was removing `cross-var`, an unmaintained package (last released 2017) that pulled in Babel 6 with critical CVEs. It was replaced with inline `node -e` scripts that read `process.env.npm_package_config_*` variables directly, preserving cross-platform compatibility without introducing a shell dependency. The `rimraf` upgrade to v6 also required adding the `--glob` flag to the `clean` script.

Updated the vendored Bootstrap Reboot from v5.2.2 to v5.3.8. A compatibility analysis confirmed that Guise Skeleton's three existing Reboot tweaks (blockquote `margin-left`, code `color: inherit`, figure side margins) remain necessary and that the new upstream changes (dark-theme `[data-bs-theme]` support, rgba-based link color composition) are additive and non-breaking. The `sourceMappingURL` comment was stripped since the referenced Sass source map is not vendored.

Added an Overview section to `readme.md` covering the framework philosophy (semantic custom properties over selector overrides), the concise/verbose class-naming duality, a catalog of all components and layouts, and the customization approach.

## Deferred

- **Copyright year updates**: The GlobalMentor copyright headers in source CSS files still show their original year ranges (variously 2018–2022). Decided to defer a decision on any updates to release time.
- **Build modernization**: The build pipeline is a bespoke chain of micro-CLI utilities atypical for npm projects. A future ticket should consider consolidating into a standard build tool.
