# TypeScript And Code Style

Tooling enforces the style. Run `yarn lint` and `yarn format:fix` before you push.

- **Formatting:** oxfmt with single quotes, trailing commas, and sorted imports.
- **Linting:** ESLint with `@callstack/eslint-config` and `typescript-eslint`. Notable rules: no `console`, and use `import type` for type-only imports.

## File Layout

Order each file top-down, so it reads from the public API to the details:

1. Exported functions (and their types) first.
2. Then non-exported helpers, in descending order: a helper comes after the functions that call it, and helpers called from it come after it.
