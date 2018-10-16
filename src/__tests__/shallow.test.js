// @flow
import React from 'react';
import { View, Text } from 'react-native';
import { shallow, render } from '..';

const OnPressComponent = ({ onPress }) => (
  <View>
    <Text onPress={onPress} testID="text-button">
      Press me
    </Text>
  </View>
);

test('shallow rendering React elements', () => {
  const { output } = shallow(<OnPressComponent onPress={jest.fn} />);

  expect(output).toMatchSnapshot();
});

test('shallow rendering React Test Instance', () => {
  const { getByTestId } = render(<OnPressComponent onPress={jest.fn} />);
  const { output } = shallow(getByTestId('text-button'));

  expect(output).toMatchSnapshot();
});
