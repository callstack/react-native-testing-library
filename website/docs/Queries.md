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
In order to properly use `findBy` and `findAllBy` queries you need at least React >=16.9.0 (featuring async `act`) or React Native >=0.60 (which comes with React >=16.9.0).
:::

:::info
`findBy` and `findAllBy` queries accept optional `waitForOptions` object argument which can contain `timeout` and `interval` properies which have the same meaning as respective options for [`waitFor`](api#waitfor) function.
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

This method will join `<Text>` siblings to find matches, similarly to [how React Native handles these components](https://reactnative.dev/docs/text#containers). This will allow for querying for strings that will be visually rendered together, but may be semantically separate React components.

```jsx
import { render } from '@testing-library/react-native';

const { getByText } = render(<MyComponent />);
const element = getByText('banana');
```

### `ByPlaceholderText`

> getByPlaceholderText, getAllByPlaceholderText, queryByPlaceholderText, queryAllByPlaceholderText, findByPlaceholderText, findAllByPlaceholderText

Returns a `ReactTestInstance` for a `TextInput` with a matching placeholder – may be a string or regular expression.

```jsx
import { render } from '@testing-library/react-native';

const { getByPlaceholderText } = render(<MyComponent />);
const element = getByPlaceholderText('username');
```

### `ByDisplayValue`

> getByDisplayValue, getAllByDisplayValue, queryByDisplayValue, queryAllByDisplayValue, findByDisplayValue, findAllByDisplayValue

Returns a `ReactTestInstance` for a `TextInput` with a matching display value – may be a string or regular expression.

```jsx
import { render } from '@testing-library/react-native';

const { getByDisplayValue } = render(<MyComponent />);
const element = getByDisplayValue('username');
```

### `ByTestId`

> getByTestId, getAllByTestId, queryByTestId, queryAllByTestId, findByTestId, findAllByTestId

Returns a `ReactTestInstance` with matching `testID` prop. `testID` – may be a string or a regular expression.

```jsx
import { render } from '@testing-library/react-native';

const { getByTestId } = render(<MyComponent />);
const element = getByTestId('unique-id');
```

:::info
In the spirit of [the guiding principles](https://testing-library.com/docs/guiding-principles), it is recommended to use this only after the other queries don't work for your use case. Using `testID` attributes do not resemble how your software is used and should be avoided if possible. However, they are particularly useful for end-to-end testing on real devices, e.g. using Detox and it's an encouraged technique to use there. Learn more from the blog post ["Making your UI tests resilient to change"](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change).
:::

### `ByA11yLabel`, `ByAccessibilityLabel`, `ByLabelText`

> getByA11yLabel, getAllByA11yLabel, queryByA11yLabel, queryAllByA11yLabel, findByA11yLabel, findAllByA11yLabel
> getByAccessibilityLabel, getAllByAccessibilityLabel, queryByAccessibilityLabel, queryAllByAccessibilityLabel, findByAccessibilityLabel, findAllByAccessibilityLabel
> getByLabelText, getAllByLabelText, queryByLabelText, queryAllByLabelText, findByLabelText, findAllByLabelText

Returns a `ReactTestInstance` with matching `accessibilityLabel` prop.

```jsx
import { render } from '@testing-library/react-native';

const { getByLabelText } = render(<MyComponent />);
const element = getByLabelText('my-label');
```

### `ByA11yHint`, `ByAccessibilityHint`, `ByHintText`

> getByA11yHint, getAllByA11yHint, queryByA11yHint, queryAllByA11yHint, findByA11yHint, findAllByA11yHint
> getByAccessibilityHint, getAllByAccessibilityHint, queryByAccessibilityHint, queryAllByAccessibilityHint, findByAccessibilityHint, findAllByAccessibilityHint
> getByHintText, getAllByHintText, queryByHintText, queryAllByHintText, findByHintText, findAllByHintText

Returns a `ReactTestInstance` with matching `accessibilityHint` prop.

```jsx
import { render } from '@testing-library/react-native';

const { getByHintText } = render(<MyComponent />);
const element = getByHintText('Plays a song');
```

:::info
Please consult [Apple guidelines on how `accessibilityHint` should be used](https://developer.apple.com/documentation/objectivec/nsobject/1615093-accessibilityhint).
:::

### `ByA11yStates`, `ByAccessibilityStates`

> getByA11yStates, getAllByA11yStates, queryByA11yStates, queryAllByA11yStates
> getByAccessibilityStates, getAllByAccessibilityStates, queryByAccessibilityStates, queryAllByAccessibilityStates

Returns a `ReactTestInstance` with matching `accessibilityStates` prop.

```jsx
import { render } from '@testing-library/react-native';

const { getByA11yStates } = render(<MyComponent />);
const element = getByA11yStates(['checked']);
const element2 = getByA11yStates('checked');
```

### `ByA11yRole`, `ByAccessibilityRole`, `ByRole`

> getByA11yRole, getAllByA11yRole, queryByA11yRole, queryAllByA11yRole, findByA11yRole, findAllByA11yRole
> getByAccessibilityRole, getAllByAccessibilityRole, queryByAccessibilityRole, queryAllByAccessibilityRole, findByAccessibilityRole, findAllByAccessibilityRole
> getByRole, getAllByRole, queryByRole, queryAllByRole, findByRole, findAllByRole

Returns a `ReactTestInstance` with matching `accessibilityRole` prop.

```jsx
import { render } from '@testing-library/react-native';

const { getByA11yRole } = render(<MyComponent />);
const element = getByA11yRole('button');
```

### `ByA11yState`, `ByAccessibilityState`

> getByA11yState, getAllByA11yState, queryByA11yState, queryAllByA11yState, findByA11yState, findAllByA11yState
> getByAccessibilityState, getAllByAccessibilityState, queryByAccessibilityState, queryAllByAccessibilityState, findByAccessibilityState, findAllByAccessibilityState

Returns a `ReactTestInstance` with matching `accessibilityState` prop.

```jsx
import { render } from '@testing-library/react-native';

const { getByA11yState } = render(<Component />);
const element = getByA11yState({ disabled: true });
```

### `ByA11Value`, `ByAccessibilityValue`

> getByA11yValue, getAllByA11yValue, queryByA11yValue, queryAllByA11yValue, findByA11yValue, findAllByA11yValue
> getByAccessibilityValue, getAllByAccessibilityValue, queryByAccessibilityValue, queryAllByAccessibilityValue, findByAccessibilityValue, findAllByAccessibilityValue

Returns a `ReactTestInstance` with matching `accessibilityValue` prop.

```jsx
import { render } from '@testing-library/react-native';

const { getByA11yValue } = render(<Component />);
const element = getByA11yValue({ min: 40 });
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
