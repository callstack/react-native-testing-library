import React from 'react';
import { Text, TextInput, View } from 'react-native';
import TestRenderer from 'react-test-renderer';
import { HostComponentNames } from '../config';
import { getQueriesForElement } from '../within';

export function detectHostComponentNames(): HostComponentNames {
  const renderer = TestRenderer.create(
    <View>
      <Text testID="text">Hello</Text>
      <TextInput testID="textInput" />
    </View>
  );
  const { getByTestId } = getQueriesForElement(renderer.root);

  return {
    text: getByTestId('text').type as string,
    textInput: getByTestId('textInput').type as string,
  };
}
