// @flow
import { matches } from '../matches';
import { makeQueries } from './makeQueries';
import type { Queries } from './makeQueries';
import { filterNodeByType } from './filterNodeByType';
import { createLibraryNotSupportedError } from './errors';
import type { TextMatchOptions } from './byText';

const getTextInputNodeByPlaceholderText = (
  node,
  placeholder,
  options?: TextMatchOptions = {}
) => {
  try {
    const { TextInput } = require('react-native');
    const { exact, normalizer } = options;
    return (
      filterNodeByType(node, TextInput) &&
      matches(placeholder, node.props.placeholder, normalizer, exact)
    );
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
};

const queryAllByPlaceholderText = (
  instance: ReactTestInstance
): ((
  placeholder: string | RegExp,
  queryOptions?: TextMatchOptions
) => Array<ReactTestInstance>) =>
  function queryAllByPlaceholderFn(placeholder, queryOptions) {
    return instance.findAll((node) =>
      getTextInputNodeByPlaceholderText(node, placeholder, queryOptions)
    );
  };

const getMultipleError = (placeholder) =>
  `Found multiple elements with placeholder: ${String(placeholder)} `;
const getMissingError = (placeholder) =>
  `Unable to find an element with placeholder: ${String(placeholder)}`;

const {
  getBy: getByPlaceholderText,
  getAllBy: getAllByPlaceholderText,
  queryBy: queryByPlaceholderText,
  findBy: findByPlaceholderText,
  findAllBy: findAllByPlaceholderText,
}: Queries<string | RegExp> = makeQueries(
  queryAllByPlaceholderText,
  getMissingError,
  getMultipleError
);

export {
  findAllByPlaceholderText,
  findByPlaceholderText,
  getAllByPlaceholderText,
  getByPlaceholderText,
  queryAllByPlaceholderText,
  queryByPlaceholderText,
};
