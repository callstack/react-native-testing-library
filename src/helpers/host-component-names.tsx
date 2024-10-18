import * as React from 'react';
import { Image, Modal, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { configureInternal, getConfig, HostComponentNames } from '../config';
import { HostElement } from '../renderer/host-element';
import { createRenderer } from '../renderer/renderer';
import act from '../act';
import { findAll } from './find-all';

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
    const renderer = createRenderer();
    act(() => {
      renderer.render(
        <View>
          <Text testID="text">Hello</Text>
          <TextInput testID="textInput" />
          <Image testID="image" />
          <Switch testID="switch" />
          <ScrollView testID="scrollView" />
          <Modal testID="modal" />
        </View>,
      );
    });
    return {
      text: getByTestId(renderer.container, 'text').type as string,
      textInput: getByTestId(renderer.container, 'textInput').type as string,
      image: getByTestId(renderer.container, 'image').type as string,
      switch: getByTestId(renderer.container, 'switch').type as string,
      scrollView: getByTestId(renderer.container, 'scrollView').type as string,
      modal: getByTestId(renderer.container, 'modal').type as string,
    };
  } catch (error) {
    const errorMessage =
      error && typeof error === 'object' && 'message' in error ? error.message : null;

    throw new Error(
      `Trying to detect host component names triggered the following error:\n\n${errorMessage}\n\n${userConfigErrorMessage}`,
    );
  }
}

function getByTestId(element: HostElement, testID: string) {
  const nodes = findAll(
    element,
    (node) => typeof node.type === 'string' && node.props.testID === testID,
  );

  if (nodes.length === 0) {
    throw new Error(`Unable to find an element with testID: ${testID}`);
  }

  return nodes[0];
}

/**
 * Checks if the given element is a host Text element.
 * @param element The element to check.
 */
export function isHostText(element?: HostElement | null) {
  return element?.type === getHostComponentNames().text;
}

/**
 * Checks if the given element is a host TextInput element.
 * @param element The element to check.
 */
export function isHostTextInput(element?: HostElement | null) {
  return element?.type === getHostComponentNames().textInput;
}

/**
 * Checks if the given element is a host Image element.
 * @param element The element to check.
 */
export function isHostImage(element?: HostElement | null) {
  return element?.type === getHostComponentNames().image;
}

/**
 * Checks if the given element is a host Switch element.
 * @param element The element to check.
 */
export function isHostSwitch(element?: HostElement | null) {
  return element?.type === getHostComponentNames().switch;
}

/**
 * Checks if the given element is a host ScrollView element.
 * @param element The element to check.
 */
export function isHostScrollView(element?: HostElement | null) {
  return element?.type === getHostComponentNames().scrollView;
}

/**
 * Checks if the given element is a host Modal element.
 * @param element The element to check.
 */
export function isHostModal(element?: HostElement | null) {
  return element?.type === getHostComponentNames().modal;
}
