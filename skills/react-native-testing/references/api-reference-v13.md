# RNTL v13 API Reference

Complete API reference for `@testing-library/react-native` v13.x (React 18+).

**Test renderer:** `react-test-renderer`
**Element type:** `ReactTestInstance`

## Table of Contents

- Core Pattern
- render / renderAsync
- screen
- Queries
- User Event
- Fire Event / fireEventAsync
- Jest Matchers
- Async Utilities
- Other Helpers
- renderHook / renderHookAsync
- Configuration
- Accessibility
- React 19 Compatibility (v13.3+)
- Available Legacy APIs

---

## Core Pattern

```tsx
import { render, screen, userEvent } from '@testing-library/react-native';

jest.useFakeTimers(); // recommended when using userEvent

test('description', async () => {
  const user = userEvent.setup();
  render(<Component />); // sync in v13

  const button = screen.getByRole('button', { name: 'Submit' });
  await user.press(button);

  expect(screen.getByText('Done')).toBeOnTheScreen();
});
```

---

## render / renderAsync

```ts
function render(component: React.Element<any>, options?: RenderOptions): RenderResult;
```

`render` is **synchronous** in v13. Returns helpers and queries immediately.

### renderAsync (v13.3+)

```ts
async function renderAsync(
  component: React.Element<any>,
  options?: RenderAsyncOptions,
): Promise<RenderAsyncResult>;
```

Use `renderAsync` for React 19 or Suspense components. When using `renderAsync`, use `rerenderAsync` and `unmountAsync` instead of their sync counterparts.

### Options

| Option                                       | Type                                  | Description                                                   |
| -------------------------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| `wrapper`                                    | `React.ComponentType<any>`            | Wraps tested component (useful for context providers)         |
| `concurrentRoot`                             | `boolean`                             | Set `false` to disable concurrent rendering (default: `true`) |
| `createNodeMock`                             | `(element: React.Element) => unknown` | Custom mock refs for `ReactTestRenderer.create()`             |
| `unstable_validateStringsRenderedWithinText` | `boolean`                             | Experimental: replicate RN `Text` string validation           |

### Example

```tsx
import { render, screen } from '@testing-library/react-native';

render(<MyApp />);
expect(screen.getByRole('button', { name: 'start' })).toBeOnTheScreen();

// With wrapper
render(<MyComponent />, {
  wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
});

// Async (React 19 / Suspense)
await renderAsync(<SuspenseComponent />);
```

---

## screen

```ts
let screen: {
  ...queries;
  rerender(element: React.Element<unknown>): void;          // sync
  rerenderAsync(element: React.Element<unknown>): Promise<void>;  // v13.3+
  unmount(): void;                                            // sync
  unmountAsync(): Promise<void>;                              // v13.3+
  debug(options?: { message?: string; mapProps?: MapPropsFunction }): void;
  toJSON(): ReactTestRendererJSON | null;
  root: ReactTestInstance;        // root host element
  UNSAFE_root: ReactTestInstance; // root composite element (avoid)
};
```

The `screen` object provides queries and utilities for the currently rendered UI. Assigned after `render()`, cleared after each test via auto-cleanup.

### Methods

- **`rerender(element)`** — Re-render with new root element (sync). Triggers lifecycle events.
- **`rerenderAsync(element)`** — Async version for React 19 / Suspense (v13.3+).
- **`unmount()`** — Unmount the tree (sync). Usually not needed (auto-cleanup).
- **`unmountAsync()`** — Async version for React 19 / Suspense (v13.3+).
- **`debug({ message?, mapProps? })`** — Pretty-print the rendered tree. Use `mapProps` to filter/transform props in output.
- **`toJSON()`** — Get JSON representation (for snapshot testing).
- **`root`** — The rendered root host element (`ReactTestInstance`).
- **`UNSAFE_root`** — Root composite element. Avoid; use proper queries instead.

---

## Queries

Each query = **variant** + **predicate** (e.g., `getByRole` = `getBy` + `ByRole`).

### Query Variants

| Variant       | Assertion          | Return Type                                | Async |
| ------------- | ------------------ | ------------------------------------------ | ----- |
| `getBy*`      | Exactly one match  | `ReactTestInstance` (throws if 0 or >1)    | No    |
| `getAllBy*`   | At least one match | `ReactTestInstance[]` (throws if 0)        | No    |
| `queryBy*`    | Zero or one match  | `ReactTestInstance \| null` (throws if >1) | No    |
| `queryAllBy*` | No assertion       | `ReactTestInstance[]` (empty if 0)         | No    |
| `findBy*`     | Exactly one match  | `Promise<ReactTestInstance>`               | Yes   |
| `findAllBy*`  | At least one match | `Promise<ReactTestInstance[]>`             | Yes   |

