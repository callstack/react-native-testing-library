# RNTL v14: Make render(), act(), renderHook(), and fireEvent() calls async

This codemod migrates your test files from React Native Testing Library v13 to v14 by transforming synchronous `render()`, `act()`, `renderHook()`, and `fireEvent()` calls to their async versions (`await render()`, `await act()`, `await renderHook()`, `await fireEvent()`, etc.) and making test functions async when needed.

## What it does

- ✅ Transforms `render()` calls to `await render()` in test functions
- ✅ Transforms `act()` calls to `await act()` in test functions
- ✅ Transforms `renderHook()` calls to `await renderHook()` in test functions
- ✅ Transforms `fireEvent()` calls to `await fireEvent()` in test functions
- ✅ Transforms `fireEvent.press()`, `fireEvent.changeText()`, and `fireEvent.scroll()` calls to `await fireEvent.press()`, etc.
- ✅ Transforms `screen.rerender()` and `screen.unmount()` calls to `await screen.rerender()`, etc.
- ✅ Transforms `renderer.rerender()` and `renderer.unmount()` calls (where renderer is the return value from `render()`) to `await renderer.rerender()`, etc.
- ✅ Transforms `hookResult.rerender()` and `hookResult.unmount()` calls (where hookResult is the return value from `renderHook()`) to `await hookResult.rerender()`, etc.
- ✅ Makes test functions async if they're not already
- ✅ Handles `test()`, `it()`, `test.skip()`, `it.skip()`, `test.only()`, `it.only()`, `test.each()`, and `it.each()` patterns
- ✅ Handles `beforeEach()`, `afterEach()`, `beforeAll()`, and `afterAll()` hooks
- ✅ Does NOT make `describe()` block callbacks async (they are just grouping mechanisms)
- ✅ Preserves already-awaited function calls
- ✅ Skips function calls in helper functions (not inside test callbacks)
- ✅ Only transforms calls imported from `@testing-library/react-native`
- ✅ Skips variants like `renderAsync`, `unsafe_act`, and `unsafe_renderHookSync`

## What it doesn't do

- ❌ Does not transform function calls in helper functions (like `renderWithProviders`) - **unless specified via `CUSTOM_RENDER_FUNCTIONS`**
- ❌ Does not transform function calls from other libraries
- ❌ Does not handle namespace imports (e.g., `import * as RNTL from '@testing-library/react-native'`)
- ❌ Does not transform unsafe variants (`unsafe_act`, `unsafe_renderHookSync`) or `renderAsync`
- ❌ Does not make `describe()` block callbacks async (they are grouping mechanisms, not test functions)

## Usage

### Running the codemod

```bash
# Run on your test files
npx codemod@latest workflow run -w ./codemods/v14-async-functions/workflow.yaml --target ./path/to/your/tests

# Or if published to the registry
npx codemod@latest run @testing-library/react-native-v14-async-functions --target ./path/to/your/tests

# With custom render functions - Option 1: Workflow parameter (recommended)
npx codemod@latest workflow run -w ./codemods/v14-async-functions/workflow.yaml --target ./path/to/your/tests --param customRenderFunctions="renderWithProviders,renderWithTheme"

# With custom render functions - Option 2: Environment variable
CUSTOM_RENDER_FUNCTIONS="renderWithProviders,renderWithTheme" npx codemod@latest workflow run -w ./codemods/v14-async-functions/workflow.yaml --target ./path/to/your/tests
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

#### Using act()

**Before:**

```typescript
import { act } from '@testing-library/react-native';

test('updates state', () => {
  act(() => {
    // Some state update
  });
});
```

**After:**

```typescript
import { act } from '@testing-library/react-native';

test('updates state', async () => {
  await act(() => {
    // Some state update
  });
});
```

#### Using renderHook()

**Before:**

```typescript
import { renderHook } from '@testing-library/react-native';

test('renders hook', () => {
  const { result } = renderHook(() => ({ value: 42 }));
  expect(result.current.value).toBe(42);
});
```

**After:**

```typescript
import { renderHook } from '@testing-library/react-native';

