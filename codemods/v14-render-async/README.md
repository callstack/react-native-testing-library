# RNTL v14: Make render() calls async

This codemod migrates your test files from React Native Testing Library v13 to v14 by transforming synchronous `render()` calls to `await render()` calls and making test functions async when needed.

## What it does

- ✅ Transforms `render()` calls to `await render()` in test functions
- ✅ Makes test functions async if they're not already
- ✅ Handles `test()`, `it()`, `test.skip()`, and `it.skip()` patterns
- ✅ Preserves already-awaited render calls
- ✅ Skips render calls in helper functions (not inside test callbacks)
- ✅ Only transforms render calls imported from `@testing-library/react-native`

## What it doesn't do

- ❌ Does not transform render calls in helper functions (like `renderWithProviders`)
- ❌ Does not transform render calls from other libraries
- ❌ Does not handle namespace imports (e.g., `import * as RNTL from '@testing-library/react-native'`)

## Usage

### Running the codemod

```bash
# Run on your test files
npx codemod@latest workflow run -w ./codemods/v14-render-async/workflow.yaml --target ./path/to/your/tests

# Or if published to the registry
npx codemod@latest run @testing-library/react-native-v14-render-async --target ./path/to/your/tests
```

### Example transformations

#### Basic sync test

**Before:**
```typescript
import { render, screen } from '@testing-library/react-native';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
```

**After:**
```typescript
import { render, screen } from '@testing-library/react-native';

test('renders component', async () => {
  await render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
```

#### Already async test

**Before:**
```typescript
test('renders component', async () => {
  render(<MyComponent />);
});
```

**After:**
```typescript
test('renders component', async () => {
  await render(<MyComponent />);
});
```

#### Multiple render calls

**Before:**
```typescript
test('renders multiple', () => {
  render(<Comp1 />);
  render(<Comp2 />);
});
```

**After:**
```typescript
test('renders multiple', async () => {
  await render(<Comp1 />);
  await render(<Comp2 />);
});
```

#### Render with options

**Before:**
```typescript
test('renders with wrapper', () => {
  render(<Component />, { wrapper: Wrapper });
});
```

**After:**
```typescript
test('renders with wrapper', async () => {
  await render(<Component />, { wrapper: Wrapper });
});
```

#### Helper functions (not transformed)

**Before:**
```typescript
function renderWithProviders(component: React.ReactElement) {
  render(component); // This is NOT transformed
}

test('uses helper', () => {
  renderWithProviders(<Component />);
});
```

**After:**
```typescript
function renderWithProviders(component: React.ReactElement) {
  render(component); // Unchanged - helper functions are skipped
}

test('uses helper', () => {
  renderWithProviders(<Component />);
});
```

## Testing

Run the test suite:

```bash
cd codemods/v14-render-async
yarn test
```

## Limitations

1. **Helper functions**: Render calls inside helper functions (not directly in test callbacks) are not transformed. You'll need to manually update these functions to be async and await their render calls.

2. **Namespace imports**: The codemod currently doesn't handle namespace imports like `import * as RNTL from '@testing-library/react-native'`. If you use this pattern, you'll need to manually update those calls.

3. **Semantic analysis**: The codemod uses pattern matching rather than semantic analysis, so it may transform render calls that aren't from RNTL if they match the pattern. Always review the changes.

## Migration Guide

1. **Run the codemod** on your test files
2. **Review the changes** to ensure all transformations are correct
3. **Manually update helper functions** that contain render calls
4. **Update your RNTL version** to v14
5. **Run your tests** to verify everything works

## Contributing

If you find issues or have suggestions for improvements, please open an issue or submit a pull request to the React Native Testing Library repository.
