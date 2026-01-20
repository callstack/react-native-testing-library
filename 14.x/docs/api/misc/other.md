# Other helpers

## `within` \{#within}

```jsx
function within(element: HostElement): Queries {}
```

`within` performs [queries](/react-native-testing-library/14.x/docs/api/queries.md) scoped to given element.

:::note
Please note that additional `render` specific operations like `rerender`, `unmount`, `debug`, `toJSON` are _not_ included.
:::

```jsx
const detailsScreen = within(screen.getByHintText('Details Screen'));
expect(detailsScreen.getByText('Some Text')).toBeOnTheScreen();
expect(detailsScreen.getByDisplayValue('Some Value')).toBeOnTheScreen();
expect(detailsScreen.queryByLabelText('Some Label')).toBeOnTheScreen();
await expect(detailsScreen.findByHintText('Some Label')).resolves.toBeOnTheScreen();
```

Use cases for scoped queries include:

- queries scoped to a single item inside a FlatList containing many items
- queries scoped to a single screen in tests involving screen transitions (e.g. with react-navigation)

## `act`

```ts
function act<T>(callback: () => T | Promise<T>): Promise<T>;
```

Wraps code that causes React state updates to ensure all updates are processed before assertions. By default any `render`, `rerender`, `fireEvent`, and `waitFor` calls are wrapped by this function, so there is no need to wrap it manually.

**In v14, `act` is now async by default and always returns a Promise**. This works with async React features like `Suspense` boundaries and the `use()` hook. All pending React updates are executed before the Promise resolves.

```ts
import { act } from '@testing-library/react-native';

it('should update state', async () => {
  await act(() => {
    setState('new value');
  });
  expect(state).toBe('new value');
});
```

**Note**: Even if your callback is synchronous, you should still use `await act(...)` as `act` now always returns a Promise.

Consult our [Understanding Act function](/react-native-testing-library/14.x/docs/advanced/understanding-act.md) document for more understanding of its intricacies.

## `cleanup`

```ts
function cleanup(): Promise<void>;
```

Unmounts React trees that were mounted with `render` and clears `screen` variable that holds latest `render` output.

:::info
Please note that this is done automatically if the testing framework you're using supports the `afterEach` global (like mocha, Jest, and Jasmine). If not, you will need to do manual cleanups after each test.
:::

For example, if you're using the `jest` testing framework, then you would need to use the `afterEach` hook like so:

```jsx
import { cleanup, render } from '@testing-library/react-native/pure';
import { View } from 'react-native';

afterEach(async () => {
  await cleanup();
});

it('renders a view', async () => {
  await render(<View />);
  // ...
});
```

The `afterEach(cleanup)` call also works in `describe` blocks:

```jsx
describe('when logged in', () => {
  afterEach(async () => {
    await cleanup();
  });

  it('renders the user', async () => {
    await render(<SiteHeader />);
    // ...
  });
});
```

Failing to call `cleanup` when you've called `render` could result in a memory leak and tests which are not "idempotent" (which can lead to difficult to debug errors in your tests).
