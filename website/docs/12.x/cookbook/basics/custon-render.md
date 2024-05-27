# Custom `render` function

RNTL exposes `render` function as primary entry point for tests. The idea behind custom `render` functions it add some common test initialization to it.

### Example

```tsx title=test-utils.ts
function renderWithProviders<T>(ui: React.ReactElement<T>) {
  const uiWithProviders = <ThemeProvider>{ui}</ThemeProvider>;

  render(uiWithProviders);
}
```

```tsx title=WelcomeScreen.test.tsx
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../test-utils';

test('WelcomeScreen renders correctly', () => {
  renderWithProviders(<WelcomeScreen />);
});
```
