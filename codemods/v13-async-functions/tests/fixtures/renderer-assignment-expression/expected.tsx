import { renderAsync } from '@testing-library/react-native';

test('uses assignment expression with render', async () => {
  let renderer;
  renderer = await renderAsync(<MyComponent />);
  await renderer.rerenderAsync(<UpdatedComponent />);
});
