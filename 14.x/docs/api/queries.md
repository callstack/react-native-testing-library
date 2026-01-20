# Queries

Queries are one of the main building blocks for the React Native Testing Library. They enable you to find relevant elements in the element tree, which represents your application's user interface when running under tests.

## Accessing queries

All queries described below are accessible in two main ways: through the `screen` object or by capturing the `render` function call result.

### Using `screen` object

```tsx
import { render, screen } from '@testing-library/react-native';

test('accessing queries using "screen" object', async () => {
  await render(...);

  screen.getByRole("button", { name: "Start" });
})
```

Use the `screen` object exported by `@testing-library/react-native` to access queries. This object contains all available query methods bound to the most recently rendered UI.

### Using `render` result

```tsx
import { render } from '@testing-library/react-native';

test('accessing queries using "render" result', async () => {
  const { getByRole } = await render(...);
  getByRole("button", { name: "Start" });
})
```

You can also capture query functions from the `render` function return value. This provides the same query functions as the `screen` object.

## Query parts

Each query is composed of two parts: variant and predicate, which are separated by the `by` word in the middle of the name.

Consider the following query:

```
getByRole()
```

For this query, `getBy*` is the query variant, and `*ByRole` is the predicate.

## Query variant

The query variants describe the expected number (and timing) of matching elements, so they differ in their return type.

