import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render, within, getQueriesForElement } from '..';

test('within() exposes basic queries', async () => {
  const rootQueries = render(
    <View>
      <View accessibilityHint="first">
        <Text>Same Text</Text>
        <TextInput value="Same Value" placeholder="Same Placeholder" />
      </View>
      <View accessibilityHint="second">
        <Text>Same Text</Text>
        <TextInput value="Same Value" placeholder="Same Placeholder" />
      </View>
    </View>
  );

  expect(rootQueries.getAllByText('Same Text')).toHaveLength(2);
  expect(rootQueries.getAllByDisplayValue('Same Value')).toHaveLength(2);
  expect(rootQueries.getAllByPlaceholderText('Same Placeholder')).toHaveLength(
    2
  );

  const firstQueries = within(rootQueries.getByA11yHint('first'));
  expect(firstQueries.getAllByText('Same Text')).toHaveLength(1);
  expect(firstQueries.getByText('Same Text')).toBeTruthy();
  expect(firstQueries.queryAllByText('Same Text')).toHaveLength(1);
  expect(firstQueries.queryByText('Same Text')).toBeTruthy();
  expect(firstQueries.getByDisplayValue('Same Value')).toBeTruthy();
  expect(firstQueries.getByPlaceholderText('Same Placeholder')).toBeTruthy();
  await expect(
    firstQueries.findByDisplayValue('Same Value')
  ).resolves.toBeTruthy();
  await expect(
    firstQueries.findAllByPlaceholderText('Same Placeholder')
  ).resolves.toHaveLength(1);

  const secondQueries = within(rootQueries.getByA11yHint('second'));
  expect(secondQueries.getAllByText('Same Text')).toHaveLength(1);
  expect(secondQueries.getByText('Same Text')).toBeTruthy();
  expect(secondQueries.queryAllByText('Same Text')).toHaveLength(1);
  expect(secondQueries.queryByText('Same Text')).toBeTruthy();
  expect(secondQueries.getByDisplayValue('Same Value')).toBeTruthy();
  expect(secondQueries.getByPlaceholderText('Same Placeholder')).toBeTruthy();
});

test('within() exposes a11y queries', async () => {
  const rootQueries = render(
    <View>
      <View accessibilityHint="first">
        <TextInput
          value="Same Value"
          accessibilityLabel="Same Label"
          accessibilityHint="Same Hint"
        />
      </View>
      <View accessibilityHint="second">
        <TextInput
          value="Same Value"
          accessibilityLabel="Same Label"
          accessibilityHint="Same Hint"
        />
      </View>
    </View>
  );

  expect(rootQueries.getAllByLabelText('Same Label')).toHaveLength(2);
  expect(rootQueries.getAllByA11yHint('Same Hint')).toHaveLength(2);

  const firstQueries = within(rootQueries.getByA11yHint('first'));
  expect(firstQueries.getByLabelText('Same Label')).toBeTruthy();
  expect(firstQueries.getByA11yHint('Same Hint')).toBeTruthy();
  expect(firstQueries.queryByLabelText('Same Label')).toBeTruthy();
  expect(firstQueries.queryByA11yHint('Same Hint')).toBeTruthy();
  await expect(
    firstQueries.findByLabelText('Same Label')
  ).resolves.toBeTruthy();
  await expect(firstQueries.findByA11yHint('Same Hint')).resolves.toBeTruthy();

  const secondQueries = within(rootQueries.getByA11yHint('second'));
  expect(secondQueries.getAllByLabelText('Same Label')).toHaveLength(1);
  expect(secondQueries.getAllByA11yHint('Same Hint')).toHaveLength(1);
  expect(secondQueries.queryAllByLabelText('Same Label')).toHaveLength(1);
  expect(secondQueries.queryAllByA11yHint('Same Hint')).toHaveLength(1);
  await expect(
    secondQueries.findAllByLabelText('Same Label')
  ).resolves.toHaveLength(1);
  await expect(
    secondQueries.findAllByA11yHint('Same Hint')
  ).resolves.toHaveLength(1);
});

test('getQueriesForElement is alias to within', () => {
  expect(getQueriesForElement).toBe(within);
});
