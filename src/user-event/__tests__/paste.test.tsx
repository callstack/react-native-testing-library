import * as React from 'react';
import { TextInput, View } from 'react-native';

import { render, screen, userEvent } from '../..';

it('pastes text into TextInput replacing existing content', async () => {
  const Component = () => {
    const [value, setValue] = React.useState('initial text');
    return (
      <View>
        <TextInput value={value} onChangeText={setValue} testID="input" />
      </View>
    );
  };

  await render(<Component />);

  const input = screen.getByTestId('input');
  expect(input).toHaveDisplayValue('initial text');

  const user = userEvent.setup();
  await user.paste(input, 'pasted text');

  expect(input).toHaveDisplayValue('pasted text');
});