| Variant                                                                              | Assertion                     | Return type                      | Is Async? |
| ------------------------------------------------------------------------------------ | ----------------------------- | -------------------------------- | --------- |
| [`getBy*`](/react-native-testing-library/14.x/docs/api/queries.md#get-by)            | Exactly one matching element  | `HostElement`                    | No        |
| [`getAllBy*`](/react-native-testing-library/14.x/docs/api/queries.md#get-all-by)     | At least one matching element | `Array<HostElement>`             | No        |
| [`queryBy*`](/react-native-testing-library/14.x/docs/api/queries.md#query-by)        | Zero or one matching element  | <code>HostElement \| null</code> | No        |
| [`queryAllBy*`](/react-native-testing-library/14.x/docs/api/queries.md#query-all-by) | No assertion                  | `Array<HostElement>`             | No        |
| [`findBy*`](/react-native-testing-library/14.x/docs/api/queries.md#find-by)          | Exactly one matching element  | `Promise<HostElement>`           | Yes       |
| [`findAllBy*`](/react-native-testing-library/14.x/docs/api/queries.md#find-all-by)   | At least one matching element | `Promise<Array<HostElement>>`    | Yes       |

Queries work as implicit assertions on the number of matching elements and will throw an error when the assertion fails.

### `getBy*` queries \{#get-by}

```ts
getByX(...): HostElement
```

`getBy*` queries return the single matching element for a query, and throw an error if no elements match or if more than one match is found. If you need to find more than one element, then use `getAllBy`.

### `getAllBy*` queries \{#get-all-by}

```ts
getAllByX(...): HostElement[]
```

`getAllBy*` queries return an array of all matching elements for a query and throw an error if no elements match.

### `queryBy*` queries \{#query-by}

```ts
queryByX(...): HostElement | null
```

`queryBy*` queries return the first matching node for a query, or `null` if no elements match. Use these to assert that an element is not present. They throw if more than one match is found (use `queryAllBy` instead).

### `queryAllBy*` queries \{#query-all-by}

```ts
queryAllByX(...): HostElement[]
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
): Promise<HostElement>
```

`findBy*` queries return a promise which resolves when a matching element is found. The promise is rejected if no elements match or if more than one match is found after a default timeout of 1000 ms. If you need to find more than one element use `findAllBy*` queries.

### `findAllBy*` queries \{#find-all-by}

```ts
findAllByX(
  ...,
  waitForOptions?: {
    timeout?: number,
    interval?: number,
  },
): Promise<HostElement[]>
```

`findAllBy*` queries return a promise which resolves to an array of matching elements. The promise is rejected if no elements match after a default timeout of 1000 ms.

:::info
`findBy*` and `findAllBy*` queries accept optional `waitForOptions` object arguments, which can contain `timeout`, `interval` and `onTimeout` properties which have the same meaning as respective options for [`waitFor`](/react-native-testing-library/14.x/docs/api/misc/async.md#waitfor) function.
:::

:::info
In cases when your `findBy*` and `findAllBy*` queries throw when unable to find matching elements, it is helpful to pass `onTimeout: () => { screen.debug(); }` callback using the `waitForOptions` parameter.
:::

## Query predicates

_Note: most methods like this one return a [`HostElement`](https://github.com/mdjastrzebski/test-renderer#hostelement) with following properties that you may be interested in:_

```typescript
type HostElement = {
  type: string;
  props: { [propName: string]: any };
  parent: HostElement | null;
  children: Array<HostElement | string>;
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
): HostElement;
```

Returns a `HostElement` with matching `role` or `accessibilityRole` prop.

:::info
In order for `*ByRole` queries to match an element it needs to be considered an accessibility element:

1. `Text`, `TextInput` and `Switch` elements are these by default.
2. `View` elements need an explicit [`accessible`](https://reactnative.dev/docs/accessibility#accessible) prop set to `true`
3. Some React Native composite components like `Pressable` & `TouchableOpacity` render host `View` element with `accessible` prop already set.

:::

```jsx
import { render, screen } from '@testing-library/react-native';

await render(
  <Pressable accessibilityRole="button" disabled>
    <Text>Hello</Text>
  </Pressable>
);
const element = screen.getByRole('button');
const element2 = screen.getByRole('button', { name: 'Hello' });
const element3 = screen.getByRole('button', { name: 'Hello', disabled: true });
```

#### Options \{#by-role-options}

- `name`: Finds an element with given `role`/`accessibilityRole` and an accessible name (= accessability label or text content).

- `disabled`: You can filter elements by their disabled state (coming either from `aria-disabled` prop or `accessbilityState.disabled` prop). The possible values are `true` or `false`. Querying `disabled: false` will also match elements with `disabled: undefined` (see the [wiki](https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State) for more details).
  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `disabled` state.
  - This option can alternatively be expressed using the [`toBeEnabled()` / `toBeDisabled()`](/react-native-testing-library/14.x/docs/api/jest-matchers.md#tobeenabled) Jest matchers.

- `selected`: You can filter elements by their selected state (coming either from `aria-selected` prop or `accessbilityState.selected` prop). The possible values are `true` or `false`. Querying `selected: false` will also match elements with `selected: undefined` (see the [wiki](https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State) for more details).
  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `selected` state.
  - This option can alternatively be expressed using the [`toBeSelected()`](/react-native-testing-library/14.x/docs/api/jest-matchers.md#tobeselected) Jest matcher.

- `checked`: You can filter elements by their checked state (coming either from `aria-checked` prop or `accessbilityState.checked` prop). The possible values are `true`, `false`, or `"mixed"`.
  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `checked` state.
  - This option can alternatively be expressed using the [`toBeChecked()` / `toBePartiallyChecked()`](/react-native-testing-library/14.x/docs/api/jest-matchers.md#tobechecked) Jest matchers.

- `busy`: You can filter elements by their busy state (coming either from `aria-busy` prop or `accessbilityState.busy` prop). The possible values are `true` or `false`. Querying `busy: false` will also match elements with `busy: undefined` (see the [wiki](https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State) for more details).
  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `busy` state.
  - This option can alternatively be expressed using the [`toBeBusy()`](/react-native-testing-library/14.x/docs/api/jest-matchers.md#tobebusy) Jest matcher.

- `expanded`: You can filter elements by their expanded state (coming either from `aria-expanded` prop or `accessbilityState.expanded` prop). The possible values are `true` or `false`.
  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `expanded` state.
  - This option can alternatively be expressed using the [`toBeExpanded()` / `toBeCollapsed()`](/react-native-testing-library/14.x/docs/api/jest-matchers.md#tobeexpanded) Jest matchers.

- `value`: Filter elements by their accessibility value, based on either `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` or `accessibilityValue` props. Accessiblity value conceptually consists of numeric `min`, `max` and `now` entries, as well as string `text` entry.
  - See React Native [accessibilityValue](https://reactnative.dev/docs/accessibility#accessibilityvalue) docs to learn more about the accessibility value concept.
  - This option can alternatively be expressed using the [`toHaveAccessibilityValue()`](/react-native-testing-library/14.x/docs/api/jest-matchers.md#tohaveaccessibilityvalue) Jest matcher.

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
): HostElement;
```

Returns a `HostElement` with matching label:

- either by matching [`aria-label`](https://reactnative.dev/docs/accessibility#aria-label)/[`accessibilityLabel`](https://reactnative.dev/docs/accessibility#accessibilitylabel) prop
- or by matching text content of view referenced by [`aria-labelledby`](https://reactnative.dev/docs/accessibility#aria-labelledby-android)/[`accessibilityLabelledBy`](https://reactnative.dev/docs/accessibility#accessibilitylabelledby-android) prop
- or by matching the [`alt`](https://reactnative.dev/docs/image#alt) prop on `Image` elements

```jsx
import { render, screen } from '@testing-library/react-native';

await render(<MyComponent />);
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
): HostElement;
```

Returns a `HostElement` for a `TextInput` with a matching placeholder – may be a string or regular expression.

```jsx
import { render, screen } from '@testing-library/react-native';

await render(<MyComponent />);
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
): HostElement;
```

Returns a `HostElement` for a `TextInput` with a matching display value – may be a string or regular expression.

```jsx
import { render, screen } from '@testing-library/react-native';

await render(<MyComponent />);
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
): HostElement;
```

Returns a `HostElement` with matching text – may be a string or regular expression.

This method will join `<Text>` siblings to find matches, similarly to [how React Native handles these components](https://reactnative.dev/docs/text#containers). This will allow for querying for strings that will be visually rendered together, but may be semantically separate React components.

```jsx
import { render, screen } from '@testing-library/react-native';

await render(<MyComponent />);
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
): HostElement;
```

Returns a `HostElement` with matching `accessibilityHint` prop.

```jsx
import { render, screen } from '@testing-library/react-native';

await render(<MyComponent />);
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
): HostElement;
```

Returns a `HostElement` with matching `testID` prop. `testID` – may be a string or a regular expression.

```jsx
import { render, screen } from '@testing-library/react-native';

await render(<MyComponent />);
const element = screen.getByTestId('unique-id');
```

:::info
Following [the guiding principles](https://testing-library.com/docs/guiding-principles), use this only when other queries don't work for your use case. `testID` attributes don't resemble how your software is used and should be avoided when possible. They're useful for end-to-end testing on real devices, e.g. with Detox. Learn more from the blog post ["Making your UI tests resilient to change"](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change).
:::

### Common options

Usually query first argument can be a **string** or a **regex**. All queries take at least the [`hidden`](#hidden-option) option as an optionnal second argument and some queries accept more options which change string matching behaviour. See [TextMatch](#textmatch) for more info.

#### `includeHiddenElements` option

All queries have the `includeHiddenElements` option which affects whether [elements hidden from accessibility](/react-native-testing-library/14.x/docs/api/misc/accessibility.md#ishiddenfromaccessibility) are matched by the query. By default queries will not match hidden elements, because the users of the app would not be able to see such elements.

You can configure the default value with the [`configure` function](/react-native-testing-library/14.x/docs/api/misc/config.md#configure).

This option is also available as `hidden` alias for compatibility with [React Testing Library](https://testing-library.com/docs/queries/byrole#hidden).

**Examples**

```tsx
await render(<Text style={{ display: 'none' }}>Hidden from accessibility</Text>);

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

Most of the query APIs take a `TextMatch` as an argument, which means the argument can be either a _string_ or _regex_.

### Examples

Given the following render:

```jsx
await render(<Text>Hello World</Text>);
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

Queries that take a `TextMatch` also accept an object as the second argument that can contain options that affect the precision of string matching:

- `exact`: Defaults to `true`; matches full strings, case-sensitive. When false, matches substrings and is not case-sensitive.
  - `exact` has no effect on regex argument.
  - In most cases using a `regex` instead of a string gives you more control over fuzzy matching and should be preferred over `{ exact: false }`.
- `normalizer`: An optional function which overrides normalization behavior. See [Normalization](#normalization).

`exact` option defaults to `true` but if you want to search for a text slice or make text matching case-insensitive you can override it. That being said we advise you to use regex in more complex scenarios.

#### Normalization

Before running any matching logic against text, it is automatically normalized. By default, normalization consists of trimming whitespace from the start and end of text, and collapsing multiple adjacent whitespace characters into a single space.

If you want to prevent that normalization, or provide alternative normalization (e.g. to remove Unicode control characters), you can provide a `normalizer` function in the options object. This function will be given a string and is expected to return a normalized version of that string.

:::info
Specifying a value for `normalizer` replaces the built-in normalization, but you can call `getDefaultNormalizer` to obtain a built-in normalizer, either to adjust that normalization or to call it from your own normalizer.
:::

`getDefaultNormalizer` take options object which allows the selection of behaviour:

- `trim`: Defaults to `true`. Trims leading and trailing whitespace.
- `collapseWhitespace`: Defaults to `true`. Collapses inner whitespace (newlines, tabs repeated spaces) into a single space.

##### Normalization Examples

To perform a match against text without trimming:

```typescript
screen.getByText('text', {
  normalizer: getDefaultNormalizer({ trim: false }),
});
```

To override normalization to remove some Unicode characters whilst keeping some (but not all) of the built-in normalization behavior:

```typescript
screen.getByText('text', {
  normalizer: (str) => getDefaultNormalizer({ trim: false })(str).replace(/[\u200E-\u200F]*/g, ''),
});
```
