// @flow
import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render } from '..';

test('findBy queries work asynchronously', async () => {
  const options = { timeout: 10 }; // Short timeout so that this test runs quickly
  const {
    rerender,
    findByText,
    findAllByText,
    findByPlaceholderText,
    findAllByPlaceholderText,
    findByDisplayValue,
    findAllByDisplayValue,
  } = render(<View />);
  await expect(findByText('Some Text', options)).rejects.toBeTruthy();
  await expect(findAllByText('Some Text', options)).rejects.toBeTruthy();
  await expect(
    findByPlaceholderText('Placeholder Text', options)
  ).rejects.toBeTruthy();
  await expect(
    findAllByPlaceholderText('Placeholder Text', options)
  ).rejects.toBeTruthy();
  await expect(
    findByDisplayValue('Display Value', options)
  ).rejects.toBeTruthy();
  await expect(
    findAllByDisplayValue('Display Value', options)
  ).rejects.toBeTruthy();

  setTimeout(
    () =>
      rerender(
        <View testID="aTestId">
          <Text>Some Text</Text>
          <TextInput placeholder="Placeholder Text" />
          <TextInput value="Display Value" />
        </View>
      ),
    20
  );

  await expect(findByText('Some Text')).resolves.toBeTruthy();
  await expect(findAllByText('Some Text')).resolves.toHaveLength(1);
  await expect(findByPlaceholderText('Placeholder Text')).resolves.toBeTruthy();
  await expect(
    findAllByPlaceholderText('Placeholder Text')
  ).resolves.toHaveLength(1);
  await expect(findByDisplayValue('Display Value')).resolves.toBeTruthy();
  await expect(findAllByDisplayValue('Display Value')).resolves.toHaveLength(1);
}, 20000);
