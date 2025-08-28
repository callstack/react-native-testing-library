# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **React Native Testing Library (RNTL)** - a comprehensive testing solution for React Native applications that provides React Native runtime simulation on top of `react-test-renderer`. The library encourages better testing practices by focusing on testing behavior rather than implementation details.

## Key Development Commands

### Testing

- `yarn test` - Run all tests
- `yarn test:ci` - Run tests with CI optimizations (maxWorkers=2)
- `yarn test:ci:coverage` - Run tests with coverage reporting

### Building

- `yarn build` - Full build process (clean, build JS, build types, copy flow types)
- `yarn build:js` - Build JavaScript using Babel
- `yarn build:ts` - Build TypeScript declarations
- `yarn clean` - Clean build directory

### Code Quality

- `yarn typecheck` - Run TypeScript compiler
- `yarn lint` - Run ESLint with caching
- `yarn validate` - Run lint + typecheck + test (pre-commit validation)

### Testing Single Files

To test a specific file: `yarn test path/to/test.test.tsx`

## Architecture Overview

### Core Components

1. **`src/index.ts`** - Main entry point that sets up auto-cleanup and extends Jest matchers
2. **`src/pure.ts`** - Pure exports without auto-cleanup for advanced use cases
3. **`src/render.tsx`** - Core rendering functionality using `react-test-renderer`
4. **`src/screen.ts`** - Global screen object providing access to rendered components

### Key Modules

- **`src/queries/`** - Query functions for finding elements (byText, byRole, byTestId, etc.)
- **`src/matchers/`** - Jest matchers for assertions (toBeVisible, toHaveTextContent, etc.)
- **`src/user-event/`** - User interaction simulation (press, type, scroll, etc.)
- **`src/helpers/`** - Utility functions for component tree traversal and debugging
- **`src/fire-event.ts`** - Low-level event firing utilities

### Query System

The library provides three query variants for each selector:

- `get*` - Throws if not found (for assertions)
- `query*` - Returns null if not found (for conditional logic)
- `find*` - Returns Promise, waits for element (for async operations)

### User Events vs Fire Events

- **User Events** (`src/user-event/`) - High-level, realistic user interactions
- **Fire Events** (`src/fire-event.ts`) - Low-level, direct event dispatching

## Configuration

### Jest Setup

- Main Jest config: `jest.config.js`
- Setup file: `jest-setup.ts`
- Uses React Native preset with custom transform ignore patterns

### TypeScript

- Main config: `tsconfig.json` (development)
- Release config: `tsconfig.release.json` (for builds)
- Strict mode enabled with ES2022 target

### ESLint

- Config: `eslint.config.mjs`
- Uses Callstack config + TypeScript strict rules
- Custom rules for import sorting and test files

## Testing Patterns

### Component Testing

```jsx
import { render, screen, userEvent } from '@testing-library/react-native';

test('component behavior', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);

  await user.press(screen.getByRole('button'));
  expect(screen.getByText('Expected text')).toBeOnTheScreen();
});
```

### Async Testing

Use `findBy*` queries or `waitFor` for async operations:

```jsx
const element = await screen.findByText('Async content');
await waitFor(() => expect(mockFn).toHaveBeenCalled());
```

## Development Workflow

1. **Working with Examples**: Test changes in `examples/` directory
2. **Commit Messages**: Follow conventional commits (feat:, fix:, docs:, test:, chore:, refactor:, BREAKING:)
3. **Pre-commit**: Hooks verify linting, type checking, and tests pass
4. **Pull Requests**: Run `yarn validate` before submitting

## Build Process

The build creates:

- `build/` - Compiled JavaScript and TypeScript declarations
- `matchers.js` - Jest matchers for separate import
- `pure.js` - Pure version without auto-cleanup
- `dont-cleanup-after-each.js` - Version without auto-cleanup

## Package Structure

- **Main exports**: Full library with auto-cleanup
- **Pure exports**: Library without auto-cleanup (`/pure`)
- **Matcher exports**: Jest matchers only (`/matchers`)
- **No cleanup**: Disable auto-cleanup (`/dont-cleanup-after-each`)

## Testing Environment

- Uses `react-test-renderer` for component rendering
- Fake timers recommended for user events
- String validation available for text rendering checks
- Supports both concurrent and legacy React rendering modes
