---
id: api-queries
title: Queries
---

import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc} />

## Query Variants

> `getBy*` queries are shown by default in the [query documentation](#queries)
> below.

### `getBy*` queries {#get-by}

`getBy*` queries return the first matching node for a query, and throw an error if no elements match or if more than one match is found. If you need to find more than one element, then use `getAllBy`.

### `getAllBy*` queries {#get-all-by}

`getAllBy*` queries return an array of all matching nodes for a query, and throw an error if no elements match.

### `queryBy*` queries {#query-by}

`queryBy*` queries return the first matching node for a query, and return `null` if no elements match. This is useful for asserting an element that is not present. This throws if more than one match is found (use `queryAllBy` instead).

### `queryAllBy*` queries {#query-all-by}

`queryAllBy*` queries return an array of all matching nodes for a query, and return an empty array (`[]`) when no elements match.

### `findBy*` queries {#find-by}

`findBy*` queries return a promise which resolves when a matching element is found. The promise is rejected if no elements match or if more than one match is found after a default timeout of 1000 ms. If you need to find more than one element, then use `findAllBy*`.

### `findAllBy*` queries {#find-all-by}

`findAllBy*` queries return a promise which resolves to an array of matching elements. The promise is rejected if no elements match after a default timeout of 1000 ms.

:::info
`findBy*` and `findAllBy*` queries accept optional `waitForOptions` object argument which can contain `timeout`, `interval` and `onTimeout` properies which have the same meaning as respective options for [`waitFor`](api#waitfor) function.
:::

:::info
In cases when your `findBy*` and `findAllBy*` queries throw when not able to find matching elements it is useful to pass `onTimeout: () => { screen.debug(); }` callback using `waitForOptions` parameter.
:::

:::info
In order to properly use `findBy*` and `findAllBy*` queries you need at least React >=16.9.0 (featuring async `act`) or React Native >=0.61 (which comes with React >=16.9.0).
:::

## Query Predicates

_Note: most methods like this one return a [`ReactTestInstance`](https://reactjs.org/docs/test-renderer.html#testinstance) with following properties that you may be interested in:_

```typescript
type ReactTestInstance = {
  type: string | Function;
  props: { [propName: string]: any };
  parent: ReactTestInstance | null;
  children: Array<ReactTestInstance | string>;
};
```

### `ByRole` {#by-role}

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
In order for `*ByRole` queries to match an element it needs to be considered an accessibility element:

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

#### Options {#by-role-options}

- `name`: Finds an element with given `role`/`accessibilityRole` and an accessible name (= accessability label or text content).

- `disabled`: You can filter elements by their disabled state (coming either from `aria-disabled` prop or `accessbilityState.disabled` prop). The possible values are `true` or `false`. Querying `disabled: false` will also match elements with `disabled: undefined` (see the [wiki](https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State) for more details).

  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `disabled` state.
  - This option can alternatively be expressed using the [`toBeEnabled()` / `toBeDisabled()`](jest-matchers#tobeenabled) Jest matchers.

- `selected`: You can filter elements by their selected state (coming either from `aria-selected` prop or `accessbilityState.selected` prop). The possible values are `true` or `false`. Querying `selected: false` will also match elements with `selected: undefined` (see the [wiki](https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State) for more details).

  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `selected` state.
  - This option can alternatively be expressed using the [`toBeSelected()`](jest-matchers#tobeselected) Jest matcher.

* `checked`: You can filter elements by their checked state (coming either from `aria-checked` prop or `accessbilityState.checked` prop). The possible values are `true`, `false`, or `"mixed"`.

  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `checked` state.
  - This option can alternatively be expressed using the [`toBeChecked()` / `toBePartiallyChecked()`](jest-matchers#tobechecked) Jest matchers.

* `busy`: You can filter elements by their busy state (coming either from `aria-busy` prop or `accessbilityState.busy` prop). The possible values are `true` or `false`. Querying `busy: false` will also match elements with `busy: undefined` (see the [wiki](https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State) for more details).

  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `busy` state.
  - This option can alternatively be expressed using the [`toBeBusy()`](jest-matchers#tobebusy) Jest matcher.

* `expanded`: You can filter elements by their expanded state (coming either from `aria-expanded` prop or `accessbilityState.expanded` prop). The possible values are `true` or `false`.

  - See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `expanded` state.
  - This option can alternatively be expressed using the [`toBeExpanded()` / `toBeCollapsed()`](jest-matchers#tobeexpanded) Jest matchers.

* `value`: Filter elements by their accessibility value, based on either `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` or `accessibilityValue` props. Accessiblity value conceptually consists of numeric `min`, `max` and `now` entries, as well as string `text` entry.

  - See React Native [accessibilityValue](https://reactnative.dev/docs/accessibility#accessibilityvalue) docs to learn more about the accessibility value concept.
  - This option can alternatively be expressed using the [`toHaveAccessibilityValue()`](jest-matchers#tohaveaccessibilityvalue) Jest matcher.

### `ByText` {#by-text}

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

Returns a `ReactTestInstance` with matching text – may be a string or regular expression.

This method will join `<Text>` siblings to find matches, similarly to [how React Native handles these components](https://reactnative.dev/docs/text#containers). This will allow for querying for strings that will be visually rendered together, but may be semantically separate React components.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByText('banana');
```

### `ByPlaceholderText` {#by-placeholder-text}

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

Returns a `ReactTestInstance` for a `TextInput` with a matching placeholder – may be a string or regular expression.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByPlaceholderText('username');
```

### `ByDisplayValue` {#by-display-value}

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

Returns a `ReactTestInstance` for a `TextInput` with a matching display value – may be a string or regular expression.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByDisplayValue('username');
```

### `ByTestId` {#by-test-id}

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

Returns a `ReactTestInstance` with matching `testID` prop. `testID` – may be a string or a regular expression.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByTestId('unique-id');
```

:::info
In the spirit of [the guiding principles](https://testing-library.com/docs/guiding-principles), it is recommended to use this only after the other queries don't work for your use case. Using `testID` attributes do not resemble how your software is used and should be avoided if possible. However, they are particularly useful for end-to-end testing on real devices, e.g. using Detox and it's an encouraged technique to use there. Learn more from the blog post ["Making your UI tests resilient to change"](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change).
:::

### `ByLabelText` {#by-label-text}

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
- or by matching text content of view referenced by [`aria-labelledby`](https://reactnative.dev/docs/accessibility#aria-labelledby-android)/[`accessibilityLabelledBy`](https://reactnative.dev/docs/accessibility#accessibilitylabelledby-android) prop

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByLabelText('my-label');
```

### `ByHintText`, `ByA11yHint`, `ByAccessibilityHint` {#by-hint-text}

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

### `ByA11yState`, `ByAccessibilityState` (deprecated) {#by-accessibility-state}

:::caution
This query has been marked deprecated, as is typically too general to give meaningful results. Therefore, it's better to use one of following options:

- [`*ByRole`](#by-role) query with relevant state options: `disabled`, `selected`, `checked`, `expanded` and `busy`
- use built-in Jest matchers to check the state of element found using some other query:
  - enabled state: [`toBeEnabled()` / `toBeDisabled()`](jest-matchers#tobeenabled)
  - checked state: [`toBeChecked()` / `toBePartiallyChecked()`](jest-matchers#tobechecked)
  - selected state: [`toBeSelected()`](jest-matchers#tobeselected)
  - expanded state: [`toBeExpanded()` / `toBeCollapsed()`](jest-matchers#tobeexpanded)
  - busy state: [`toBeBusy()`](jest-matchers#tobebusy)

:::

> getByA11yState, getAllByA11yState, queryByA11yState, queryAllByA11yState, findByA11yState, findAllByA11yState
> getByAccessibilityState, getAllByAccessibilityState, queryByAccessibilityState, queryAllByAccessibilityState, findByAccessibilityState, findAllByAccessibilityState

```ts
getByA11yState(
  state: {
    disabled?: boolean,
    selected?: boolean,
    checked?: boolean | 'mixed',
    busy?: boolean,
    expanded?: boolean,
  },
  options?: {
    includeHiddenElements?: boolean;
  },
): ReactTestInstance;
```

Returns a `ReactTestInstance` with matching `accessibilityState` prop or ARIA state props: `aria-disabled`, `aria-selected`, `aria-checked`, `aria-busy`, and `aria-expanded`.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<Component />);
const element = screen.getByA11yState({ disabled: true });
```

:::note

#### Default state for: `disabled`, `selected`, and `busy` keys

Passing `false` matcher value will match both elements with explicit `false` state value and without explicit state value.

For instance, `getByA11yState({ disabled: false })` will match elements with following props:

- `accessibilityState={{ disabled: false, ... }}`
- no `disabled` key under `accessibilityState` prop, e.g. `accessibilityState={{}}`
- no `accessibilityState` prop at all

#### Default state for: `checked` and `expanded` keys

Passing `false` matcher value will only match elements with explicit `false` state value.

For instance, `getByA11yState({ checked: false })` will only match elements with:

- `accessibilityState={{ checked: false, ... }}`

but will not match elements with following props:

- no `checked` key under `accessibilityState` prop, e.g. `accessibilityState={{}}`
- no `accessibilityState` prop at all

The difference in handling default values is made to reflect observed accessibility behaviour on iOS and Android platforms.
:::

### `ByA11yValue`, `ByAccessibilityValue` (deprecated) {#by-accessibility-value}

:::caution
This query has been marked deprecated, as is typically too general to give meaningful results. Therefore, it's better to use one of following options:

- [`toHaveAccessibilityValue()`](jest-matchers#tohaveaccessibilityvalue) Jest matcher to check the state of element found using some other query
- [`*ByRole`](#by-role) query with `value` option
  :::

> getByA11yValue, getAllByA11yValue, queryByA11yValue, queryAllByA11yValue, findByA11yValue, findAllByA11yValue
> getByAccessibilityValue, getAllByAccessibilityValue, queryByAccessibilityValue, queryAllByAccessibilityValue, findByAccessibilityValue, findAllByAccessibilityValue

```ts
getByA11yValue(
  value: {
    min?: number;
    max?: number;
    now?: number;
    text?: TextMatch;
  },
  options?: {
    includeHiddenElements?: boolean;
  },
): ReactTestInstance;
```

Returns a host element with matching accessibility value based on `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` & `accessibilityValue` props. Only value entires provided to the query will be used to match elements. Element might have additional accessibility value entries and still be matched.

When querying by `text` entry a string or regex might be used.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<View accessibilityValue={{ min: 0, max: 100, now: 25, text: '25%' }} />);
const element = screen.getByA11yValue({ now: 25 });
const element2 = screen.getByA11yValue({ text: /25/ });
```

### Common options

Usually query first argument can be a **string** or a **regex**. All queries take at least the [`hidden`](#hidden-option) option as an optionnal second argument and some queries accept more options which change string matching behaviour. See [TextMatch](#textmatch) for more info.

#### `includeHiddenElements` option

All queries have the `includeHiddenElements` option which affects whether [elements hidden from accessibility](./API.md#ishiddenfromaccessibility) are matched by the query. By default queries will not match hidden elements, because the users of the app would not be able to see such elements.

You can configure the default value with the [`configure` function](API.md#configure).

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

Most of the query APIs take a `TextMatch` as an argument, which means the argument can be either a _string_ or _regex_.

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

### Options {#text-match-options}

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

> Use sparingly and responsibly, escape hatches here

`render` from `@testing-library/react-native` exposes additional queries that **should not be used in component integration testing**, but some users (like component library creators) interested in unit testing some components may find helpful.

<details>
  <summary>Queries helpful in unit testing</summary>

The interface is the same as for other queries, but we won't provide full names so that they're harder to find by search engines.

### `UNSAFE_ByType`

> UNSAFE_getByType, UNSAFE_getAllByType, UNSAFE_queryByType, UNSAFE_queryAllByType

Returns a `ReactTestInstance` with matching a React component type.

:::caution
This query has been marked unsafe, since it requires knowledge about implementation details of the component. Use responsibly.
:::

### `UNSAFE_ByProps`

> UNSAFE_getByProps, UNSAFE_getAllByProps, UNSAFE_queryByProps, UNSAFE_queryAllByProps

Returns a `ReactTestInstance` with matching props object.

:::caution
This query has been marked unsafe, since it requires knowledge about implementation details of the component. Use responsibly.
:::

</details>
