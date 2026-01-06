import { render } from '@testing-library/react-native';

// Function declaration
async function renderWithProviders(component: React.ReactElement) {
  await render(component);
}

// Arrow function
const renderWithTheme = async (component: React.ReactElement) => {
  await render(component);
};

// Function expression
const renderCustom = async function(component: React.ReactElement) {
  await render(component);
};

test('uses custom render function declaration', async () => {
  await renderWithProviders(<Component />);
});

test('uses custom render arrow function', async () => {
  await renderWithTheme(<Component />);
});

test('uses custom render function expression', async () => {
  await renderCustom(<Component />);
});