`findBy*` / `findAllBy*` accept optional `waitForOptions: { timeout?, interval?, onTimeout? }`.

### Query Predicates

#### `*ByRole` (preferred)

```ts
getByRole(role: TextMatch, options?: {
  name?: TextMatch;
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean | 'mixed';
  busy?: boolean;
  expanded?: boolean;
  value?: { min?: number; max?: number; now?: number; text?: TextMatch };
  includeHiddenElements?: boolean;
}): ReactTestInstance;
```

Matches elements by `role` or `accessibilityRole`. Element must be an accessibility element:

- `Text`, `TextInput`, `Switch` are by default
- `View` needs `accessible={true}` (or use `Pressable`/`TouchableOpacity`)

Common roles: `button`, `text`, `heading` (alias: `header`), `searchbox`, `switch`, `checkbox`, `radio`, `img`, `link`, `alert`, `menu`, `menuitem`, `tab`, `tablist`, `progressbar`, `slider`, `spinbutton`, `timer`, `toolbar`.

```tsx
screen.getByRole('button', { name: 'Submit' });
screen.getByRole('button', { name: 'Submit', disabled: true });
screen.getByRole('checkbox', { checked: true });
screen.getByRole('slider', { value: { now: 50, min: 0, max: 100 } });
```

#### `*ByLabelText`

```ts
getByLabelText(text: TextMatch, options?: { exact?: boolean; normalizer?: Function; includeHiddenElements?: boolean }): ReactTestInstance;
```

Matches by `aria-label`/`accessibilityLabel` or text content of element referenced by `aria-labelledby`/`accessibilityLabelledBy`.

#### `*ByPlaceholderText`

```ts
getByPlaceholderText(text: TextMatch, options?: { exact?: boolean; normalizer?: Function; includeHiddenElements?: boolean }): ReactTestInstance;
```

Matches `TextInput` by `placeholder` prop.

#### `*ByText`

```ts
getByText(text: TextMatch, options?: { exact?: boolean; normalizer?: Function; includeHiddenElements?: boolean }): ReactTestInstance;
```

Matches by text content. Joins `<Text>` siblings to find matches (like RN runtime).

#### `*ByDisplayValue`

```ts
getByDisplayValue(value: TextMatch, options?: { exact?: boolean; normalizer?: Function; includeHiddenElements?: boolean }): ReactTestInstance;
```

Matches `TextInput` by current display value.

#### `*ByHintText`

```ts
getByHintText(hint: TextMatch, options?: { exact?: boolean; normalizer?: Function; includeHiddenElements?: boolean }): ReactTestInstance;
```

Matches by `accessibilityHint` prop. Also available as `getByA11yHint` / `getByAccessibilityHint`.

#### `*ByTestId` (last resort)

```ts
getByTestId(testId: TextMatch, options?: { exact?: boolean; normalizer?: Function; includeHiddenElements?: boolean }): ReactTestInstance;
```

Matches by `testID` prop. Use only when other queries don't work.

### TextMatch

```ts
type TextMatch = string | RegExp;
```

- **String**: exact full match by default. Use `{ exact: false }` for case-insensitive substring match.
- **RegExp**: substring match by default. Use anchors (`^...$`) for full match.

```tsx
screen.getByText('Hello World'); // exact full match
screen.getByText('llo Worl', { exact: false }); // substring, case-insensitive
screen.getByText(/World/); // regex substring
screen.getByText(/^hello world$/i); // regex full match, case-insensitive
```

### Common Query Options

- **`includeHiddenElements`** (alias: `hidden`): Include elements hidden from accessibility. Default: `false`.
- **`exact`**: Default `true`. When `false`, matches substrings case-insensitively. No effect on RegExp.
- **`normalizer`**: Custom text normalization function. Default trims whitespace and collapses multiple spaces. Use `getDefaultNormalizer({ trim?, collapseWhitespace? })` to customize.

---

## User Event

Prefer `userEvent` over `fireEvent`. User Event simulates realistic interaction sequences on **host elements only**, with proper event data.

### Setup

```ts
const user = userEvent.setup(options?: { delay?: number; advanceTimers?: (delay: number) => Promise<void> | void });
```

### `press(element)`

```ts
await user.press(element): Promise<void>;
```

Full press lifecycle: `pressIn` → `press` → `pressOut`. Minimum 130ms. Use fake timers to speed up.

### `longPress(element, options?)`

```ts
await user.longPress(element, { duration?: number }): Promise<void>;
```

Long press (default 500ms). Emits `pressIn`, `longPress`, `pressOut`.

### `type(element, text, options?)`

