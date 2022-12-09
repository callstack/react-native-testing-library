import React from 'react';
import { Text, TextInput, View } from 'react-native';
import TestRenderer from 'react-test-renderer';
import { HostComponentNames } from '../config';
import { getQueriesForElement } from '../within';

const defaultErrorMessage =
  'There seems to be an issue with your configuration that prevents the library from working correctly. Please ensure that you have a version of react native compatible with the library';

export function detectHostComponentNames():
  | (HostComponentNames & { errorMessage?: never })
  | { errorMessage: string; text?: never; textInput?: never } {
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

    return { errorMessage: defaultErrorMessage };
  } catch (error) {
    const errorMessage =
      error && typeof error === 'object' && 'message' in error
        ? // @ts-expect-error ts doesnt correctly narrow the type of error
          error.message
        : null;

    return {
      errorMessage: `Trying to detect host component names triggered the following error:
    
${errorMessage}
    
${defaultErrorMessage}
`,
    };
  }
}
