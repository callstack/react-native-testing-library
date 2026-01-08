import * as React from 'react';
import { Text, View } from 'react-native';

import { render } from '../..';

it('finds elements by their accessibility hint with exact matching', async () => {
  const Component = () => (
    <View>
      <View accessible accessibilityHint="Double tap to submit the form" accessibilityRole="button">
        <Text>Submit</Text>
      </View>
      <View accessible accessibilityHint="Double tap to cancel" accessibilityRole="button">
        <Text>Cancel</Text>
      </View>
    </View>
  );

  const { getByHintText, queryByHintText } = await render(<Component />);

  // Users need to find elements by accessibility hint - this is critical
  // for testing accessibility where hints provide additional context to screen readers
  const submitButton = getByHintText('Double tap to submit the form', { exact: true });
  expect(submitButton).toBeOnTheScreen();
  expect(submitButton.props.accessibilityHint).toBe('Double tap to submit the form');

  // Test that exact matching prevents partial matches
  const notFound = queryByHintText('Double tap to submit', { exact: true });
  expect(notFound).toBeNull();
});
