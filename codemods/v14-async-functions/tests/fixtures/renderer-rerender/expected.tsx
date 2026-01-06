import { render } from '@testing-library/react-native';

test('rerenders with renderer', async () => {
  const renderer = await render(<MyComponent />);
  await renderer.rerender(<UpdatedComponent />);
  expect(renderer.getByText('Updated')).toBeOnTheScreen();
});
