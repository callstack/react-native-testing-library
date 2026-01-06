import { render } from '@testing-library/react-native';

test('renders with wrapper', () => {
  render(<Component />, { wrapper: Wrapper });
});
