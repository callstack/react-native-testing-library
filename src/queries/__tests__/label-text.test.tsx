import * as React from 'react';
import { Text, View } from 'react-native';

import { render } from '../..';

it('finds elements by their accessibility label', async () => {
  const Component = () => (
    <View>
      <View accessible accessibilityLabel="Submit button" accessibilityRole="button">
        <Text>Submit</Text>
      </View>
      <View accessible accessibilityLabel="Cancel button" accessibilityRole="button">
        <Text>Cancel</Text>
      </View>
    </View>
  );

  const { getByLabelText } = await render(<Component />);

  // Users need to find elements by accessibility label - this is critical
  // for testing accessibility where labels identify interactive elements
  const submitButton = getByLabelText('Submit button');
  expect(submitButton).toBeOnTheScreen();
  expect(submitButton.props.accessibilityLabel).toBe('Submit button');
  expect(submitButton.props.accessibilityRole).toBe('button');

  const cancelButton = getByLabelText('Cancel button');
  expect(cancelButton).toBeOnTheScreen();
  expect(cancelButton.props.accessibilityLabel).toBe('Cancel button');
});
