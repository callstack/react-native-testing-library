---
name: react-native-teting-library-v13
description: >
  Write tests using React Native Testing Library (RNTL) v13 (`@testing-library/react-native`).
  Use when writing, reviewing, or fixing React Native component tests.
  Covers: render, screen, queries (getBy/getAllBy/queryBy/findBy), Jest matchers,
  userEvent, fireEvent, waitFor, and async patterns.
  Supports both React 18 (sync render) and React 19 compat (renderAsync/fireEventAsync).
  Triggers on: test files for React Native components, RNTL imports, mentions of
  "testing library", "write tests", "component tests", or "RNTL".
---

# RNTL v13 Test Writing Guide

## Core Pattern

```tsx
import { render, screen, userEvent } from '@testing-library/react-native';

jest.useFakeTimers(); // recommended when using userEvent

test('description', async () => {
  const user = userEvent.setup();
  render(<Component />); // sync in v13 (React 18)

  const button = screen.getByRole('button', { name: 'Submit' });
  await user.press(button);

  expect(screen.getByText('Done')).toBeOnTheScreen();
});
```

## Query Priority

Use in this order: `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByDisplayValue` > `getByTestId` (last resort).

## Query Variants

| Variant       | Use case                 | Returns                        | Async |
| ------------- | ------------------------ | ------------------------------ | ----- |
| `getBy*`      | Element must exist       | `ReactTestInstance` (throws)   | No    |
| `getAllBy*`   | Multiple must exist      | `ReactTestInstance[]` (throws) | No    |
| `queryBy*`    | Check non-existence ONLY | `ReactTestInstance \| null`    | No    |
| `queryAllBy*` | Count elements           | `ReactTestInstance[]`          | No    |
| `findBy*`     | Wait for element         | `Promise<ReactTestInstance>`   | Yes   |
| `findAllBy*`  | Wait for multiple        | `Promise<ReactTestInstance[]>` | Yes   |

## Interactions

Prefer `userEvent` over `fireEvent`. userEvent is always async.

```tsx
const user = userEvent.setup();
await user.press(element); // full press sequence
await user.longPress(element, { duration: 800 }); // long press
await user.type(textInput, 'Hello'); // char-by-char typing
await user.clear(textInput); // clear TextInput
await user.paste(textInput, 'pasted text'); // paste into TextInput
await user.scrollTo(scrollView, { y: 100 }); // scroll
```

Use `fireEvent` only when `userEvent` doesn't support the event:

```tsx
fireEvent.press(element); // sync, onPress only
fireEvent.changeText(textInput, 'new text'); // sync, onChangeText only
fireEvent(element, 'blur'); // any event by name
```

## Assertions (Jest Matchers)

Available automatically with any `@testing-library/react-native` import.

| Matcher                                    | Use for                                   |
| ------------------------------------------ | ----------------------------------------- |
| `toBeOnTheScreen()`                        | Element exists in tree                    |
| `toBeVisible()`                            | Element visible (not hidden/display:none) |
| `toBeEnabled()` / `toBeDisabled()`         | Disabled state via `aria-disabled`        |
| `toBeChecked()` / `toBePartiallyChecked()` | Checked state                             |
| `toBeSelected()`                           | Selected state                            |
| `toBeExpanded()` / `toBeCollapsed()`       | Expanded state                            |
| `toBeBusy()`                               | Busy state                                |
| `toHaveTextContent(text)`                  | Text content match                        |
| `toHaveDisplayValue(value)`                | TextInput display value                   |
| `toHaveAccessibleName(name)`               | Accessible name                           |
| `toHaveAccessibilityValue(val)`            | Accessibility value                       |
| `toHaveStyle(style)`                       | Style match                               |
| `toHaveProp(name, value?)`                 | Prop check (last resort)                  |
| `toContainElement(el)`                     | Contains child element                    |
| `toBeEmptyElement()`                       | No children                               |

## Rules

1. **Use `screen`** for queries, not destructuring from `render()`
2. **Use `getByRole` first** with `{ name: '...' }` option
3. **Use `queryBy*` ONLY** for `.not.toBeOnTheScreen()` checks
4. **Use `findBy*`** for async elements, NOT `waitFor` + `getBy*`
5. **Never put side-effects in `waitFor`** (no `fireEvent`/`userEvent` inside)
6. **One assertion per `waitFor`**
7. **Never pass empty callbacks to `waitFor`**
8. **Don't wrap in `act()`** - `render`, `fireEvent`, `userEvent` handle it
9. **Don't call `cleanup()`** - automatic after each test
10. **Prefer ARIA props** (`role`, `aria-label`, `aria-disabled`) over legacy `accessibility*` props
11. **Use RNTL matchers** over raw prop assertions

## React 19 Compatibility (v13.3+)

For React 19 or Suspense, use async variants:

```tsx
import { renderAsync, screen, fireEventAsync } from '@testing-library/react-native';

test('async component', async () => {
  await renderAsync(<SuspenseComponent />);
  await fireEventAsync.press(screen.getByRole('button'));
  expect(screen.getByText('Result')).toBeOnTheScreen();
});
```

Use `rerenderAsync`/`unmountAsync` instead of `rerender`/`unmount` when using `renderAsync`.

## `*ByRole` Quick Reference

Common roles: `button`, `text`, `heading` (alias: `header`), `searchbox`, `switch`, `checkbox`, `radio`, `img`, `link`, `alert`, `menu`, `menuitem`, `tab`, `tablist`, `progressbar`, `slider`, `spinbutton`, `timer`, `toolbar`.

`getByRole` options: `{ name, disabled, selected, checked, busy, expanded, value: { min, max, now, text } }`.

For `*ByRole` to match, the element must be an accessibility element:

- `Text`, `TextInput`, `Switch` are by default
- `View` needs `accessible={true}` (or use `Pressable`/`TouchableOpacity`)

## API Reference

See [references/api-reference.md](references/api-reference.md) for complete API signatures and options for render, screen, queries, userEvent, fireEvent, Jest matchers, waitFor, renderHook, configuration, and accessibility helpers.

## Anti-Patterns Reference

See [references/anti-patterns.md](references/anti-patterns.md) for detailed examples of what NOT to do.

## waitFor

```tsx
// Correct: action first, then wait for result
fireEvent.press(button);
await waitFor(() => {
  expect(screen.getByText('Result')).toBeOnTheScreen();
});

// Better: use findBy* instead
fireEvent.press(button);
expect(await screen.findByText('Result')).toBeOnTheScreen();
```

Options: `waitFor(cb, { timeout: 1000, interval: 50 })`. Works with Jest fake timers automatically.

## Fake Timers

Recommended with `userEvent` (press/longPress involve real durations):

```tsx
jest.useFakeTimers();

test('with fake timers', async () => {
  const user = userEvent.setup();
  render(<Component />);
  await user.press(screen.getByRole('button'));
  // ...
});
```

## Custom Render

Wrap providers using `wrapper` option:

```tsx
function renderWithProviders(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    ),
  });
}
```
