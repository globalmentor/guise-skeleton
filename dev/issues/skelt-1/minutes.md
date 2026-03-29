# Minutes

<!-- Categories: Pivot | Insight | Decision | Finding | Lesson | Milestone | Open | Resolved -->

- 2026-03-28 **Finding**: `cross-var` (last released 2017) transitively pulls in Babel 6, introducing 42 vulnerabilities (36 critical). No maintained version exists.
- 2026-03-28 **Insight**: The build system is a bespoke Maven-style pipeline of micro-CLI utilities (`foreach-cli`, `preamble-cli`, `replace-in-file` CLI, `cross-zip-cli`, `cross-var`), atypical for npm projects. Standard practice would use a single build tool (Rollup, PostCSS) that reads `package.json` directly. A future ticket should modernize it.
- 2026-03-28 **Lesson**: npm on Windows defaults to `cmd.exe` for script execution regardless of the terminal the user is in. Shell-specific syntax like `$(…)` in npm scripts will silently produce wrong results rather than failing. Always test npm script changes through `npm run`, not by running the command directly in the terminal.
- 2026-03-28 **Decision**: Replaced `cross-var` with a local Node.js build helper (`scripts/build-versioned.mjs`) that calls the `replace-in-file` and `cross-zip` APIs directly. Rejected: inline `$(node -p …)` substitution (fails on `cmd.exe`), `.npmrc` `script-shell=bash` override (broadens platform requirements), maintained `cross-var` forks (same maintenance risk).
- 2026-03-28 **Milestone**: All npm `devDependencies` updated to latest stable versions with zero vulnerabilities. Domain references migrated from `guise.io` to `guise.dev`.
- 2026-03-28 **Finding**: Bootstrap Reboot v5.3.8 introduces a `[data-bs-theme]` dark-mode system and changes link color from direct `var(--bs-link-color)` to rgba composition via `--bs-link-color-rgb`. Guise Skeleton is unaffected because it never reads `--bs-*` variables and neutralizes link styling in menus/nav. The three existing Reboot tweaks (blockquote `margin-left`, code `color: inherit`, figure side margins) remain necessary.
- 2026-03-28 **Decision**: Stripped the vendored `bootstrap-reboot.css` `sourceMappingURL` comment rather than shipping the Sass source map. The map references Bootstrap's `.scss` sources which aren't present; `clean-css --source-map` already generates a useful min→unminified map in the build.
- 2026-03-28 **Milestone**: Bootstrap Reboot updated from v5.2.2 to v5.3.8.
