# Code Assistant Context

This document provides context for the any code assistant to understand the `@testing-library/react-native` project.

## Project Overview

`@testing-library/react-native` (RNTL) provides a set of utilities for testing React Native components. It is designed to facilitate writing tests that resemble how users interact with the application, avoiding implementation details.

- **Core Principle:** "The more your tests resemble the way your software is used, the more confidence they can give you."
- **Tech Stack:** TypeScript, React Native, Jest.
- **Architecture:** The library simulates the React Native runtime on top of `test-renderer`.

## Project Guidelines

- Small API surface
- Expose all features of the underlying platform (react, react-reconciler) for Testing Libraries to use
- Render host elements only, yet provide escape hatches to fibers when needed

## Building and Running

The project uses `yarn` for dependency management and script execution.

- **Installation:** `yarn install`
- **Run Tests:** `yarn test` (Runs Jest)
- **Run Tests (CI):** `yarn test:ci` (Runs Jest with worker limits)
- **Lint Code:** `yarn lint` (Runs ESLint on `src`)
- **Type Check:** `yarn typecheck` (Runs TypeScript compiler)
- **Format Check:** `yarn prettier`
- **Validate All:** `yarn validate` (Runs Prettier, ESLint, Typecheck, and Tests in sequence)
- **Build Project:** `yarn build` (Cleans, builds JS with Babel, and builds TS types)

## Development Conventions

- **Code Style:**
  - **Linting:** ESLint is configured with `@callstack/eslint-config` and `typescript-eslint`. It enforces strict rules, including `no-console` and consistent type imports.
  - **Formatting:** Prettier is used for code formatting (single quotes, trailing commas).
  - **Imports:** Sorted using `eslint-plugin-simple-import-sort`.

- **Testing:**
  - **Framework:** Jest with `react-native` preset.
  - **Location:** Tests are located within `src`, typically co-located in `__tests__` directories.
  - **Setup:** `jest-setup.ts` configures the test environment. `src/index.ts` automatically configures cleanup after each test unless skipped.
  - **Coverage:** Collected from `src`, excluding tests.
  - **Organization:** Use `describe` to group test by theme. Avoid putting all tests in the same `describe` block. Avoid `describe` nesting. Avoid `describe` with only single test, make that test top-level. Prefere `test` over `it`.

- **Commits & Releases:**
  - **Commits:** Follow the **Conventional Commits** specification (e.g., `fix:`, `feat:`, `chore:`). This is enforced and used for changelog generation.
  - **Releases:** Managed via `release-it`.

- **File Structure:**
  - `src/`: Source code.
  - `src/pure.ts`: Core logic without side effects (no auto-cleanup).
  - `src/index.ts`: Main entry point, re-exports `pure` and adds side effects (auto-cleanup).
  - `examples/`: Example React Native applications using the library.
  - `website/`: Documentation website.

## Example App Regeneration

- Prefer regenerating Expo example apps in a temporary directory and then copying the fresh scaffold into place, instead of mutating the existing app in place.
- Before replacing an example app, move the current app directory to `/tmp` so repo-specific code, tests, assets, and configs can be restored selectively.
- After copying a freshly generated app into `examples/`, remove the generated `.git` directory and generated `node_modules`, then reinstall from inside the repo workspace.

- `examples/basic`:
  - Generate from the Expo blank TypeScript scaffold:
    - `yarn create expo-app /tmp/rntl-basic-fresh --template blank-typescript --yes`
  - Restore the repo-specific sample app files on top of the new scaffold:
    - `App.tsx`
    - `components/`
    - `__tests__/`
    - `theme.ts`
    - `jest.config.js`
    - `jest-setup.ts`
    - `babel.config.js`
    - `eslint.config.mjs`
    - `README.md`
    - `.expo-shared/assets.json` if it existed before
  - Keep the fresh Expo entrypoint (`index.ts`) and update `package.json` / `app.json` to match the repo naming and scripts.

- `examples/cookbook`:
  - Generate from a router-enabled Expo scaffold:
    - `yarn create expo-app /tmp/rntl-cookbook-fresh --example with-router --yes`
  - Restore the repo-specific cookbook files on top of the new scaffold:
    - `app/`
    - tutorial test directories such as `basics-tutorial/` and `basics-tutorial-react-strict-dom/`
    - `theme.ts`
    - `jest.config.js`
    - `jest-setup.ts`
    - `babel.config.js`
    - `.eslintrc`, `.eslintignore`
    - `README.md`
    - custom assets not present in the scaffold, such as `assets/gradientRNBanner.png`
    - `.expo-shared/assets.json` if it existed before
  - Keep the fresh Expo Router entry setup, then reapply the cookbook-specific dependency set in `package.json` and `app.json`.

- After regenerating either example app, validate from inside the app directory:
  - `yarn expo install --check`
  - `yarn lint`
  - `yarn typecheck`
  - `yarn test --watchman=false`

- If the fresh scaffold introduces dependency-resolution churn, prefer restoring the previous `yarn.lock` first and then running `yarn install`, rather than re-resolving the whole dependency tree from scratch.

## PR draft workflow:

- Maintain `PR.txt` at the repository root using the structure from `.github/pull_request_template.md`.
- Keep `PR.txt` aligned with the current branch diff relative to `origin/main`, including tests actually run and any known validation gaps.
- Do not commit `PR.txt`.
