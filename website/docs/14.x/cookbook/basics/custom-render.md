# Custom `render` function

### Summary

RNTL exposes the `render` function as the primary entry point for tests. If you make complex, repeating setups for your tests, consider creating a custom render function. The idea is to encapsulate common setup steps and test wiring inside a render function suitable for your tests.

### Example

```tsx title=test-utils.ts
// ...

interface RenderWithProvidersProps {
  user?: User | null;
  theme?: Theme;
}

export async function renderWithProviders<T>(
  ui: React.ReactElement<T>,
  options?: RenderWithProvidersProps
) {
  return await render(
    <UserProvider.Provider value={options?.user ?? null}>
      <ThemeProvider.Provider value={options?.theme ?? 'light'}>{ui}</ThemeProvider.Provider>
    </UserProvider.Provider>
  );
}
```

```tsx title=custom-render/index.test.tsx
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../test-utils';
// ...

test('renders WelcomeScreen with user', async () => {
  await renderWithProviders(<WelcomeScreen />, { user: { name: 'Jar-Jar' } });
  expect(screen.getByText(/hello Jar-Jar/i)).toBeOnTheScreen();
});

test('renders WelcomeScreen without user', async () => {
  await renderWithProviders(<WelcomeScreen />, { user: null });
  expect(screen.getByText(/hello stranger/i)).toBeOnTheScreen();
});
```

Example [full source code](https://github.com/callstack/react-native-testing-library/tree/main/examples/cookbook/custom-render).

### More info

#### Additional params

A custom render function might accept additional parameters to allow for setting up different start conditions for a test, e.g., the initial state for global state management.

```tsx title=SomeScreen.test.tsx
test('renders SomeScreen for logged in user', async () => {
  await renderScreen(<SomeScreen />, { state: loggedInState });
  // ...
});
```

#### Multiple functions

Depending on the situation, you may declare more than one custom render function. For example, you have one function for testing application flows and a second for testing individual screens.

```tsx title=test-utils.tsx
function renderNavigator(ui, options);
function renderScreen(ui, options);
```

#### Async setup

Since `render` is async, your custom render function should be marked as `async` and use `await render()`. This pattern also makes it easy to add additional async setup if needed:

```tsx title=SomeScreen.test.tsx
async function renderWithData<T>(ui: React.ReactElement<T>) {
  const data = await fetchTestData();
  return await render(<DataProvider value={data}>{ui}</DataProvider>);
}

test('renders SomeScreen', async () => {
  await renderWithData(<SomeScreen />);
  // ...
});
```
