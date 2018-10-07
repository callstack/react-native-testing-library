// @flow
import * as React from 'react';
import TestRenderer from 'react-test-renderer'; // eslint-disable-line import/no-extraneous-dependencies
import {
  getByTestId,
  getByName,
  getByText,
  getByProps,
  getAllByName,
  getAllByText,
  getAllByProps,
} from './helpers/getBy';
import {
  queryByTestId,
  queryByName,
  queryByText,
  queryByProps,
  queryAllByName,
  queryAllByText,
  queryAllByProps,
} from './helpers/queryBy';

/**
 * Renders test component deeply using react-test-renderer and exposes helpers
 * to assert on the output.
 */
export default function render(
  component: React.Element<*>,
  options?: { createNodeMock: (element: React.Element<*>) => any }
) {
  const renderer = TestRenderer.create(component, options);
  const instance = renderer.root;

  return {
    getByTestId: getByTestId(instance),
    getByName: getByName(instance),
    getByText: getByText(instance),
    getByProps: getByProps(instance),
    getAllByName: getAllByName(instance),
    getAllByText: getAllByText(instance),
    getAllByProps: getAllByProps(instance),

    queryByTestId: queryByTestId(instance),
    queryByName: queryByName(instance),
    queryByText: queryByText(instance),
    queryByProps: queryByProps(instance),
    queryAllByName: queryAllByName(instance),
    queryAllByText: queryAllByText(instance),
    queryAllByProps: queryAllByProps(instance),

    update: renderer.update,
    unmount: renderer.unmount,
  };
}
