import React from 'react';
import { Text, TextInput, View } from 'react-native';
import TestRenderer from 'react-test-renderer';
import { configureInternal, getConfig } from '../config';
import { getQueriesForElement } from '../within';

const defaultErrorMessage = `There seems to be an issue with your configuration that prevents the library from working correctly.
Please ensure that you have a version of react native compatible with the library`;

export function detectHostComponentNames(): void {
  if (getConfig().hostComponentNames) {
    return;
  }

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
      typeof textHostName !== 'string' ||
      typeof textInputHostName !== 'string'
    ) {
      throw new Error(defaultErrorMessage);
    }

    configureInternal({
      hostComponentNames: {
        text: textHostName,
        textInput: textInputHostName,
      },
    });
  } catch (error) {
    const errorMessage =
      error && typeof error === 'object' && 'message' in error
        ? error.message
        : null;

    throw new Error(`Trying to detect host component names triggered the following error:
    
${errorMessage}
    
${defaultErrorMessage}
`);
  }
}
