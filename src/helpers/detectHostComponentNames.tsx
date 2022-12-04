import React from 'react';
import { Text, TextInput, View } from 'react-native';
import TestRenderer from 'react-test-renderer';
import { HostComponentNames } from '../config';
import { getQueriesForElement } from '../within';

export function detectHostComponentNames():
  | HostComponentNames
  | { text: null; textInput: null } {
  try {
    const renderer = TestRenderer.create(
      <View>
        <Text testID="text">Hello</Text>
        <TextInput testID="textInput" />
      </View>
    );
    const { getByTestId } = getQueriesForElement(renderer.root);

    const textHostName = getByTestId('text').type;
    const textInputHostName = getByTestId('textInput').type;

    if (
      typeof textHostName === 'string' &&
      typeof textInputHostName === 'string'
    ) {
      return {
        text: textHostName,
        textInput: textInputHostName,
      };
    }

    return { text: null, textInput: null };
  } catch (error) {
    return { text: null, textInput: null };
  }
}
