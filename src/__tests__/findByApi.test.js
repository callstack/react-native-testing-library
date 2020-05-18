// @flow
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render } from '..';

test('findBy queries work asynchronously', async () => {
  const options = { timeout: 10 }; // Short timeout so that this test runs quickly
  const {
    rerender,
    findByTestId,
    findAllByTestId,
    findByText,
    findAllByText,
    findByPlaceholder,
    findAllByPlaceholder,
    findByDisplayValue,
    findAllByDisplayValue,
  } = render(<View />);
  await expect(findByTestId('aTestId', options)).rejects.toBeTruthy();
  await expect(findAllByTestId('aTestId', options)).rejects.toBeTruthy();
  await expect(findByText('Some Text', options)).rejects.toBeTruthy();
  await expect(findAllByText('Some Text', options)).rejects.toBeTruthy();
  await expect(
    findByPlaceholder('Placeholder Text', options)
  ).rejects.toBeTruthy();
  await expect(
    findAllByPlaceholder('Placeholder Text', options)
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

  await expect(findByTestId('aTestId')).resolves.toBeTruthy();
  await expect(findAllByTestId('aTestId')).resolves.toHaveLength(1);
  await expect(findByText('Some Text')).resolves.toBeTruthy();
  await expect(findAllByText('Some Text')).resolves.toHaveLength(1);
  await expect(findByPlaceholder('Placeholder Text')).resolves.toBeTruthy();
  await expect(findAllByPlaceholder('Placeholder Text')).resolves.toHaveLength(
    1
  );
  await expect(findByDisplayValue('Display Value')).resolves.toBeTruthy();
  await expect(findAllByDisplayValue('Display Value')).resolves.toHaveLength(1);
}, 20000);
