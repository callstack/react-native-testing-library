import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { HostComponentNames } from '../config';
import render from '../render';

export function getReactNativeHostComponentNames(): HostComponentNames {
  const { getByTestId } = render(
    <View>
      <Text testID="text">Hello</Text>
      <TextInput testID="textInput" />
    </View>
  );

  return {
    text: getByTestId('text').type as string,
    textInput: getByTestId('textInput').type as string,
  };
}
