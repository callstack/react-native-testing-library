import { renderAsync } from '@testing-library/react-native';

test('uses multiple methods on renderer', async () => {
  const renderer = await renderAsync(<MyComponent />);
  await renderer.rerenderAsync(<UpdatedComponent />);
  await renderer.rerenderAsync(<AnotherComponent />);
  await renderer.unmountAsync();
});
