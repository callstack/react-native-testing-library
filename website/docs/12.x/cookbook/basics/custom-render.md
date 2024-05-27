# Custom `render` function

### Summary

RNTL exposes `render` function as primary entry point for tests. The idea is to define a specialized `render` function that will call RNTL's one, as well conduct some re-usable setup.

### Example

```tsx title=test-utils.ts
// ...

interface RenderWithProvidersProps {
  user?: User | null;
  theme?: Theme;
}

export function renderWithProviders<T>(
  ui: React.ReactElement<T>,
  options?: RenderWithProvidersProps
) {
  return render(
    <UserProvider.Provider value={options?.user ?? null}>
      <ThemeProvider.Provider value={options?.theme ?? 'light'}>{ui}</ThemeProvider.Provider>
    </UserProvider.Provider>
  );
}
```

```tsx title=WelcomeScreen.test.tsx
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../test-utils';
// ...

test('renders WelcomeScreen with user', () => {
  renderWithProviders(<WelcomeScreen />, { user: { name: 'Jar-Jar' } });
  expect(screen.getByText(/hello Jar-Jar/i)).toBeOnTheScreen();
});

test('renders WelcomeScreen without user', () => {
  renderWithProviders(<WelcomeScreen />, { user: null });
  expect(screen.getByText(/hello stranger/i)).toBeOnTheScreen();
});
```

Example [full source code](https://github.com/callstack/react-native-testing-library/tree/main/examples/cookbook/custom-render).

### Comments

- Function might accept additional parameters to allow for setting up different start conditions for a test
- You may declare one or more custom render function depending on the situation
