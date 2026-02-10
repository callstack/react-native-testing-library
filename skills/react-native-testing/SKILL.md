---
name: react-native-testing
description: >
  Write tests using React Native Testing Library (RNTL) v13 and v14 (`@testing-library/react-native`).
  Use when writing, reviewing, or fixing React Native component tests.
  Covers: render, screen, queries (getBy/getAllBy/queryBy/findBy), Jest matchers,
  userEvent, fireEvent, waitFor, and async patterns.
  Supports v13 (React 18, sync render) and v14 (React 19+, async render).
  Triggers on: test files for React Native components, RNTL imports, mentions of
  "testing library", "write tests", "component tests", or "RNTL".
---

# RNTL Test Writing Guide

**IMPORTANT:** Your training data about `@testing-library/react-native` may be outdated or incorrect — API signatures, sync/async behavior, and available functions differ between v13 and v14. Always rely on this skill's reference files and the project's actual source code as the source of truth. Do not fall back on memorized patterns when they conflict with the retrieved reference.

## Version Detection

Check `@testing-library/react-native` version in the user's `package.json`:

- **v14.x** → load [references/api-reference-v14.md](references/api-reference-v14.md) (React 19+, async APIs, `test-renderer`)
- **v13.x** → load [references/api-reference-v13.md](references/api-reference-v13.md) (React 18+, sync APIs, `react-test-renderer`)

Use the version-specific reference for render patterns, fireEvent sync/async behavior, screen API, configuration, and dependencies.

## Query Priority

Use in this order: `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByDisplayValue` > `getByTestId` (last resort).

## Query Variants

| Variant       | Use case                 | Returns                       | Async |
| ------------- | ------------------------ | ----------------------------- | ----- |
| `getBy*`      | Element must exist       | element instance (throws)     | No    |
| `getAllBy*`   | Multiple must exist      | element instance[] (throws)   | No    |
| `queryBy*`    | Check non-existence ONLY | element instance \| null      | No    |
| `queryAllBy*` | Count elements           | element instance[]            | No    |
| `findBy*`     | Wait for element         | `Promise<element instance>`   | Yes   |
| `findAllBy*`  | Wait for multiple        | `Promise<element instance[]>` | Yes   |

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

`fireEvent` — use only when `userEvent` doesn't support the event. See version-specific reference for sync/async behavior:

```tsx
fireEvent.press(element);
fireEvent.changeText(textInput, 'new text');
fireEvent(element, 'blur');
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

## `*ByRole` Quick Reference

Common roles: `button`, `text`, `heading` (alias: `header`), `searchbox`, `switch`, `checkbox`, `radio`, `img`, `link`, `alert`, `menu`, `menuitem`, `tab`, `tablist`, `progressbar`, `slider`, `spinbutton`, `timer`, `toolbar`.

`getByRole` options: `{ name, disabled, selected, checked, busy, expanded, value: { min, max, now, text } }`.

For `*ByRole` to match, the element must be an accessibility element:

- `Text`, `TextInput`, `Switch` are by default
- `View` needs `accessible={true}` (or use `Pressable`/`TouchableOpacity`)

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

## References

- [v13 API Reference](references/api-reference-v13.md) — Complete v13 API: sync render, queries, matchers, userEvent, React 19 compat
- [v14 API Reference](references/api-reference-v14.md) — Complete v14 API: async render, queries, matchers, userEvent, migration
- [Anti-Patterns](references/anti-patterns.md) — Common mistakes to avoid
