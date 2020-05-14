// @flow
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render, within } from '..';

test('within() exposes basic queries', () => {
  const rootQueries = render(
    <View>
      <View testID="first">
        <Text>Same Text</Text>
        <TextInput value="Same Value" placeholder="Same Placeholder" />
      </View>
      <View testID="second">
        <Text>Same Text</Text>
        <TextInput value="Same Value" placeholder="Same Placeholder" />
      </View>
    </View>
  );

  expect(rootQueries.getAllByText('Same Text')).toHaveLength(2);
  expect(rootQueries.getAllByDisplayValue('Same Value')).toHaveLength(2);
  expect(rootQueries.getAllByPlaceholder('Same Placeholder')).toHaveLength(2);

  const firstQueries = within(rootQueries.getAllByTestId('first')[0]);
  expect(firstQueries.getAllByText('Same Text')).toHaveLength(1);
  expect(firstQueries.getByText('Same Text')).toBeTruthy();
  expect(firstQueries.queryAllByText('Same Text')).toHaveLength(1);
  expect(firstQueries.queryByText('Same Text')).toBeTruthy();
  expect(firstQueries.getByDisplayValue('Same Value')).toBeTruthy();
  expect(firstQueries.getByPlaceholder('Same Placeholder')).toBeTruthy();

  const secondQueries = within(rootQueries.getAllByTestId('second')[0]);
  expect(secondQueries.getAllByText('Same Text')).toHaveLength(1);
  expect(secondQueries.getByText('Same Text')).toBeTruthy();
  expect(secondQueries.queryAllByText('Same Text')).toHaveLength(1);
  expect(secondQueries.queryByText('Same Text')).toBeTruthy();
  expect(secondQueries.getByDisplayValue('Same Value')).toBeTruthy();
  expect(secondQueries.getByPlaceholder('Same Placeholder')).toBeTruthy();
});

test('within() exposes a11y queries', () => {
  const rootQueries = render(
    <View>
      <View testID="first">
        <TextInput
          value="Same Value"
          accessibilityLabel="Same Label"
          accessibilityHint="Same Hint"
        />
      </View>
      <View testID="second">
        <TextInput
          value="Same Value"
          accessibilityLabel="Same Label"
          accessibilityHint="Same Hint"
        />
      </View>
    </View>
  );

  expect(rootQueries.getAllByA11yLabel('Same Label')).toHaveLength(2);
  expect(rootQueries.getAllByA11yHint('Same Hint')).toHaveLength(2);

  const firstQueries = within(rootQueries.getAllByTestId('first')[0]);
  expect(firstQueries.getByA11yLabel('Same Label')).toBeTruthy();
  expect(firstQueries.getByA11yHint('Same Hint')).toBeTruthy();

  const secondQueries = within(rootQueries.getAllByTestId('second')[0]);
  expect(secondQueries.getAllByA11yLabel('Same Label')).toHaveLength(1);
  expect(secondQueries.getAllByA11yHint('Same Hint')).toHaveLength(1);
});
