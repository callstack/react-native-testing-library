import { render } from '@testing-library/react-native';

// Function declaration
function renderWithProviders(component: React.ReactElement) {
  render(component);
}

// Arrow function
const renderWithTheme = (component: React.ReactElement) => {
  render(component);
};

// Function expression
const renderCustom = function(component: React.ReactElement) {
  render(component);
};

test('uses custom render function declaration', () => {
  renderWithProviders(<Component />);
});

test('uses custom render arrow function', () => {
  renderWithTheme(<Component />);
});

test('uses custom render function expression', () => {
  renderCustom(<Component />);
});
