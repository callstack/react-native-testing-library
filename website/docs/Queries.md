---
id: api-queries
title: Queries
---

### Table of contents:

- [Variants](#variants)
  - [getBy](#getby)
  - [getAllBy](#getallby)
  - [queryBy](#queryby)
  - [queryAllBy](#queryallby)
  - [findBy](#findby)
  - [findAllBy](#findallby)
- [Queries](#queries)
  - [Options](#options)
  - [`ByText`](#bytext)
  - [`ByPlaceholderText`](#byplaceholdertext)
  - [`ByDisplayValue`](#bydisplayvalue)
  - [`ByTestId`](#bytestid)
  - [`ByLabelText`](#bylabeltext)
  - [`ByHintText`, `ByA11yHint`, `ByAccessibilityHint`](#byhinttext-bya11yhint-byaccessibilityhint)
  - [`ByRole`](#byrole)
    - [Options](#options-1)
  - [`ByA11yState`, `ByAccessibilityState`](#bya11ystate-byaccessibilitystate)
  - [`ByA11Value`, `ByAccessibilityValue`](#bya11value-byaccessibilityvalue)
- [TextMatch](#textmatch)
  - [Examples](#examples)
  - [Precision](#precision)
  - [Normalization](#normalization)
    - [Normalization Examples](#normalization-examples)
- [Unit testing helpers](#unit-testing-helpers)
  - [`UNSAFE_ByType`](#unsafe_bytype)
  - [`UNSAFE_ByProps`](#unsafe_byprops)

## Variants

> `getBy` queries are shown by default in the [query documentation](#queries)
> below.

### getBy

`getBy*` queries return the first matching node for a query, and throw an error if no elements match or if more than one match is found (use `getAllBy` instead).

### getAllBy

`getAllBy*` queries return an array of all matching nodes for a query, and throw an error if no elements match.

### queryBy

`queryBy*` queries return the first matching node for a query, and return `null` if no elements match. This is useful for asserting an element that is not present. This throws if more than one match is found (use `queryAllBy` instead).

### queryAllBy

`queryAllBy*` queries return an array of all matching nodes for a query, and return an empty array (`[]`) if no elements match.

### findBy

`findBy` queries return a promise which resolves when a matching element is found. The promise is rejected if no elements match or if more than one match is found after a default timeout of 4500ms. If you need to find more than one element, then use `findAllBy`.

### findAllBy

`findAllBy` queries return a promise which resolves to an array when any matching elements are found. The promise is rejected if no elements match after a default timeout of 4500ms.

:::info
In order to properly use `findBy` and `findAllBy` queries you need at least React >=16.9.0 (featuring async `act`) or React Native >=0.61 (which comes with React >=16.9.0).
:::

:::info
`findBy` and `findAllBy` queries accept optional `waitForOptions` object argument which can contain `timeout` and `interval` properies which have the same meaning as respective options for [`waitFor`](api#waitfor) function.
:::

## Queries

_Note: most methods like this one return a [`ReactTestInstance`](https://reactjs.org/docs/test-renderer.html#testinstance) with following properties that you may be interested in:_

```typescript
type ReactTestInstance = {
  type: string | Function;
  props: { [propName: string]: any };
  parent: null | ReactTestInstance;
  children: Array<ReactTestInstance | string>;
};
```

### Options

Usually query first argument can be a **string** or a **regex**. Some queries accept optional argument which change string matching behaviour. See [TextMatch](#textmatch) for more info.

### `ByText`

> getByText, getAllByText, queryByText, queryAllByText, findByText, findAllByText

```ts
getByText(
  text: TextMatch,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
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

### `ByPlaceholderText`

> getByPlaceholderText, getAllByPlaceholderText, queryByPlaceholderText, queryAllByPlaceholderText, findByPlaceholderText, findAllByPlaceholderText

```ts
getByPlaceholderText(
  text: TextMatch,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
  }
): ReactTestInstance;
```

Returns a `ReactTestInstance` for a `TextInput` with a matching placeholder – may be a string or regular expression.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByPlaceholderText('username');
```

### `ByDisplayValue`

> getByDisplayValue, getAllByDisplayValue, queryByDisplayValue, queryAllByDisplayValue, findByDisplayValue, findAllByDisplayValue

```ts
getByDisplayValue(
  value: TextMatch,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
  }
): ReactTestInstance;
```

Returns a `ReactTestInstance` for a `TextInput` with a matching display value – may be a string or regular expression.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByDisplayValue('username');
```

### `ByTestId`

> getByTestId, getAllByTestId, queryByTestId, queryAllByTestId, findByTestId, findAllByTestId

```ts
getByTestId(
  testId: TextMatch,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
  }
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

### `ByLabelText`

> getByLabelText, getAllByLabelText, queryByLabelText, queryAllByLabelText, findByLabelText, findAllByLabelText

```ts
getByLabelText(
  text: TextMatch
): ReactTestInstance;
```

Returns a `ReactTestInstance` with matching `accessibilityLabel` prop.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByLabelText('my-label');
```

### `ByHintText`, `ByA11yHint`, `ByAccessibilityHint`

> getByA11yHint, getAllByA11yHint, queryByA11yHint, queryAllByA11yHint, findByA11yHint, findAllByA11yHint
> getByAccessibilityHint, getAllByAccessibilityHint, queryByAccessibilityHint, queryAllByAccessibilityHint, findByAccessibilityHint, findAllByAccessibilityHint
> getByHintText, getAllByHintText, queryByHintText, queryAllByHintText, findByHintText, findAllByHintText

```ts
getByHintText(
  hint: TextMatch
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

### `ByRole`

> getByRole, getAllByRole, queryByRole, queryAllByRole, findByRole, findAllByRole

```ts
getByRole(
  role: TextMatch,
  option?: {
    name?: TextMatch
  }
): ReactTestInstance;
```

Returns a `ReactTestInstance` with matching `accessibilityRole` prop.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<MyComponent />);
const element = screen.getByRole('button');
```

#### Options

`name`: Finds an element with given `accessibilityRole` and an accessible name (equivalent to `byText` or `byLabelText` query).

`disabled`: You can filter elements by their disabled state. The possible values are `true` or `false`. See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `disabled` state.

`selected`: You can filter elements by their selected state. The possible values are `true` or `false`. See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `selected` state.

`checked`: You can filter elements by their checked state. The possible values are `true`, `false`, or `"mixed"`. See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `checked` state.

`busy`: You can filter elements by their busy state. The possible values are `true` or `false`. See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `busy` state.

`expanded`: You can filter elements by their expanded state. The possible values are `true` or `false`. See [React Native's accessibilityState](https://reactnative.dev/docs/accessibility#accessibilitystate) docs to learn more about the `expanded` state.

### `ByA11yState`, `ByAccessibilityState`

> getByA11yState, getAllByA11yState, queryByA11yState, queryAllByA11yState, findByA11yState, findAllByA11yState
> getByAccessibilityState, getAllByAccessibilityState, queryByAccessibilityState, queryAllByAccessibilityState, findByAccessibilityState, findAllByAccessibilityState

```ts
getByA11yState(
  state: {
    disabled?: boolean,
    selected?: boolean,
    checked?: boolean | 'mixed',
    expanded?: boolean,
    busy?: boolean,
  }
): ReactTestInstance;
```

Returns a `ReactTestInstance` with matching `accessibilityState` prop.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<Component />);
const element = screen.getByA11yState({ disabled: true });
```

### `ByA11Value`, `ByAccessibilityValue`

> getByA11yValue, getAllByA11yValue, queryByA11yValue, queryAllByA11yValue, findByA11yValue, findAllByA11yValue
> getByAccessibilityValue, getAllByAccessibilityValue, queryByAccessibilityValue, queryAllByAccessibilityValue, findByAccessibilityValue, findAllByAccessibilityValue

```ts
getByA11yValue(
  value: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  }
): ReactTestInstance;
```

Returns a `ReactTestInstance` with matching `accessibilityValue` prop.

```jsx
import { render, screen } from '@testing-library/react-native';

render(<Component />);
const element = screen.getByA11yValue({ min: 40 });
```

## TextMatch

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

### Precision

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

### Normalization

Before running any matching logic against text, it is automatically normalized. By default, normalization consists of trimming whitespace from the start and end of text, and collapsing multiple adjacent whitespace characters into a single space.

If you want to prevent that normalization, or provide alternative normalization (e.g. to remove Unicode control characters), you can provide a `normalizer` function in the options object. This function will be given a string and is expected to return a normalized version of that string.

:::info
Specifying a value for `normalizer` replaces the built-in normalization, but you can call `getDefaultNormalizer` to obtain a built-in normalizer, either to adjust that normalization or to call it from your own normalizer.
:::

`getDefaultNormalizer` take options object which allows the selection of behaviour:

- `trim`: Defaults to `true`. Trims leading and trailing whitespace.
- `collapseWhitespace`: Defaults to `true`. Collapses inner whitespace (newlines, tabs repeated spaces) into a single space.

#### Normalization Examples

To perform a match against text without trimming:

```typescript
screen.getByText(node, 'text', {
  normalizer: getDefaultNormalizer({ trim: false }),
});
```

To override normalization to remove some Unicode characters whilst keeping some (but not all) of the built-in normalization behavior:

```typescript
screen.getByText(node, 'text', {
  normalizer: (str) =>
    getDefaultNormalizer({ trim: false })(str).replace(/[\u200E-\u200F]*/g, ''),
});
```

## Unit testing helpers

> Use sparingly and responsibly, escape hatches here

`render` from `@testing-library/react-native` exposes additional queries that **should not be used in component integration testing**, but some users (like component library creators) interested in unit testing some components may find helpful.

<details>
  <summary>Queries helpful in unit testing</summary>

The interface is the same as for other queries, but we won't provide full names so that they're harder to find by search engines.

### `UNSAFE_ByType`

> UNSAFE_getByType, UNSAFE_getAllByType, UNSAFE_queryByType, UNSAFE_queryAllByType

Returns a `ReactTestInstance` with matching a React component type.

:::caution
This method has been marked unsafe, since it requires knowledge about implementation details of the component. Use responsibly.
:::

### `UNSAFE_ByProps`

> UNSAFE_getByProps, UNSAFE_getAllByProps, UNSAFE_queryByProps, UNSAFE_queryAllByProps

Returns a `ReactTestInstance` with matching props object.

:::caution
This method has been marked unsafe, since it requires knowledge about implementation details of the component. Use responsibly.
:::

</details>
