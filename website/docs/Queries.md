---
id: api-queries
title: Queries
---

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
`findBy` and `findAllBy` queries accept optional `waitForOptions` object argument which can contain `timeout` and `interval` properies which have the same meaning as respective arguments to [`waitForElement`](https://callstack.github.io/react-native-testing-library/docs/api#waitforelement) function.
:::

## Queries

_Note: most methods like this one return a [`ReactTestInstance`](https://reactjs.org/docs/test-renderer.html#testinstance) with following properties that you may be interested in:_

```jsx
type ReactTestInstance = {
  type: string | Function,
  props: { [propName: string]: any },
  parent: null | ReactTestInstance,
  children: Array<ReactTestInstance | string>,
};
```

### `ByText`

> getByText, getAllByText, queryByText, queryAllByText, findByText, findAllByText

Returns a `ReactTestInstance` with matching text – may be a string or regular expression.

This method will join `<Text>` siblings to find matches, similarly to [how React Native handles these components](https://facebook.github.io/react-native/docs/text#containers). This will allow for querying for strings that will be visually rendered together, but may be semantically separate React components.

```jsx
import { render } from 'react-native-testing-library';

const { getByText } = render(<MyComponent />);
const element = getByText('banana');
```

### `ByPlaceholder`

> getByPlaceholder, getAllByPlaceholder, queryByPlaceholder, queryAllByPlaceholder, findByPlaceholder, findAllByPlaceholder

Returns a `ReactTestInstance` for a `TextInput` with a matching placeholder – may be a string or regular expression.

```jsx
import { render } from 'react-native-testing-library';

const { getByPlaceholder } = render(<MyComponent />);
const element = getByPlaceholder('username');
```

### `ByDisplayValue`

> getByDisplayValue, getAllByDisplayValue, queryByDisplayValue, queryAllByDisplayValue, findByDisplayValue, findAllByDisplayValue

Returns a `ReactTestInstance` for a `TextInput` with a matching display value – may be a string or regular expression.

```jsx
import { render } from 'react-native-testing-library';

const { getByDisplayValue } = render(<MyComponent />);
const element = getByDisplayValue('username');
```

### `ByTestId`

> getByTestId, getAllByTestId, queryByTestId, queryAllByTestId, findByTestId, findAllByTestId

Returns a `ReactTestInstance` with matching `testID` prop.

```jsx
import { render } from 'react-native-testing-library';

const { getByTestId } = render(<MyComponent />);
const element = getByTestId('unique-id');
```

:::caution
Please be mindful when using these API and **treat it as an escape hatch**. Your users can't interact with `testID` anyhow, so you may end up writing tests that provide false sense of security. Favor text and accessibility queries instead.
:::

### `ByA11yLabel`, `ByAccessibilityLabel`

> getByA11yLabel, getAllByA11yLabel, queryByA11yLabel, queryAllByA11yLabel, findByA11yLabel, findAllByA11yLabel
> getByAccessibilityLabel, getAllByAccessibilityLabel, queryByAccessibilityLabel, queryAllByAccessibilityLabel, findByAccessibilityLabel, findAllByAccessibilityLabel

Returns a `ReactTestInstance` with matching `accessibilityLabel` prop.

```jsx
import { render } from 'react-native-testing-library';

const { getByA11yLabel } = render(<MyComponent />);
const element = getByA11yLabel('my-label');
```

### `ByA11yHint`, `ByAccessibilityHint`

> getByA11yHint, getAllByA11yHint, queryByA11yHint, queryAllByA11yHint, findByA11yHint, findAllByA11yHint
> getByAccessibilityHint, getAllByAccessibilityHint, queryByAccessibilityHint, queryAllByAccessibilityHint, findByAccessibilityHint, findAllByAccessibilityHint

Returns a `ReactTestInstance` with matching `accessibilityHint` prop.

```jsx
import { render } from 'react-native-testing-library';

const { getByA11yHint } = render(<MyComponent />);
const element = getByA11yHint('my-hint');
```

### `ByA11yStates`, `ByAccessibilityStates`

> getByA11yStates, getAllByA11yStates, queryByA11yStates, queryAllByA11yStates
> getByAccessibilityStates, getAllByAccessibilityStates, queryByAccessibilityStates, queryAllByAccessibilityStates

Returns a `ReactTestInstance` with matching `accessibilityStates` prop.

```jsx
import { render } from 'react-native-testing-library';

const { getByA11yStates } = render(<MyComponent />);
const element = getByA11yStates(['checked']);
const element2 = getByA11yStates('checked');
```

### `ByA11yRole`, `ByAccessibilityRole`

> getByA11yRole, getAllByA11yRole, queryByA11yRole, queryAllByA11yRole, findByA11yRole, findAllByA11yRole
> getByAccessibilityRole, getAllByAccessibilityRole, queryByAccessibilityRole, queryAllByAccessibilityRole, findByAccessibilityRole, findAllByAccessibilityRole

Returns a `ReactTestInstance` with matching `accessibilityRole` prop.

```jsx
import { render } from 'react-native-testing-library';

const { getByA11yRole } = render(<MyComponent />);
const element = getByA11yRole('button');
```

### `ByA11yState`, `ByAccessibilityState`

> getByA11yState, getAllByA11yState, queryByA11yState, queryAllByA11yState, findByA11yState, findAllByA11yState
> getByAccessibilityState, getAllByAccessibilityState, queryByAccessibilityState, queryAllByAccessibilityState, findByAccessibilityState, findAllByAccessibilityState

Returns a `ReactTestInstance` with matching `accessibilityState` prop.

```jsx
import { render } from 'react-native-testing-library';

const { getByA11yState } = render(<Component />);
const element = getByA11yState({ disabled: true });
```

### `ByA11Value`, `ByAccessibilityValue`

> getByA11yValue, getAllByA11yValue, queryByA11yValue, queryAllByA11yValue, findByA11yValue, findAllByA11yValue
> getByAccessibilityValue, getAllByAccessibilityValue, queryByAccessibilityValue, queryAllByAccessibilityValue, findByAccessibilityValue, findAllByAccessibilityValue

Returns a `ReactTestInstance` with matching `accessibilityValue` prop.

```jsx
import { render } from 'react-native-testing-library';

const { getByA11yValue } = render(<Component />);
const element = getByA11yValue({ min: 40 });
```

## Unit testing helpers

> Use sparingly and responsibly, escape hatches here

`render` from `react-native-testing-library` exposes additional queries that **should not be used in component integration testing**, but some users (like component library creators) interested in unit testing some components may find helpful.

<details>
  <summary>Queries helpful in unit testing</summary>

The interface is the same as for other queries, but we won't provide full names so that they're harder to find by search engines.

### `UNSAFE_ByType`, `ByType`

> Note: added in v1.4

> This method has been **deprecated** and has been prepended with `UNSAFE_` prefix. In react-native-testing-library 2.x only the prefixed version will work.

A method returning a `ReactTestInstance` with matching a React component type. Throws when no matches.

### `UNSAFE_ByProps`, `ByProps`

> This method has been **deprecated** and has been prepended with `UNSAFE_` prefix. In react-native-testing-library 2.x only the prefixed version will work.

A method returning a `ReactTestInstance` with matching props object

### `ByName`

> This method has been **deprecated** because using it results in fragile tests that may break between minor React Native versions. **DON'T USE IT**. It will be removed in next major release (v2.0). Use the other alternatives, such as [`getByText`](#bytext) instead. It's listed here only for back-compat purposes for early adopters of the library
> A method returning a `ReactTestInstance` with matching a React component type. Throws when no matches.

</details>