test('renders hook', async () => {
  const { result } = await renderHook(() => ({ value: 42 }));
  expect(result.current.value).toBe(42);
});
```

#### Combined usage

**Before:**

```typescript
import { render, act, renderHook, screen } from '@testing-library/react-native';

test('uses all three', () => {
  render(<MyComponent />);
  act(() => {
    // State update
  });
  const { result } = renderHook(() => ({ value: 42 }));
});
```

**After:**

```typescript
import { render, act, renderHook, screen } from '@testing-library/react-native';

test('uses all three', async () => {
  await render(<MyComponent />);
  await act(() => {
    // State update
  });
  const { result } = await renderHook(() => ({ value: 42 }));
});
```

#### Using fireEvent()

**Before:**

```typescript
import { fireEvent, render, screen } from '@testing-library/react-native';

test('uses fireEvent', () => {
  render(<MyComponent />);
  const button = screen.getByRole('button');
  fireEvent(button, 'press');
  expect(screen.getByText('Clicked')).toBeOnTheScreen();
});
```

**After:**

```typescript
import { fireEvent, render, screen } from '@testing-library/react-native';

test('uses fireEvent', async () => {
  await render(<MyComponent />);
  const button = screen.getByRole('button');
  await fireEvent(button, 'press');
  expect(screen.getByText('Clicked')).toBeOnTheScreen();
});
```

#### Using fireEvent methods

**Before:**

```typescript
import { fireEvent, render, screen } from '@testing-library/react-native';

test('uses fireEvent methods', () => {
  render(<MyComponent />);
  const input = screen.getByPlaceholderText('Enter text');
  const button = screen.getByRole('button');
  const scrollView = screen.getByTestId('scroll-view');

  fireEvent.press(button);
  fireEvent.changeText(input, 'Hello');
  fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { y: 100 } } });
});
```

**After:**

```typescript
import { fireEvent, render, screen } from '@testing-library/react-native';

test('uses fireEvent methods', async () => {
  await render(<MyComponent />);
  const input = screen.getByPlaceholderText('Enter text');
  const button = screen.getByRole('button');
  const scrollView = screen.getByTestId('scroll-view');

  await fireEvent.press(button);
  await fireEvent.changeText(input, 'Hello');
  await fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { y: 100 } } });
});
```

#### Skipping unsafe variants

**Before:**

```typescript
import { act, renderHook, unsafe_act, unsafe_renderHookSync, renderAsync } from '@testing-library/react-native';

test('skips unsafe variants', () => {
  act(() => {}); // Will be transformed
  unsafe_act(() => {}); // Will NOT be transformed
  renderHook(() => ({})); // Will be transformed
  unsafe_renderHookSync(() => ({})); // Will NOT be transformed
  renderAsync(<Component />); // Will NOT be transformed
});
```

**After:**

```typescript
import { act, renderHook, unsafe_act, unsafe_renderHookSync, renderAsync } from '@testing-library/react-native';

test('skips unsafe variants', async () => {
  await act(() => {}); // Transformed
  unsafe_act(() => {}); // Unchanged
  await renderHook(() => ({})); // Transformed
  unsafe_renderHookSync(() => ({})); // Unchanged
  renderAsync(<Component />); // Unchanged
});
```

#### Helper functions (not transformed by default)

**Before:**

```typescript
function renderWithProviders(component: React.ReactElement) {
  render(component); // This is NOT transformed by default
}

test('uses helper', () => {
  renderWithProviders(<Component />);
});
```

**After (without CUSTOM_RENDER_FUNCTIONS):**

```typescript
function renderWithProviders(component: React.ReactElement) {
  render(component); // Unchanged - helper functions are skipped by default
}

test('uses helper', () => {
  renderWithProviders(<Component />);
});
```

#### Custom render functions (with CUSTOM_RENDER_FUNCTIONS)

When you specify custom render function names via the `CUSTOM_RENDER_FUNCTIONS` environment variable, those functions will be transformed:

**Before:**

```typescript
function renderWithProviders(component: React.ReactElement) {
  render(component);
}

