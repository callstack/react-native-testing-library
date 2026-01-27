import { renderAsync } from '@testing-library/react-native';

test('unmounts with renderer', async () => {
  const renderer = await renderAsync(<MyComponent />);
  await renderer.unmountAsync();
});
