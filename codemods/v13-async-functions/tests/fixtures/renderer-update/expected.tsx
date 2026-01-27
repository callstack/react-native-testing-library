import { renderAsync } from '@testing-library/react-native';

test('updates with renderer', async () => {
  const renderer = await renderAsync(<MyComponent />);
  await renderer.rerenderAsync(<UpdatedComponent />);
});