const renderWithTheme = (component: React.ReactElement) => {
  render(component);
};

test('uses custom render', () => {
  renderWithProviders(<Component />);
  renderWithTheme(<Component />);
});
```

**After (with CUSTOM_RENDER_FUNCTIONS="renderWithProviders,renderWithTheme"):**

```typescript
async function renderWithProviders(component: React.ReactElement) {
  await render(component);
}

const renderWithTheme = async (component: React.ReactElement) => {
  await render(component);
};

test('uses custom render', async () => {
  await renderWithProviders(<Component />);
  await renderWithTheme(<Component />);
});
```

#### Describe blocks (not made async)

`describe()` blocks are grouping mechanisms and their callbacks are not made async, even if they contain `render` calls in helper functions. However, `test()` callbacks inside `describe` blocks are still made async.

**Before:**

```typescript
import { render, screen } from '@testing-library/react-native';

describe('MyComponent', () => {
  function setupComponent() {
    render(<MyComponent />);
  }

  test('renders component', () => {
    setupComponent();
    expect(screen.getByText('Hello')).toBeOnTheScreen();
  });

  test('renders with direct render call', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeOnTheScreen();
  });
});
```

**After:**

```typescript
import { render, screen } from '@testing-library/react-native';

describe('MyComponent', () => {
  function setupComponent() {
    render(<MyComponent />);
  }

  test('renders component', () => {
    setupComponent();
    expect(screen.getByText('Hello')).toBeOnTheScreen();
  });

  test('renders with direct render call', async () => {
    await render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeOnTheScreen();
  });
});
```

Note: The `describe` callback remains synchronous. The `test` callback that directly calls `render()` is made async, but the `test` callback that only calls a helper function (not in `CUSTOM_RENDER_FUNCTIONS`) remains synchronous.

## Testing

Run the test suite:

```bash
cd codemods/v14-async-functions
yarn test
```

## Limitations

1. **Helper functions**: Function calls (`render`, `act`, `renderHook`, `fireEvent`) inside helper functions (not directly in test callbacks) are not transformed by default. You can specify custom render function names via the `--param customRenderFunctions=...` flag or `CUSTOM_RENDER_FUNCTIONS` environment variable to have them automatically transformed. For other helper functions, you'll need to manually update them to be async and await their calls.

2. **Namespace imports**: The codemod currently doesn't handle namespace imports like `import * as RNTL from '@testing-library/react-native'`. If you use this pattern, you'll need to manually update those calls.

3. **Semantic analysis**: The codemod uses pattern matching rather than semantic analysis, so it may transform function calls that aren't from RNTL if they match the pattern. Always review the changes.

4. **fireEvent methods**: Only `fireEvent.press`, `fireEvent.changeText`, and `fireEvent.scroll` are transformed. Other `fireEvent` methods are not automatically transformed.

## Migration Guide

1. **Run the codemod** on your test files
2. **If you have custom render functions** (like `renderWithProviders`, `renderWithTheme`, etc.), run the codemod with the `--param` flag:
   ```bash
   npx codemod@latest workflow run -w ./codemods/v14-async-functions/workflow.yaml --target ./path/to/your/tests --param customRenderFunctions="renderWithProviders,renderWithTheme"
   ```
   Or use the environment variable:
   ```bash
   CUSTOM_RENDER_FUNCTIONS="renderWithProviders,renderWithTheme" npx codemod@latest workflow run -w ./codemods/v14-async-functions/workflow.yaml --target ./path/to/your/tests
   ```
3. **Review the changes** to ensure all transformations are correct
4. **Manually update helper functions** that contain `render`, `act`, `renderHook`, or `fireEvent` calls (if not specified in `CUSTOM_RENDER_FUNCTIONS`)
5. **Manually update other fireEvent methods** if you use methods other than `press`, `changeText`, or `scroll`
6. **Update your RNTL version** to v14
7. **Run your tests** to verify everything works

## Contributing

If you find issues or have suggestions for improvements, please open an issue or submit a pull request to the React Native Testing Library repository.
