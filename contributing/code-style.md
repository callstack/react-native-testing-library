# TypeScript And Code Style

Tooling enforces the style. Run `yarn lint` and `yarn format:fix` before you push.

- **Formatting:** oxfmt with single quotes, trailing commas, and sorted imports.
- **Linting:** ESLint with `@callstack/eslint-config` and `typescript-eslint`. Notable rules: no `console`, and use `import type` for type-only imports.
