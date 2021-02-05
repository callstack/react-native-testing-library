// @flow
import { makeQueries } from './makeQueries';
import type { Queries } from './makeQueries';
import { filterNodeByType } from './filterNodeByType';
import { createLibraryNotSupportedError } from './errors';

const getTextInputNodeByDisplayValue = (node, value) => {
  try {
    const { TextInput } = require('react-native');
    const nodeValue =
      node.props.value !== undefined
        ? node.props.value
        : node.props.defaultValue;
    return (
      filterNodeByType(node, TextInput) &&
      (typeof value === 'string' ? value === nodeValue : value.test(nodeValue))
    );
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
};

const queryAllByDisplayValue = (
  instance: ReactTestInstance
): ((displayValue: string | RegExp) => Array<ReactTestInstance>) =>
  function queryAllByDisplayValueFn(displayValue) {
    return instance.findAll((node) =>
      getTextInputNodeByDisplayValue(node, displayValue)
    );
  };

const getMultipleError = (displayValue: string | RegExp) =>
  `Found multiple elements with display value: ${String(displayValue)} `;
const getMissingError = (displayValue: string | RegExp) =>
  `Unable to find an element with displayValue: ${String(displayValue)}`;

const {
  getBy: getByDisplayValue,
  getAllBy: getAllByDisplayValue,
  queryBy: queryByDisplayValue,
  findBy: findByDisplayValue,
  findAllBy: findAllByDisplayValue,
}: Queries<string | RegExp> = makeQueries(
  queryAllByDisplayValue,
  getMissingError,
  getMultipleError
);

export {
  findAllByDisplayValue,
  findByDisplayValue,
  getAllByDisplayValue,
  getByDisplayValue,
  queryAllByDisplayValue,
  queryByDisplayValue,
};
