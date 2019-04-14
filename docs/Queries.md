---
id: api-queries
title: Queries
---

## Variants

> `getBy` queries are shown by default in the [query documentation](#queries)
> below.

### getBy

`getBy*` queries returns the first matching node for a query, and throws an
error if no elements match.

### getAllBy

`getAllBy*` queries return an array of all matching nodes for a query, and
throws an error if no elements match.

### queryBy

`queryBy*` queries returns the first matching node for a query, and return
`null` if no elements match. This is useful for asserting an element is not
present.

### queryAllBy

`queryAllBy*` queries return an array of all matching nodes for a query, and
return an empty array (`[]`) if no elements match.

<!-- uncomment once we have findBy apis
### findBy

`findBy*` queries return a promise which resolves when an element is found which
matches the given query. The promise is rejected if no element is found after a
default timeout of `4500`ms.

> Note, this is a simple combination of `getBy*` queries and
> [`waitForElement`](/docs/api-async#waitforelement). The `findBy*` queries
> accept the `waitForElement` options as the last argument. (i.e.
> `findByText(container, 'text', queryOptions, waitForElementOptions)`)

### findAllBy

`findAllBy*` queries return a promise which resolves to an array of elements
when any elements are found which match the given query. The promise is rejected
if no elements are found after a default timeout of `4500`ms.
-->

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

> getByText, getAllByText, queryByText, queryAllByText

Returns a `ReactTestInstance` with matching text – may be a string or regular expression.

This method will join `<Text>` siblings to find matches, similarly to [how React Native handles these components](https://facebook.github.io/react-native/docs/text#containers). This will allow for querying for strings that will be visually rendered together, but may be semantically separate React components.

```jsx
import { render } from 'react-native-testing-library';

const { getByText } = render(<MyComponent />);
const element = getByText('banana');
```

### `ByPlaceholder`

> getByPlaceholder, getAllByPlaceholder, queryByPlaceholder, queryAllByPlaceholder

Returns a `ReactTestInstance` for a `TextInput` with a matching placeholder – may be a string or regular expression.

```jsx
import { render } from 'react-native-testing-library';

const { getByPlaceholder } = render(<MyComponent />);
const element = getByPlaceholder('username');
```

### `ByTestId`

> getByTestId, queryByTestId, getAllByTestId, queryAllByTestId,

Returns a `ReactTestInstance` with matching `testID` prop.

```jsx
import { render } from 'react-native-testing-library';

const { getByTestId } = render(<MyComponent />);
const element = getByTestId('unique-id');
```

## Unit testing helpers

> Use sparingly and responsibly, escape hatches here

`render` from `react-native-testing-library` exposes additional queries that **should not be used in component integration testing**, but some users (like component library creators) interested in certain implemntation details for unit testing may find helpful.

<details>
  <summary>Queries helpful in unit testing</summary>

The interface is the same as for other queries, but we won't provide full names so that they're harder to find by search engines.

### `ByType`

> Note: added in v1.4

A method returning a `ReactTestInstance` with matching a React component type. Throws when no matches.

### `ByProps`

A method returning a `ReactTestInstance` with matching props object

### `ByName`

> This method has been **deprecated** because using it results in fragile tests that may break between minor React Native versions. **DON'T USE IT**. It will be removed in next major release (v2.0). Use [`getByTestId`](#bytestid) instead. It's listed here only for back-compat purposes for early adopters of the library

A method returning a `ReactTestInstance` with matching a React component type. Throws when no matches.

</details>
