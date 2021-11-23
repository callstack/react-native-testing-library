// @flow
import { matches } from '../matches';
import { makeQueries } from './makeQueries';
import type { Queries } from './makeQueries';
import { filterNodeByType } from './filterNodeByType';
import { createLibraryNotSupportedError } from './errors';
import type { TextMatchOptions } from './byText';

const getTextInputNodeByDisplayValue = (
  node,
  value,
  options?: TextMatchOptions = {}
) => {
  try {
    const { TextInput } = require('react-native');
    const { exact, normalizer } = options;
    const nodeValue =
      node.props.value !== undefined
        ? node.props.value
        : node.props.defaultValue;
    return (
      filterNodeByType(node, TextInput) &&
      matches(value, nodeValue, normalizer, exact)
    );
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
};

const queryAllByDisplayValue = (
  instance: ReactTestInstance
): ((
  displayValue: string | RegExp,
  queryOptions?: TextMatchOptions
) => Array<ReactTestInstance>) =>
  function queryAllByDisplayValueFn(displayValue, queryOptions) {
    return instance.findAll((node) =>
      getTextInputNodeByDisplayValue(node, displayValue, queryOptions)
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
