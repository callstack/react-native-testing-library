# Queries

Queries are one of the main building blocks of React Native Testing Library. They let you find elements in the element tree, which represents your application's user interface when running under tests.

## Accessing queries

All queries described below are accessible in two main ways: through the `screen` object or by capturing the result of the `render` function call.

### Using `screen` object

```tsx
import { render, screen } from '@testing-library/react-native';

test('accessing queries using "screen" object', () => {
  render(...);

  screen.getByRole("button", { name: "Start" });
})
```

The recommended way to access queries is to use the `screen` object exported by `@testing-library/react-native`. It contains methods for all available queries bound to the most recently rendered UI.

### Using `render` result

```tsx
import { render } from '@testing-library/react-native';

test('accessing queries using "render" result', () => {
  const { getByRole } = render(...);
  getByRole("button", { name: "Start" });
})
```

The classic way is to capture query functions returned from the `render` function call. This provides access to the same functions as the `screen` object.

## Query parts

Each query is composed of two parts: variant and predicate, separated by the word `by` in the middle.

Consider the query `getByRole()`:

- `getBy*` is the query variant
- `*ByRole` is the predicate

## Query variant

The query variants describe the expected number (and timing) of matching elements, so they differ in return type.

| Variant                                                                         | Assertion                     | Return type                            | Is Async? |
| ------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------- | --------- |
| [`getBy*`](/react-native-testing-library/docs/api/queries.md#get-by)            | Exactly one matching element  | `ReactTestInstance`                    | No        |
| [`getAllBy*`](/react-native-testing-library/docs/api/queries.md#get-all-by)     | At least one matching element | `Array<ReactTestInstance>`             | No        |
| [`queryBy*`](/react-native-testing-library/docs/api/queries.md#query-by)        | Zero or one matching element  | <code>ReactTestInstance \| null</code> | No        |
| [`queryAllBy*`](/react-native-testing-library/docs/api/queries.md#query-all-by) | No assertion                  | `Array<ReactTestInstance>`             | No        |
| [`findBy*`](/react-native-testing-library/docs/api/queries.md#find-by)          | Exactly one matching element  | `Promise<ReactTestInstance>`           | Yes       |
| [`findAllBy*`](/react-native-testing-library/docs/api/queries.md#find-all-by)   | At least one matching element | `Promise<Array<ReactTestInstance>>`    | Yes       |

Queries work as implicit assertions on the number of matching elements and throw an error when the assertion fails.

### `getBy*` queries \{#get-by}

```ts
getByX(...): ReactTestInstance
```

`getBy*` queries return the single matching element for a query and throw an error if no elements match or if more than one match is found. If you need to find more than one element, use `getAllBy`.

### `getAllBy*` queries \{#get-all-by}

```ts
getAllByX(...): ReactTestInstance[]
```

`getAllBy*` queries return an array of all matching elements for a query and throw an error if no elements match.

### `queryBy*` queries \{#query-by}

```ts
queryByX(...): ReactTestInstance | null
```

`queryBy*` queries return the first matching node for a query and return `null` if no elements match. This is useful for asserting that an element is not present. This throws if more than one match is found (use `queryAllBy` instead).

### `queryAllBy*` queries \{#query-all-by}

```ts
queryAllByX(...): ReactTestInstance[]
```

`queryAllBy*` queries return an array of all matching nodes for a query and return an empty array (`[]`) when no elements match.

### `findBy*` queries \{#find-by}

```ts
findByX(
  ...,
  waitForOptions?: {
    timeout?: number,
    interval?: number,
  },
): Promise<ReactTestInstance>
```

`findBy*` queries return a promise that resolves when a matching element is found. The promise is rejected if no elements match or if more than one match is found after a default timeout of 1000 ms. If you need to find more than one element, use `findAllBy*` queries.

### `findAllBy*` queries \{#find-all-by}

```ts
findAllByX(
  ...,
  waitForOptions?: {
    timeout?: number,
    interval?: number,
  },
): Promise<ReactTestInstance[]>
```

`findAllBy*` queries return a promise that resolves to an array of matching elements. The promise is rejected if no elements match after a default timeout of 1000 ms.

:::info
`findBy*` and `findAllBy*` queries accept optional `waitForOptions` object arguments, which can contain `timeout`, `interval` and `onTimeout` properties which have the same meaning as respective options for [`waitFor`](/react-native-testing-library/docs/api/misc/async.md#waitfor) function.
:::

:::info
When your `findBy*` and `findAllBy*` queries throw because they can't find matching elements, it's helpful to pass `onTimeout: () => { screen.debug(); }` callback using the `waitForOptions` parameter.
:::

## Query predicates

_Note: most methods like this one return a [`ReactTestInstance`](https://reactjs.org/docs/test-renderer.html#testinstance) with the following properties that you may be interested in:_

```typescript
type ReactTestInstance = {
  type: string | Function;
  props: { [propName: string]: any };
  parent: ReactTestInstance | null;
  children: Array<ReactTestInstance | string>;
};
```

### `*ByRole` \{#by-role}

> getByRole, getAllByRole, queryByRole, queryAllByRole, findByRole, findAllByRole

```ts
getByRole(
  role: TextMatch,
  options?: {
    name?: TextMatch
    disabled?: boolean,
    selected?: boolean,
    checked?: boolean | 'mixed',
    busy?: boolean,
    expanded?: boolean,
    value: {
      min?: number;
      max?: number;
      now?: number;
      text?: TextMatch;
    },
    includeHiddenElements?: boolean;
  }
): ReactTestInstance;
```

Returns a `ReactTestInstance` with matching `role` or `accessibilityRole` prop.

:::info
For `*ByRole` queries to match an element, it needs to be considered an accessibility element:

1. `Text`, `TextInput` and `Switch` host elements are these by default.
2. `View` host elements need an explicit [`accessible`](https://reactnative.dev/docs/accessibility#accessible) prop set to `true`
3. Some React Native composite components like `Pressable` & `TouchableOpacity` render host `View` element with `accessible` prop already set.

:::

```jsx
import { render, screen } from '@testing-library/react-native';

render(
  <Pressable accessibilityRole="button" disabled>
    <Text>Hello</Text>
  </Pressable>
);
const element = screen.getByRole('button');
const element2 = screen.getByRole('button', { name: 'Hello' });
const element3 = screen.getByRole('button', { name: 'Hello', disabled: true });
```

#### Options \{#by-role-options}

- `name`: Finds an element with the given `role`/`accessibilityRole` and an accessible name (= accessibility label or text content).

- `disabled`: You can filter elements by their disabled state (coming either from `aria-disabled` prop or `accessibilityState.disabled` prop). The possible values are `true` or `false`. Querying `disabled: false` will also match elements with `disabled: undefined` (see the [wiki](https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State) for more details).
  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `disabled` state.
  - This option can alternatively be expressed using the [`toBeEnabled()` / `toBeDisabled()`](/react-native-testing-library/docs/api/jest-matchers.md#tobeenabled) Jest matchers.

- `selected`: You can filter elements by their selected state (coming either from `aria-selected` prop or `accessibilityState.selected` prop). The possible values are `true` or `false`. Querying `selected: false` will also match elements with `selected: undefined` (see the [wiki](https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State) for more details).
  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `selected` state.
  - This option can alternatively be expressed using the [`toBeSelected()`](/react-native-testing-library/docs/api/jest-matchers.md#tobeselected) Jest matcher.

- `checked`: You can filter elements by their checked state (coming either from `aria-checked` prop or `accessibilityState.checked` prop). The possible values are `true`, `false`, or `"mixed"`.
  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `checked` state.
  - This option can alternatively be expressed using the [`toBeChecked()` / `toBePartiallyChecked()`](/react-native-testing-library/docs/api/jest-matchers.md#tobechecked) Jest matchers.

- `busy`: You can filter elements by their busy state (coming either from `aria-busy` prop or `accessibilityState.busy` prop). The possible values are `true` or `false`. Querying `busy: false` will also match elements with `busy: undefined` (see the [wiki](https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State) for more details).
  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `busy` state.
  - This option can alternatively be expressed using the [`toBeBusy()`](/react-native-testing-library/docs/api/jest-matchers.md#tobebusy) Jest matcher.

- `expanded`: You can filter elements by their expanded state (coming either from `aria-expanded` prop or `accessibilityState.expanded` prop). The possible values are `true` or `false`.
  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `expanded` state.
  - This option can alternatively be expressed using the [`toBeExpanded()` / `toBeCollapsed()`](/react-native-testing-library/docs/api/jest-matchers.md#tobeexpanded) Jest matchers.

- `value`: Filter elements by their accessibility value, based on either `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`, or `accessibilityValue` props. Accessibility value conceptually consists of numeric `min`, `max`, and `now` entries, as well as string `text` entry.
  - See React Native [accessibilityValue](https://reactnative.dev/docs/accessibility#accessibilityvalue) docs to learn more about the accessibility value concept.
  - This option can alternatively be expressed using the [`toHaveAccessibilityValue()`](/react-native-testing-library/docs/api/jest-matchers.md#tohaveaccessibilityvalue) Jest matcher.

### `*ByLabelText` \{#by-label-text}

> getByLabelText, getAllByLabelText, queryByLabelText, queryAllByLabelText, findByLabelText, findAllByLabelText

```ts
getByLabelText(
  text: TextMatch,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
    includeHiddenElements?: boolean;
  },
): ReactTestInstance;
```

Returns a `ReactTestInstance` with matching label:

- either by matching [`aria-label`](https://reactnative.dev/docs/accessibility#aria-label)/[`accessibilityLabel`](https://reactnative.dev/docs/accessibility#accessibilitylabel) prop
- or by matching the text content of the view referenced by [`aria-labelledby`](https://reactnative.dev/docs/accessibility#aria-labelledby-android)/[`accessibilityLabelledBy`](https://reactnative.dev/docs/accessibility#accessibilitylabelledby-android) prop

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByLabelText('my-label');
```

### `*ByPlaceholderText` \{#by-placeholder-text}

> getByPlaceholderText, getAllByPlaceholderText, queryByPlaceholderText, queryAllByPlaceholderText, findByPlaceholderText, findAllByPlaceholderText

```ts
getByPlaceholderText(
  text: TextMatch,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
    includeHiddenElements?: boolean;
  }
): ReactTestInstance;
```

Returns a `ReactTestInstance` for a `TextInput` with a matching placeholder—may be a string or regular expression.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByPlaceholderText('username');
```

### `*ByDisplayValue` \{#by-display-value}

> getByDisplayValue, getAllByDisplayValue, queryByDisplayValue, queryAllByDisplayValue, findByDisplayValue, findAllByDisplayValue

```ts
getByDisplayValue(
  value: TextMatch,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
    includeHiddenElements?: boolean;
  },
): ReactTestInstance;
```

Returns a `ReactTestInstance` for a `TextInput` with a matching display value. The value can be a string or regular expression.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByDisplayValue('username');
```

### `*ByText` \{#by-text}

> getByText, getAllByText, queryByText, queryAllByText, findByText, findAllByText

```ts
getByText(
  text: TextMatch,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
    includeHiddenElements?: boolean;
  }
): ReactTestInstance;
```

Returns a `ReactTestInstance` with matching text. The text can be a string or regular expression.

This method joins `<Text>` siblings to find matches, similarly to [how React Native handles these components](https://reactnative.dev/docs/text#containers). This allows querying for strings that will be visually rendered together but may be semantically separate React components.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByText('banana');
```

### `*ByHintText` \{#by-hint-text}

> getByA11yHint, getAllByA11yHint, queryByA11yHint, queryAllByA11yHint, findByA11yHint, findAllByA11yHint
> getByAccessibilityHint, getAllByAccessibilityHint, queryByAccessibilityHint, queryAllByAccessibilityHint, findByAccessibilityHint, findAllByAccessibilityHint
> getByHintText, getAllByHintText, queryByHintText, queryAllByHintText, findByHintText, findAllByHintText

```ts
getByHintText(
  hint: TextMatch,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
    includeHiddenElements?: boolean;
  },
): ReactTestInstance;
```

Returns a `ReactTestInstance` with matching `accessibilityHint` prop.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByHintText('Plays a song');
```

:::info
Please consult [Apple guidelines on how `accessibilityHint` should be used](https://developer.apple.com/documentation/objectivec/nsobject/1615093-accessibilityhint).
:::

### `*ByTestId` \{#by-test-id}

> getByTestId, getAllByTestId, queryByTestId, queryAllByTestId, findByTestId, findAllByTestId

```ts
getByTestId(
  testId: TextMatch,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
    includeHiddenElements?: boolean;
  },
): ReactTestInstance;
```

Returns a `ReactTestInstance` with a matching `testID` prop. `testID` may be a string or a regular expression.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByTestId('unique-id');
```

:::info
In the spirit of [the guiding principles](https://testing-library.com/docs/guiding-principles), use this only after the other queries don't work for your use case. Using `testID` attributes doesn't resemble how your software is used and should be avoided if possible. However, they're particularly useful for end-to-end testing on real devices, e.g. using Detox, and it's an encouraged technique to use there. Learn more from the blog post ["Making your UI tests resilient to change"](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change).
:::

### Common options

Usually the query's first argument can be a **string** or a **regex**. All queries take at least the [`hidden`](#hidden-option) option as an optional second argument, and some queries accept more options that change string matching behavior. See [TextMatch](#textmatch) for more info.

#### `includeHiddenElements` option

All queries have the `includeHiddenElements` option which affects whether [elements hidden from accessibility](/react-native-testing-library/docs/api/misc/accessibility.md#ishiddenfromaccessibility) are matched by the query. By default, queries won't match hidden elements because users of the app wouldn't be able to see such elements.

You can configure the default value with the [`configure` function](/react-native-testing-library/docs/api/misc/config.md#configure).

This option is also available as `hidden` alias for compatibility with [React Testing Library](https://testing-library.com/docs/queries/byrole#hidden).

**Examples**

```tsx
render(<Text style={{ display: 'none' }}>Hidden from accessibility</Text>);

// Exclude hidden elements
expect(
  screen.queryByText('Hidden from accessibility', {
    includeHiddenElements: false,
  })
).not.toBeOnTheScreen();

// Include hidden elements
expect(screen.getByText('Hidden from accessibility')).toBeOnTheScreen();
expect(
  screen.getByText('Hidden from accessibility', { includeHiddenElements: true })
).toBeOnTheScreen();
```

## TextMatch type

```ts
type TextMatch = string | RegExp;
```

Most query APIs take a `TextMatch` as an argument, which means the argument can be either a _string_ or _regex_.

### Examples

Given the following render:

```jsx
render(<Text>Hello World</Text>);
```

Will **find a match**:

```js
// Matching a string:
screen.getByText('Hello World'); // full string match
screen.getByText('llo Worl', { exact: false }); // substring match
screen.getByText('hello world', { exact: false }); // ignore case-sensitivity

// Matching a regex:
screen.getByText(/World/); // substring match
screen.getByText(/world/i); // substring match, ignore case
screen.getByText(/^hello world$/i); // full string match, ignore case-sensitivity
screen.getByText(/Hello W?oRlD/i); // advanced regex
```

Will **NOT find a match**

```js
// substring does not match
screen.getByText('llo Worl');
// full string does not match
screen.getByText('Goodbye World');

// case-sensitive regex with different case
screen.getByText(/hello world/);
```

### Options \{#text-match-options}

#### Precision

```typescript
type TextMatchOptions = {
  exact?: boolean;
  normalizer?: (text: string) => string;
};
```

Queries that take a `TextMatch` also accept an object as the second argument that contains options affecting the precision of string matching:

- `exact`: Defaults to `true`; matches full strings, case-sensitive. When false, matches substrings and is not case-sensitive.
  - `exact` has no effect on regex argument.
  - In most cases using a `regex` instead of a string gives you more control over fuzzy matching and should be preferred over `{ exact: false }`.
- `normalizer`: An optional function which overrides normalization behavior. See [Normalization](#normalization).

The `exact` option defaults to `true`, but if you want to search for a text slice or make text matching case-insensitive, you can override it. That said, we advise you to use regex in more complex scenarios.

#### Normalization

Before running any matching logic against text, it's automatically normalized. By default, normalization consists of trimming whitespace from the start and end of text and collapsing multiple adjacent whitespace characters into a single space.

If you want to prevent that normalization or provide alternative normalization (e.g., to remove Unicode control characters), you can provide a `normalizer` function in the options object. This function is given a string and is expected to return a normalized version of that string.

:::info
Specifying a value for `normalizer` replaces the built-in normalization, but you can call `getDefaultNormalizer` to obtain a built-in normalizer, either to adjust that normalization or to call it from your own normalizer.
:::

`getDefaultNormalizer` takes an options object that allows selection of behavior:

- `trim`: Defaults to `true`. Trims leading and trailing whitespace.
- `collapseWhitespace`: Defaults to `true`. Collapses inner whitespace (newlines, tabs repeated spaces) into a single space.

##### Normalization Examples

To perform a match against text without trimming:

```typescript
screen.getByText(node, 'text', {
  normalizer: getDefaultNormalizer({ trim: false }),
});
```

To override normalization to remove some Unicode characters whilst keeping some (but not all) of the built-in normalization behavior:

```typescript
screen.getByText(node, 'text', {
  normalizer: (str) => getDefaultNormalizer({ trim: false })(str).replace(/[\u200E-\u200F]*/g, ''),
});
```

## Legacy unit testing helpers

`render` from `@testing-library/react-native` exposes additional queries that **should not be used in integration or component testing**, but some users (like component library creators) interested in unit testing some components may find helpful.

The interface is the same as for other queries, but we won't provide full names so they're harder to find via search engines.

### `UNSAFE_ByType`

> UNSAFE\_getByType, UNSAFE\_getAllByType, UNSAFE\_queryByType, UNSAFE\_queryAllByType

Returns a `ReactTestInstance` with a matching React component type.

:::caution
This query has been marked unsafe because it requires knowledge about implementation details of the component. Use responsibly.
:::

### `UNSAFE_ByProps`

> UNSAFE\_getByProps, UNSAFE\_getAllByProps, UNSAFE\_queryByProps, UNSAFE\_queryAllByProps

Returns a `ReactTestInstance` with matching props.

:::caution
This query has been marked unsafe because it requires knowledge about implementation details of the component. Use responsibly.
:::
