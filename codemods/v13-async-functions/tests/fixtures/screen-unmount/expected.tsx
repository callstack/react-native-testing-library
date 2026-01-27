import { renderAsync, screen } from '@testing-library/react-native';

test('unmounts component', async () => {
  await renderAsync(<MyComponent />);
  await screen.unmountAsync();
  expect(screen.queryByText('Hello')).not.toBeOnTheScreen();
});
