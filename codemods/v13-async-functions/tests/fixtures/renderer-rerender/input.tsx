import { render } from '@testing-library/react-native';

test('rerenders with renderer', () => {
  const renderer = render(<MyComponent />);
  renderer.rerender(<UpdatedComponent />);
  expect(renderer.getByText('Updated')).toBeOnTheScreen();
});
