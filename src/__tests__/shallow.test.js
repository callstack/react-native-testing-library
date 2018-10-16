// @flow
import React from 'react';
import { View, Text } from 'react-native';
import { shallow, render } from '..';

const TextPress = () => (
  <View>
    <Text testID="text-button">Press me</Text>
  </View>
);

test('shallow rendering React elements', () => {
  const { output } = shallow(<TextPress />);

  expect(output).toMatchSnapshot();
});

test('shallow rendering React Test Instance', () => {
  const { getByTestId } = render(<TextPress />);
  const { output } = shallow(getByTestId('text-button'));

  expect(output).toMatchSnapshot();
});
