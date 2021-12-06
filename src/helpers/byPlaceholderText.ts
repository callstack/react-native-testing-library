import type { ReactTestInstance } from 'react-test-renderer';
import { matches } from '../matches';
import { makeQueries } from './makeQueries';
import type { Queries } from './makeQueries';
import { filterNodeByType } from './filterNodeByType';
import { createLibraryNotSupportedError } from './errors';
import type { TextMatchOptions } from './byText';

const getTextInputNodeByPlaceholderText = (
  node: ReactTestInstance,
  placeholder: string | RegExp,
  options: TextMatchOptions = {}
) => {
  try {
    const { TextInput } = require('react-native');
    const { exact, normalizer } = options;
    return (
      filterNodeByType(node, TextInput) &&
      matches(placeholder, node.props.placeholder, normalizer, exact)
    );
  } catch (error) {
    if (error instanceof Error) {
      throw createLibraryNotSupportedError(error);
    }
    return false;
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

const getMultipleError = (placeholder: string | RegExp) =>
  `Found multiple elements with placeholder: ${String(placeholder)} `;
const getMissingError = (placeholder: string | RegExp) =>
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
