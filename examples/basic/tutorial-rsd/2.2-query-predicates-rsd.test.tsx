import * as React from 'react';
import { html } from 'react-strict-dom';
import { render, screen } from '@testing-library/react-native';

test('query by semantic role: *ByRole (highly recommended)', () => {
  render(
    <html.div>
      <html.h1>Heading Text</html.h1>

      <html.button>Button 1</html.button>

      <html.p role="alert">Alert Text</html.p>

      <html.div role="menu">
        <html.span role="menuitem">Menu Item 1</html.span>
        <html.span role="menuitem">Menu Item 2</html.span>
      </html.div>
    </html.div>,
  );

  expect(screen.getByRole('heading', { name: 'Heading Text' })).toBeOnTheScreen();

  expect(screen.getByRole('button', { name: 'Button 1' })).toBeOnTheScreen();
  expect(screen.getByRole('alert', { name: 'Alert Text' })).toBeOnTheScreen();

  // TODO: RSD does not set accessible for role elements.
  // expect(screen.getByRole('menu')).toBeOnTheScreen();
  // expect(screen.getAllByRole('menuitem')).toHaveLength(2);
});

test('querying TextInput elements (recommended)', () => {
  render(
    <html.div>
      <html.input placeholder="Enter Text..." aria-label="Text Label" defaultValue="Hello" />
    </html.div>,
  );

  // Option 1: Query by a11y label
  expect(screen.getByLabelText('Text Label')).toHaveDisplayValue('Hello');

  // Option 2: Query by placeholder text
  expect(screen.getByPlaceholderText('Enter Text...')).toHaveDisplayValue('Hello');

  // Option 3: Query by display value
  expect(screen.getByDisplayValue('Hello')).toBeOnTheScreen();
});

test('other accessible queries (ok)', () => {
  render(
    <html.div>
      <html.span>Text content</html.span>
      <html.div aria-label="ARIA Label" />
    </html.div>,
  );

  expect(screen.getByText('Text content')).toBeOnTheScreen();
  expect(screen.getByLabelText('ARIA Label')).toBeOnTheScreen();
});

test('escape hatch: *ByTestId (use as a last resort)', () => {
  render(
    <html.div>
      <html.span data-testid="Text 1">Text 1</html.span>
    </html.div>,
  );

  expect(screen.getByTestId('Text 1')).toBeOnTheScreen();
});
