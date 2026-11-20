import * as React from 'react';
import { TextInput, View } from 'react-native';

import { render, screen } from '../../..';
import { formatDisabledTargets } from '../warnings';

test('formatDisabledTargets describes non-editable TextInputs', async () => {
  await render(
    <View>
      <TextInput testID="first" editable={false} />
      <TextInput testID="second" readOnly />
    </View>,
  );
  const first = screen.getByTestId('first');
  const second = screen.getByTestId('second');

  expect(formatDisabledTargets([first])).toBe('a non-editable TextInput');
  expect(formatDisabledTargets([first, second])).toBe('non-editable TextInputs');
});

test('formatDisabledTargets describes disabled elements', async () => {
  await render(
    <View>
      <View testID="first" aria-disabled />
      <TextInput testID="second" editable={false} />
    </View>,
  );
  const first = screen.getByTestId('first');
  const second = screen.getByTestId('second');

  expect(formatDisabledTargets([first])).toBe('a disabled element');
  expect(formatDisabledTargets([first, second])).toBe('disabled elements');
});
