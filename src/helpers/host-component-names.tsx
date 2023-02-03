import React from 'react';
import { Text, TextInput, View } from 'react-native';
import TestRenderer from 'react-test-renderer';
import type { ReactTestRenderer } from 'react-test-renderer';
import { configureInternal, getConfig, HostComponentNames } from '../config';
import { getQueriesForElement } from '../within';
const defaultErrorMessage = `There seems to be an issue with your configuration that prevents React Native Testing Library from working correctly.
Please check if you are using compatible versions of React Native and React Native Testing Library.`;

export function getHostComponentNames(): HostComponentNames {
  const configHostComponentNames = getConfig().hostComponentNames;
  if (configHostComponentNames) {
    return configHostComponentNames;
  }
  let renderer: ReactTestRenderer;

  try {
    renderer = TestRenderer.create(
      <View>
        <Text testID="text">Hello</Text>
        <TextInput testID="textInput" />
      </View>
    );

    const { getByTestId } = getQueriesForElement(renderer.root);
    const textHostName = getByTestId('text').type;
    const textInputHostName = getByTestId('textInput').type;

    // This code path should not happen as getByTestId always returns host elements.
    if (
      typeof textHostName !== 'string' ||
      typeof textInputHostName !== 'string'
    ) {
      throw new Error('getByTestId returned non-host component');
    }

    const hostComponentNames = {
      text: textHostName,
      textInput: textInputHostName,
    };
    configureInternal({ hostComponentNames });
    return hostComponentNames;
  } catch (error) {
    const errorMessage =
      error && typeof error === 'object' && 'message' in error
        ? error.message
        : null;

    throw new Error(`Trying to detect host component names triggered the following error:\n\n${errorMessage}\n\n${defaultErrorMessage}
`);
  }
}
