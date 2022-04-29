import type { ReactTestInstance } from 'react-test-renderer';
import { matches, TextMatch } from '../matches';
import { makeQueries } from './makeQueries';
import type { Queries } from './makeQueries';
import { filterNodeByType } from '../helpers/filterNodeByType';
import { createLibraryNotSupportedError } from '../helpers/errors';
import type { TextMatchOptions } from './byText';

const getTextInputNodeByDisplayValue = (
  node: ReactTestInstance,
  value: TextMatch,
  options: TextMatchOptions = {}
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
  displayValue: TextMatch,
  queryOptions?: TextMatchOptions
) => Array<ReactTestInstance>) =>
  function queryAllByDisplayValueFn(displayValue, queryOptions) {
    return instance.findAll((node) =>
      getTextInputNodeByDisplayValue(node, displayValue, queryOptions)
    );
  };

const getMultipleError = (displayValue: TextMatch) =>
  `Found multiple elements with display value: ${String(displayValue)} `;
const getMissingError = (displayValue: TextMatch) =>
  `Unable to find an element with displayValue: ${String(displayValue)}`;

const {
  getBy: getByDisplayValue,
  getAllBy: getAllByDisplayValue,
  queryBy: queryByDisplayValue,
  findBy: findByDisplayValue,
  findAllBy: findAllByDisplayValue,
}: Queries<TextMatch> = makeQueries(
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
