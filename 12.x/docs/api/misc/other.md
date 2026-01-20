# Other helpers

## `within`, `getQueriesForElement` \{#within}

```jsx
function within(element: ReactTestInstance): Queries {}

function getQueriesForElement(element: ReactTestInstance): Queries {}
```

`within` (also available as `getQueriesForElement` alias) performs [queries](/react-native-testing-library/12.x/docs/api/queries.md) scoped to given element.

:::note
Please note that additional `render` specific operations like `update`, `unmount`, `debug`, `toJSON` are _not_ included.
:::

```jsx
const detailsScreen = within(screen.getByA11yHint('Details Screen'));
expect(detailsScreen.getByText('Some Text')).toBeOnTheScreen();
expect(detailsScreen.getByDisplayValue('Some Value')).toBeOnTheScreen();
expect(detailsScreen.queryByLabelText('Some Label')).toBeOnTheScreen();
await expect(detailsScreen.findByA11yHint('Some Label')).resolves.toBeOnTheScreen();
```

Use cases for scoped queries include:

- queries scoped to a single item inside a FlatList containing many items
- queries scoped to a single screen in tests involving screen transitions (e.g. with react-navigation)

## `act`

Useful function to help testing components that use hooks API. By default any `render`, `update`, `fireEvent`, and `waitFor` calls are wrapped by this function, so there is no need to wrap it manually. This method is re-exported from [`react-test-renderer`](https://github.com/facebook/react/blob/main/packages/react-test-renderer/src/ReactTestRenderer.js#L567]).

Consult our [Understanding Act function](/react-native-testing-library/12.x/docs/advanced/understanding-act.md) document for more understanding of its intricacies.

## `cleanup`

```ts
const cleanup: () => void;
```

Unmounts React trees that were mounted with `render` and clears `screen` variable that holds latest `render` output.

:::info
Please note that this is done automatically if the testing framework you're using supports the `afterEach` global (like mocha, Jest, and Jasmine). If not, you will need to do manual cleanups after each test.
:::

For example, if you're using the `jest` testing framework, then you would need to use the `afterEach` hook like so:

```jsx
import { cleanup, render } from '@testing-library/react-native/pure';
import { View } from 'react-native';

afterEach(cleanup);

it('renders a view', () => {
  render(<View />);
  // ...
});
```

The `afterEach(cleanup)` call also works in `describe` blocks:

```jsx
describe('when logged in', () => {
  afterEach(cleanup);

  it('renders the user', () => {
    render(<SiteHeader />);
    // ...
  });
});
```

Failing to call `cleanup` when you've called `render` could result in a memory leak and tests which are not "idempotent" (which can lead to difficult to debug errors in your tests).
