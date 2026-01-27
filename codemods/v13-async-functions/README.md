# RNTL v13: Rename render, renderHook, and fireEvent to async variants

This codemod migrates your test files to use async function names (`renderAsync`, `renderHookAsync`, `fireEventAsync`) instead of the synchronous names (`render`, `renderHook`, `fireEvent`) for React Native Testing Library v13.

## What it does

- Renames `render()` to `renderAsync()` in imports and usages
- Renames `renderHook()` to `renderHookAsync()` in imports and usages
- Renames `fireEvent()` to `fireEventAsync()` in imports and usages (including `fireEvent.press()`, `fireEvent.changeText()`, etc.)

## Usage

```bash
# Run the codemod
npx codemod@latest run rntl-v13-async-functions --target ./path/to/your/tests
```

## Example

**Before:**

```typescript
import { render, renderHook, fireEvent } from '@testing-library/react-native';

test('renders component', () => {
  const component = render(<MyComponent />);
  const { result } = renderHook(() => useMyHook());
  fireEvent.press(component.getByText('Button'));
});
```

**After:**

```typescript
import { renderAsync, renderHookAsync, fireEventAsync } from '@testing-library/react-native';

test('renders component', () => {
  const component = renderAsync(<MyComponent />);
  const { result } = renderHookAsync(() => useMyHook());
  fireEventAsync.press(component.getByText('Button'));
});
```

## Limitations

- Namespace imports (`import * as RNTL`) are not handled
- Only transforms functions imported from `@testing-library/react-native`
