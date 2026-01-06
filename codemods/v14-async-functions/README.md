# RNTL v14: Make render(), act(), renderHook(), and fireEvent() calls async

This codemod migrates your test files from React Native Testing Library v13 to v14 by automatically transforming synchronous function calls to async versions and making test functions async when needed.

## What it does

- Transforms `render()`, `act()`, `renderHook()`, and `fireEvent()` calls to `await render()`, `await act()`, etc.
- Makes test functions (`test()`, `it()`, hooks) async when needed
- Handles `fireEvent.press()`, `fireEvent.changeText()`, `fireEvent.scroll()`, `screen.rerender()`, `screen.unmount()`, and renderer methods
- Only transforms calls imported from `@testing-library/react-native`

## Usage

```bash
# Run the codemod
npx codemod@latest run rntl-v14-async-functions --target ./path/to/your/tests
```

### Custom render functions

If you have custom render helper functions (like `renderWithProviders`, `renderWithTheme`), specify them so they get transformed too:

```bash
npx codemod@latest run rntl-v14-async-functions --target ./path/to/your/tests --param customRenderFunctions="renderWithProviders,renderWithTheme"
```

## Example

**Before:**

```typescript
test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
```

**After:**

```typescript
test('renders component', async () => {
  await render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
```

## Limitations

- Helper functions are not transformed by default (use `customRenderFunctions` param if needed)
- Namespace imports (`import * as RNTL`) are not handled

## Next steps

1. Run the codemod on your test files
2. Review the changes
3. Manually update any remaining helper functions if needed
4. Update your RNTL version to v14 (`rntl-v14-update-deps` codemod)
5. Run your tests to verify everything works
