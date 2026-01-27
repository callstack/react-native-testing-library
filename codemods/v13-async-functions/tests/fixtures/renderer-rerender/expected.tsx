import { renderAsync } from '@testing-library/react-native';

test('rerenders with renderer', async () => {
  const renderer = await renderAsync(<MyComponent />);
  await renderer.rerenderAsync(<UpdatedComponent />);
  expect(renderer.getByText('Updated')).toBeOnTheScreen();
});
