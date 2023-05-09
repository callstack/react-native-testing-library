import * as React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import { Switch, Text, TextInput, View } from 'react-native';
import { configureInternal, getConfig, HostComponentNames } from '../config';
import { renderWithAct } from '../render-act';

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
        <Switch testID="switch" />
      </View>
    );

    return {
      text: getByTestId(renderer.root, 'text').type as string,
      textInput: getByTestId(renderer.root, 'textInput').type as string,
      switch: getByTestId(renderer.root, 'switch').type as string,
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

function getByTestId(instance: ReactTestInstance, testID: string) {
  const nodes = instance.findAll(
    (node) => typeof node.type === 'string' && node.props.testID === testID
  );

  if (nodes.length === 0) {
    throw new Error(`Unable to find an element with testID: ${testID}`);
  }

  return nodes[0];
}
