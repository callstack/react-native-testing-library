import { renderAsync, screen } from '@testing-library/react-native';

test('uses screen methods', async () => {
  await renderAsync(<MyComponent />);
  await screen.rerenderAsync(<UpdatedComponent />);
  await screen.rerenderAsync(<AnotherComponent />);
  await screen.unmountAsync();
});
