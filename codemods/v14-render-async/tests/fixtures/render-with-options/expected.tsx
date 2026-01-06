import { render } from '@testing-library/react-native';

test('renders with wrapper', async () => {
  await render(<Component />, { wrapper: Wrapper });
});
