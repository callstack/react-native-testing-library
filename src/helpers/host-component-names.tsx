import * as React from 'react';
import { Text, TextInput, View } from 'react-native';
import { configureInternal, getConfig, HostComponentNames } from '../config';
import { renderWithAct } from '../render-act';
import { getQueriesForElement } from '../within';

const userConfigErrorMessage = `There seems to be an issue with your configuration that prevents React Native Testing Library from working correctly.
Please check if you are using compatible versions of React Native and React Native Testing Library.`;

export function getHostComponentNames(): HostComponentNames {
  let hostComponentNames = getConfig().hostComponentNames;
  if (!hostComponentNames) {
    hostComponentNames = detectHostComponentNames();
    configureInternal({ hostComponentNames });
  }

  return hostComponentNames;
}

export function configureHostComponentNamesIfNeeded() {
  const configHostComponentNames = getConfig().hostComponentNames;
  if (configHostComponentNames) {
    return;
  }

  const hostComponentNames = detectHostComponentNames();
  configureInternal({ hostComponentNames });
}

function detectHostComponentNames(): HostComponentNames {
  try {
    const renderer = renderWithAct(
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

    return {
      text: textHostName,
      textInput: textInputHostName,
    };
  } catch (error) {
    const errorMessage =
      error && typeof error === 'object' && 'message' in error
        ? error.message
        : null;

    throw new Error(
      `Trying to detect host component names triggered the following error:\n\n${errorMessage}\n\n${userConfigErrorMessage}`
    );
  }
}
