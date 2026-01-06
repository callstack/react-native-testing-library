import { render } from '@testing-library/react-native';

function renderWithProviders(component: React.ReactElement) {
  render(component);
}

test('uses helper', () => {
  renderWithProviders(<Component />);
});
