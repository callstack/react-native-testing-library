// @flow
import * as React from 'react';
import { isValidElementType } from 'react-is';
import TestRenderer from 'react-test-renderer'; // eslint-disable-line import/no-extraneous-dependencies
import ShallowRenderer from 'react-test-renderer/shallow'; // eslint-disable-line import/no-extraneous-dependencies
import prettyFormat, { plugins } from 'pretty-format'; // eslint-disable-line import/no-extraneous-dependencies
import fireEvent from './fireEvent';

const getNodeByName = (node, name) =>
  node.type.name === name ||
  node.type.displayName === name ||
  node.type === name;

const getNodeByText = (node, text) =>
  (getNodeByName(node, 'Text') || getNodeByName(node, 'TextInput')) &&
  (typeof text === 'string'
    ? text === node.props.children
    : text.test(node.props.children));

/**
 * Wait for microtasks queue to flush
 */
export const flushMicrotasksQueue = (): Promise<any> =>
  new Promise(resolve => setImmediate(resolve));

/**
 * Renders test component deeply using react-test-renderer and exposes helpers
 * to assert on the output.
 */
export const render = (
  component: React.Element<*>,
  options?: { createNodeMock: (element: React.Element<*>) => any }
) => {
  const renderer = TestRenderer.create(component, options);
  const instance = renderer.root;

  const getByName = (name: string | React.Element<*>) => {
    try {
      return instance.find(node => getNodeByName(node, name));
    } catch (error) {
      throw new ErrorWithStack(`Error: Component not found.`, getByName);
    }
  };

  const getByText = (text: string | RegExp) => {
    try {
      return instance.find(node => getNodeByText(node, text));
    } catch (error) {
      throw new ErrorWithStack(`Error: Component not found.`, getByText);
    }
  };

  const getByProps = (props: { [propName: string]: any }) => {
    try {
      return instance.findByProps(props);
    } catch (error) {
      throw new ErrorWithStack(`Error: Component not found.`, getByProps);
    }
  };

  return {
    fireEvent,
    getByTestId: (testID: string) => instance.findByProps({ testID }),
    getByName,
    getAllByName: (name: string | React.Element<*>) =>
      instance.findAll(node => getNodeByName(node, name)),
    getByText,
    getAllByText: (text: string | RegExp) =>
      instance.findAll(node => getNodeByText(node, text)),
    getByProps,
    getAllByProps: (props: { [propName: string]: any }) =>
      instance.findAllByProps(props),
    update: renderer.update,
    unmount: renderer.unmount,
  };
};

/**
 * Renders test component shallowly using react-test-renderer/shallow
 */
export const shallow = (instance: ReactTestInstance | React.Element<*>) => {
  const renderer = new ShallowRenderer();
  if (isValidElementType(instance)) {
    // $FlowFixMe - instance is React.Element<*> in this branch
    renderer.render(instance);
  } else {
    renderer.render(React.createElement(instance.type, instance.props));
  }
  const output = renderer.getRenderOutput();

  return {
    output,
  };
};

/**
 * Log pretty-printed shallow test component instance
 */
export const debug = (
  instance: ReactTestInstance | React.Element<*>,
  message?: any
) => {
  const { output } = shallow(instance);
  // eslint-disable-next-line no-console
  console.log(format(output), message || '');
};

const format = input =>
  prettyFormat(input, {
    plugins: [plugins.ReactTestComponent, plugins.ReactElement],
  });

class ErrorWithStack extends Error {
  constructor(message: ?string, callsite: Function) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, callsite);
    }
  }
}
