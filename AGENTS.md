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

- **Commits & Releases:**
  - **Commits:** Follow the **Conventional Commits** specification (e.g., `fix:`, `feat:`, `chore:`). This is enforced and used for changelog generation.
  - **Releases:** Managed via `release-it`.

- **File Structure:**
  - `src/`: Source code.
  - `src/pure.ts`: Core logic without side effects (no auto-cleanup).
  - `src/index.ts`: Main entry point, re-exports `pure` and adds side effects (auto-cleanup).
  - `examples/`: Example React Native applications using the library.
  - `website/`: Documentation website.
