import { render, screen } from '@testing-library/react-native';

test('unmounts component', async () => {
  await render(<MyComponent />);
  await screen.unmount();
  expect(screen.queryByText('Hello')).not.toBeOnTheScreen();
});
