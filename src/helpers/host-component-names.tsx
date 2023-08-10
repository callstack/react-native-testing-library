import * as React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import { Modal, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { configureInternal, getConfig, HostComponentNames } from '../config';
import { renderWithAct } from '../render-act';
import { HostTestInstance } from './component-tree';

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
        <ScrollView testID="scrollView" />
        <Modal testID="modal" />
      </View>
    );

    return {
      text: getByTestId(renderer.root, 'text').type as string,
      textInput: getByTestId(renderer.root, 'textInput').type as string,
      switch: getByTestId(renderer.root, 'switch').type as string,
      scrollView: getByTestId(renderer.root, 'scrollView').type as string,
      modal: getByTestId(renderer.root, 'modal').type as string,
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

/**
 * Checks if the given element is a host Text.
 * @param element The element to check.
 */
export function isHostText(
  element?: ReactTestInstance | null
): element is HostTestInstance {
  return element?.type === getHostComponentNames().text;
}

/**
 * Checks if the given element is a host TextInput.
 * @param element The element to check.
 */
export function isHostTextInput(
  element?: ReactTestInstance | null
): element is HostTestInstance {
  return element?.type === getHostComponentNames().textInput;
}

export function isHostScrollView(element?: ReactTestInstance) {
  return element?.type === getHostComponentNames().scrollView;
}

/**
 * Checks if the given element is a host Modal.
 * @param element The element to check.
 */
export function isHostModal(
  element?: ReactTestInstance | null
): element is HostTestInstance {
  return element?.type === getHostComponentNames().modal;
}
