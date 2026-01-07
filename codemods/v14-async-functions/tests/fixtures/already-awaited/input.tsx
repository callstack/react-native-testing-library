import { render } from '@testing-library/react-native';

test('already awaited', async () => {
  await render(<Component />);
});
