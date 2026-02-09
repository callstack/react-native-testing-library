# LLM Guidelines for React Native Testing Library

Actionable guidelines for writing tests with React Native Testing Library (RNTL) v14.

## Core APIs

### render

```tsx
const result = await render(<Component />, options?);
```

| Option           | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `wrapper`        | React component to wrap the rendered component (e.g., providers) |
| `createNodeMock` | Function to create mock refs                                     |

| Return                | Description                                      |
| --------------------- | ------------------------------------------------ |
| `rerender(component)` | Re-render with a new component (async)           |
| `unmount()`           | Unmount the rendered component (async)           |
| `toJSON()`            | Get JSON representation for snapshots            |
| `debug(options?)`     | Print the component tree to console              |
| `container`           | Root host element of the rendered tree           |
| `root`                | First child host element (your component's root) |

### screen

**Prefer `screen`** over destructuring from `render()`. Provides all query methods after `render()` is called.

```tsx
await render(<Component />);
screen.getByRole('button'); // Access queries via screen
```

### renderHook

```tsx
const { result, rerender, unmount } = await renderHook(() => useMyHook(), options?);
```

| Option         | Description                                        |
| -------------- | -------------------------------------------------- |
| `initialProps` | Initial props passed to the hook                   |
| `wrapper`      | React component to wrap the hook (e.g., providers) |

| Return             | Description                           |
| ------------------ | ------------------------------------- |
| `result.current`   | Current return value of the hook      |
| `rerender(props?)` | Re-render hook with new props (async) |
| `unmount()`        | Unmount the hook (async)              |

## Query Selection

- **Prefer `getByRole`** as first choice for querying elements
- **Query priority**: `getByRole` → `getByLabelText` → `getByPlaceholderText` → `getByText` → `getByDisplayValue` → `getByTestId` (last resort)
- **Use `findBy*`** for elements that appear asynchronously (after API calls, timeouts, state updates)
- **Use `queryBy*` ONLY** for checking non-existence (with `.not.toBeOnTheScreen()`)
- **Never use `getBy*`** for non-existence checks
- **Avoid `container.queryAll()`** - use `screen` queries instead
- **Query by visible text**, not `testID` when text is available

## Assertions

- **Use RNTL matchers** - prefer semantic matchers over prop assertions
- **Combine queries with matchers**: `expect(screen.getByText('Hello')).toBeOnTheScreen()`
- **No redundant null checks** - `getBy*` already throws if not found

## Jest Matchers Reference

| Matcher                           | Description                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `toBeOnTheScreen()`               | Element is present in the element tree                                                      |
| `toBeVisible()`                   | Element is visible (checks style, `aria-hidden`, `accessibilityElementsHidden`, ancestors)  |
| `toBeEmptyElement()`              | Element has no children or text content                                                     |
| `toContainElement(element)`       | Element contains another element                                                            |
| `toBeEnabled()`                   | Element is not disabled (checks `aria-disabled`, `accessibilityState`, ancestors)           |
| `toBeDisabled()`                  | Element has `aria-disabled` or `accessibilityState={{ disabled: true }}` (checks ancestors) |
| `toBeBusy()`                      | Element has `aria-busy` or `accessibilityState={{ busy: true }}`                            |
| `toBeChecked()`                   | Element has `aria-checked` or `accessibilityState={{ checked: true }}`                      |
| `toBePartiallyChecked()`          | Element has `aria-checked="mixed"` or `accessibilityState={{ checked: 'mixed' }}`           |
| `toBeSelected()`                  | Element has `aria-selected` or `accessibilityState={{ selected: true }}`                    |
| `toBeExpanded()`                  | Element has `aria-expanded` or `accessibilityState={{ expanded: true }}`                    |
| `toBeCollapsed()`                 | Element has `aria-expanded={false}` or `accessibilityState={{ expanded: false }}`           |
| `toHaveTextContent(text)`         | Element has matching text content                                                           |
| `toHaveDisplayValue(value)`       | TextInput has matching display value                                                        |
| `toHaveAccessibleName(name?)`     | Element has matching `aria-label`, `accessibilityLabel`, or text content                    |
| `toHaveAccessibilityValue(value)` | Element has matching `aria-value*` or `accessibilityValue`                                  |
| `toHaveStyle(style)`              | Element has matching style                                                                  |
| `toHaveProp(name, value?)`        | Element has prop (use semantic matchers when possible)                                      |

## User Interactions

**Prefer `userEvent`** over `fireEvent` for realistic user interaction simulation. `userEvent` triggers the complete event sequence that real users would produce.

### userEvent (Preferred)

```tsx
const user = userEvent.setup();
```

| Method                               | Description                                                                         |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| `user.press(element)`                | Press an element (triggers `pressIn`, `pressOut`, `press`)                          |
| `user.longPress(element, options?)`  | Long press with optional `{ duration }`                                             |
| `user.type(element, text, options?)` | Type into TextInput (triggers `focus`, `keyPress`, `change`, `changeText` per char) |
| `user.clear(element)`                | Clear TextInput (select all + backspace)                                            |
| `user.paste(element, text)`          | Paste text into TextInput                                                           |
| `user.scrollTo(element, options)`    | Scroll a ScrollView with `{ y }` or `{ x }` offset                                  |

### fireEvent (Low-level)

Use only when `userEvent` doesn't support the event or when you need direct control.

| Method                                   | Description                                   |
| ---------------------------------------- | --------------------------------------------- |
| `fireEvent(element, eventName, ...data)` | Fire any event by name                        |
| `fireEvent.press(element)`               | Fire `onPress` only (no `pressIn`/`pressOut`) |
| `fireEvent.changeText(element, text)`    | Fire `onChangeText` directly                  |
| `fireEvent.scroll(element, eventData)`   | Fire `onScroll` with event data               |

## Async/Await (v14)

- **Always `await`**: `render()`, `fireEvent.*`, `renderHook()`, `userEvent.*`
- **Make test functions `async`**: `test('name', async () => { ... })`
- **Don't wrap in `act()`** - `render` and `fireEvent` handle it internally

## waitFor Usage

- **Use `findBy*`** instead of `waitFor` + `getBy*` when waiting for elements
- **Never perform side-effects** (like `fireEvent.press()`) inside `waitFor` callbacks
- **One assertion per `waitFor`** callback
- **Never pass empty callbacks** - always include a meaningful assertion
- **Place side-effects before `waitFor`** - perform actions, then wait for result

## Code Organization

- **Use `screen`** instead of destructuring from `render()`: `screen.getByText()` not `const { getByText } = render()`
- **Prefer `userEvent`** over `fireEvent` for realistic interactions
- **Don't use `cleanup()`** - handled automatically
- **Name wrappers descriptively**: `ThemeProvider` not `Wrapper`
- **Install ESLint plugin**: `eslint-plugin-testing-library`

## Quick Checklist

- ✅ Using `getByRole` as first choice?
- ✅ Using `await` for all async operations?
- ✅ Using `findBy*` for async elements (not `waitFor` + `getBy*`)?
- ✅ Using `queryBy*` only for non-existence?
- ✅ Using RNTL matchers (`toBeOnTheScreen()`, `toBeDisabled()`, etc.)?
- ✅ Using `screen` not destructuring from `render()`?
- ✅ Avoiding side-effects in `waitFor`?
- ✅ Using `userEvent` when appropriate?

## Example: Good Pattern

```tsx
import { render, screen } from '@testing-library/react-native';
import userEvent from '@testing-library/react-native';
import { Pressable, Text, TextInput, View } from 'react-native';

test('user can submit form', async () => {
  const user = userEvent.setup();

  const Component = () => {
    const [name, setName] = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);

    return (
      <View>
        <TextInput role="textbox" aria-label="Name" value={name} onChangeText={setName} />
        <Pressable role="button" aria-label="Submit" onPress={() => setSubmitted(true)}>
          <Text>Submit</Text>
        </Pressable>
        {submitted && <Text role="alert">Form submitted!</Text>}
      </View>
    );
  };

  await render(<Component />);

  // ✅ getByRole as first choice
  const input = screen.getByRole('textbox', { name: 'Name' });
  const button = screen.getByRole('button', { name: 'Submit' });

  // ✅ userEvent for realistic interactions
  await user.type(input, 'John Doe');
  await user.press(button);

  // ✅ findBy* for async elements
  const successMessage = await screen.findByRole('alert');

  // ✅ RNTL matchers
  expect(successMessage).toBeOnTheScreen();
  expect(successMessage).toHaveTextContent('Form submitted!');
});
```

## Example: Anti-Patterns

```tsx
// ❌ Missing await
test('bad', () => {
  render(<Component />);
  fireEvent.press(screen.getByText('Submit'));
});

// ❌ getBy* for non-existence
expect(screen.getByText('Error')).not.toBeOnTheScreen();

// ❌ waitFor + getBy* instead of findBy*
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeOnTheScreen();
});

// ❌ Side-effect in waitFor
await waitFor(async () => {
  await fireEvent.press(button);
  expect(screen.getByText('Result')).toBeOnTheScreen();
});

// ❌ accessibility* props instead of ARIA
<Pressable accessibilityRole="button" accessibilityLabel="Submit" />;

// ❌ Destructuring from render
const { getByText } = await render(<Component />);
```

By following these guidelines, your tests will be more maintainable, accessible, and reliable.
