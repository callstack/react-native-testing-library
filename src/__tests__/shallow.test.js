// @flow
import React from 'react';
import { View, TouchableOpacity, Text } from '../__mocks__/reactNativeMock';
import { shallow, render } from '..';

const OnPressComponent = ({ onPress }) => (
  <View testID="root">
    <TouchableOpacity onPress={onPress} testID="button">
      <Text testID="text-button">Press me</Text>
    </TouchableOpacity>
  </View>
);

test('shallow rendering React elements', () => {
  const { output } = shallow(<OnPressComponent onPress={jest.fn} />);

  expect(output).toMatchSnapshot();
});

test('shallow rendering React Test Instance', () => {
  const { getByTestId } = render(<OnPressComponent onPress={jest.fn} />);
  const { output } = shallow(getByTestId('root'));

  expect(output).toMatchSnapshot();
});