```ts
await user.type(textInput, text: string, options?: {
  skipPress?: boolean;    // skip pressIn/pressOut
  skipBlur?: boolean;     // skip endEditing/blur
  submitEditing?: boolean; // trigger submitEditing
}): Promise<void>;
```

Character-by-character typing on `TextInput`. Appends to existing text (use `clear()` first to replace).

Event sequence per character: `keyPress` → `change` → `changeText` → `selectionChange` (+ `contentSizeChange` for multiline).

### `clear(element)`

```ts
await user.clear(textInput): Promise<void>;
```

Clears `TextInput` content. Events: `focus` → `selectionChange` → `keyPress` → `change` → `changeText` → `selectionChange` → `endEditing` → `blur`.

### `paste(element, text)`

```ts
await user.paste(textInput, text: string): Promise<void>;
```

Pastes text into `TextInput`. Events: `focus` → `selectionChange` → `change` → `changeText` → `selectionChange` → `endEditing` → `blur`.

### `scrollTo(element, options)`

```ts
await user.scrollTo(scrollView, options: {
  y: number; momentumY?: number;   // vertical scroll
  // OR
  x: number; momentumX?: number;   // horizontal scroll
  contentSize?: { width: number; height: number };
  layoutMeasurement?: { width: number; height: number };
}): Promise<void>;
```

Scrolls a host `ScrollView` (including `FlatList`). Match scroll direction to `horizontal` prop. Pass `contentSize` and `layoutMeasurement` for `FlatList` updates. Remembers last scroll position between calls.

---

## Fire Event / fireEventAsync

Use when `userEvent` doesn't support the event or when triggering events on composite elements.

### fireEvent (sync)

```ts
function fireEvent(element: ReactTestInstance, eventName: string, ...data: unknown[]): void;
```

Traverses tree bottom-up looking for `onXxx` handler. Does **not** auto-pass event data.

#### Convenience Methods

```ts
fireEvent.press(element, ...data): void;
fireEvent.changeText(element, ...data): void;
fireEvent.scroll(element, ...data): void;
```

### fireEventAsync (v13.3+, for React 19 / Suspense)

```ts
async function fireEventAsync(element: ReactTestInstance, eventName: string, ...data: unknown[]): Promise<unknown>;
fireEventAsync.press(element, ...data): Promise<unknown>;
fireEventAsync.changeText(element, ...data): Promise<unknown>;
fireEventAsync.scroll(element, ...data): Promise<unknown>;
```

---

## Jest Matchers

Available automatically with any `@testing-library/react-native` import. No setup needed.

### Element Existence

| Matcher             | Description                             |
| ------------------- | --------------------------------------- |
| `toBeOnTheScreen()` | Element is attached to the element tree |

### Element Content

| Matcher               | Signature                                                     | Description                 |
| --------------------- | ------------------------------------------------------------- | --------------------------- |
| `toHaveTextContent()` | `(text: string \| RegExp, options?: { exact?, normalizer? })` | Text content match          |
| `toContainElement()`  | `(element: ReactTestInstance \| null)`                        | Contains child element      |
| `toBeEmptyElement()`  | —                                                             | No children or text content |

### Element State

| Matcher                                                 | Description                                           |
| ------------------------------------------------------- | ----------------------------------------------------- |
| `toHaveDisplayValue(value: string \| RegExp, options?)` | TextInput display value                               |
| `toHaveAccessibilityValue({ min?, max?, now?, text? })` | Accessibility value (partial match)                   |
| `toBeEnabled()` / `toBeDisabled()`                      | Disabled state via `aria-disabled` (checks ancestors) |
| `toBeSelected()`                                        | Selected state via `aria-selected`                    |
| `toBeChecked()` / `toBePartiallyChecked()`              | Checked state via `aria-checked`                      |
| `toBeExpanded()` / `toBeCollapsed()`                    | Expanded state via `aria-expanded`                    |
| `toBeBusy()`                                            | Busy state via `aria-busy`                            |

### Element Style

| Matcher                                | Description                                                     |
| -------------------------------------- | --------------------------------------------------------------- |
| `toBeVisible()`                        | Not hidden (`display: none`, `opacity: 0`, or hidden from a11y) |
| `toHaveStyle(style: StyleProp<Style>)` | Specific style match                                            |

### Other

| Matcher                  | Signature                                                      | Description                                                         |
| ------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------- |
| `toHaveAccessibleName()` | `(name?: string \| RegExp, options?: { exact?, normalizer? })` | Accessible name from `aria-label`/`aria-labelledby` or text content |
| `toHaveProp()`           | `(name: string, value?: unknown)`                              | Prop existence/value check (last resort)                            |

---

## Async Utilities

### `waitFor`

