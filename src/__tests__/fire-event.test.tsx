import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { fireEvent, render, screen } from '..';

it('invokes event handler when firing event on element', async () => {
  const onPressMock = jest.fn();
  await render(
    <TouchableOpacity onPress={onPressMock}>
      <Text>Press me</Text>
    </TouchableOpacity>,
  );

  await fireEvent.press(screen.getByText('Press me'));

  expect(onPressMock).toHaveBeenCalledTimes(1);
});
