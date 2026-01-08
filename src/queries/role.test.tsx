import * as React from 'react';
import { Text, View } from 'react-native';
import { render } from '..';

it('finds elements by role with name option using text fallback when accessible name is not set', async () => {
  const Component = () => (
    <View>
      <View accessible accessibilityRole="button">
        <Text>Submit Form</Text>
      </View>
    </View>
  );

  const { getByRole } = await render(<Component />);

  // When an element has a role but no accessible name, getByRole falls back
  // to searching by text content - this is critical for testing components
  // where accessible labels aren't explicitly set but text content identifies the element
  const button = getByRole('button', { name: 'Submit Form' });
  expect(button).toBeOnTheScreen();
  expect(button.props.accessibilityRole).toBe('button');
});