```ts
function waitFor<T>(
  expectation: () => T,
  options?: { timeout?: number; interval?: number },
): Promise<T>;
```

Runs `expectation` every `interval` (default 50ms) until `timeout` (default 1000ms). Callback must **throw** on failure. Auto-detects and works with Jest fake timers.

Rules:

- No side effects inside callback (no `fireEvent`/`userEvent`)
- One assertion per `waitFor`
- Never pass empty callback
- Prefer `findBy*` over `waitFor` + `getBy*`

### `waitForElementToBeRemoved`

```ts
function waitForElementToBeRemoved<T>(
  expectation: () => T,
  options?: { timeout?: number; interval?: number },
): Promise<T>;
```

Waits until the queried element is removed. Element must be initially present.

---

## Other Helpers

### `within` / `getQueriesForElement`

```ts
function within(element: ReactTestInstance): Queries;
```

Scoped queries on a subtree. Useful for querying within a single `FlatList` item or a specific screen.

```tsx
const item = within(screen.getByTestId('list-item-1'));
expect(item.getByText('Title')).toBeOnTheScreen();
```

### `act`

```ts
function act(callback: () => void): void;
function act(callback: () => Promise<void>): Promise<void>;
```

Re-exported from `react-test-renderer`. Usually not needed — `render`, `fireEvent`, `userEvent`, and `waitFor` handle it internally.

### `cleanup`

```ts
function cleanup(): void;
```

Unmounts rendered trees and clears `screen`. Automatic after each test (if test runner supports `afterEach`). Don't call manually unless using `@testing-library/react-native/pure`.

---

## renderHook / renderHookAsync

### renderHook (sync)

```ts
function renderHook<Result, Props>(
  hookFn: (props?: Props) => Result,
  options?: { initialProps?: Props; wrapper?: React.ComponentType; concurrentRoot?: boolean },
): { result: { current: Result }; rerender: (props: Props) => void; unmount: () => void };
```

### renderHookAsync (v13.3+)

```ts
async function renderHookAsync<Result, Props>(
  hookFn: (props?: Props) => Result,
  options?: { initialProps?: Props; wrapper?: React.ComponentType; concurrentRoot?: boolean },
): Promise<{
  result: { current: Result };
  rerenderAsync: (props: Props) => Promise<void>;
  unmountAsync: () => Promise<void>;
}>;
```

Renders a test component that calls the provided hook. Use `act()` when calling functions returned by the hook that trigger state updates.

```tsx
const { result } = renderHook(() => useCount());
expect(result.current.count).toBe(0);
act(() => {
  result.current.increment();
});
expect(result.current.count).toBe(1);

// With wrapper
renderHook(() => useHook(), {
  wrapper: ({ children }) => <Provider>{children}</Provider>,
});
```

---

## Configuration

```ts
function configure(
  options: Partial<{
    asyncUtilTimeout: number; // default timeout for waitFor/findBy* (default: 1000ms)
    defaultIncludeHiddenElements: boolean; // default for includeHiddenElements option (default: false)
    defaultDebugOptions: Partial<DebugOptions>;
    concurrentRoot: boolean; // default concurrent rendering (default: true)
  }>,
): void;

function resetToDefaults(): void;
```

### Environment Variables

| Variable                                 | Description                               |
| ---------------------------------------- | ----------------------------------------- |
| `RNTL_SKIP_AUTO_CLEANUP=true`            | Disable automatic cleanup after each test |
| `RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS=true` | Disable auto-detection of fake timers     |

---

## Accessibility

### `isHiddenFromAccessibility`

```ts
function isHiddenFromAccessibility(element: ReactTestInstance | null): boolean;
```

Also available as `isInaccessible()` alias.

Element is hidden when it or any ancestor has:

- `display: none` style
- `aria-hidden={true}`
- `accessibilityElementsHidden={true}` (iOS)
- `importantForAccessibility="no-hide-descendants"` (Android)
- Sibling with `aria-modal={true}` or `accessibilityViewIsModal={true}` (iOS)

---

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

---

## Available Legacy APIs

These are available in v13 but **deprecated**. Prefer standard alternatives:

- **`update(element)`** — Alias for `rerender`. Use `rerender()` instead.
- **`getQueriesForElement(element)`** — Alias for `within`. Use `within()` instead.
- **`UNSAFE_getByType`**, **`UNSAFE_getAllByType`**, **`UNSAFE_queryByType`**, **`UNSAFE_queryAllByType`** — Query by React component type. Use proper queries instead.
- **`UNSAFE_getByProps`**, **`UNSAFE_getAllByProps`**, **`UNSAFE_queryByProps`**, **`UNSAFE_queryAllByProps`** — Query by props. Use proper queries instead.
