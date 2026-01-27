import { renderAsync, screen } from '@testing-library/react-native';

test('updates component', async () => {
  await renderAsync(<MyComponent />);
  await screen.rerenderAsync(<UpdatedComponent />);
  expect(screen.getByText('Updated')).toBeOnTheScreen();
});
