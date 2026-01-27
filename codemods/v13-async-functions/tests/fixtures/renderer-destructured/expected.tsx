import { renderAsync } from '@testing-library/react-native';

test('uses destructured rerender and unmount from render', async () => {
  const { rerenderAsync, unmountAsync } = await renderAsync(<MyComponent />);
  await rerenderAsync(<UpdatedComponent />);
  await unmountAsync();
});
