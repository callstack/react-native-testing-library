import { render, screen } from '@testing-library/react-native';

describe('MyComponent', () => {
  // Helper function inside describe block
  function setupComponent() {
    render(<MyComponent />);
  }

  test('renders component', () => {
    setupComponent();
    expect(screen.getByText('Hello')).toBeOnTheScreen();
  });

  test('renders with direct render call', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeOnTheScreen();
  });
});
