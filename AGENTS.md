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
- **Format Check:** `yarn format` (Runs Oxfmt)
- **Validate All:** `yarn validate` (Runs Oxfmt, ESLint, Typecheck, and Tests in sequence)
- **Build Project:** `yarn build` (Cleans, builds JS with Babel, and builds TS types)

## Development Conventions

- **Code Style:**
  - **Linting:** ESLint is configured with `@callstack/eslint-config` and `typescript-eslint`. It enforces strict rules, including `no-console` and consistent type imports.
  - **Formatting:** Oxfmt is used for code formatting (single quotes, trailing commas).
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

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:

- Invoke: Bash("openskills read <skill-name>")
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:

- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
  </usage>

<available_skills>

<skill>
<name>code-review</name>
<description>Master effective code review practices to provide constructive feedback, catch bugs early, and foster knowledge sharing while maintaining team morale. Use when reviewing pull requests, establishing review standards, or mentoring developers.</description>
<location>project</location>
</skill>

<skill>
<name>doc-coauthoring</name>
<description>Guide users through a structured workflow for co-authoring documentation. Use when user wants to write documentation, proposals, technical specs, decision docs, or similar structured content. This workflow helps users efficiently transfer context, refine content through iteration, and verify the doc works for readers. Trigger when user mentions writing docs, creating proposals, drafting specs, or similar documentation tasks.</description>
<location>project</location>
</skill>

<skill>
<name>humanizer</name>
<description>Remove signs of AI-generated writing from text. Use when editing or reviewing
  text to make it sound more natural and human-written. Based on Wikipedia's
  comprehensive "Signs of AI writing" guide. Detects and fixes patterns including:
  inflated symbolism, promotional language, superficial -ing analyses, vague
  attributions, em dash overuse, rule of three, AI vocabulary words, negative
  parallelisms, and excessive conjunctive phrases.</description>
<location>project</location>
</skill>

</available_skills>

<!-- SKILLS_TABLE_END -->

</skills_system>
