import type { ReactTestInstance } from 'react-test-renderer';
import { createLibraryNotSupportedError } from '../helpers/errors';
import { filterNodeByType } from '../helpers/filterNodeByType';
import { matches, TextMatch } from '../matches';
import { makeQueries } from './makeQueries';
import type { Queries } from './makeQueries';
import type { TextMatchOptions } from './byText';

const getTextInputNodeByPlaceholderText = (
  node: ReactTestInstance,
  placeholder: TextMatch,
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
    throw createLibraryNotSupportedError(error);
  }
};

const queryAllByPlaceholderText = (
  instance: ReactTestInstance
): ((
  placeholder: TextMatch,
  queryOptions?: TextMatchOptions
) => Array<ReactTestInstance>) =>
  function queryAllByPlaceholderFn(placeholder, queryOptions) {
    return instance.findAll((node) =>
      getTextInputNodeByPlaceholderText(node, placeholder, queryOptions)
    );
  };

const getMultipleError = (placeholder: TextMatch) =>
  `Found multiple elements with placeholder: ${String(placeholder)} `;
const getMissingError = (placeholder: TextMatch) =>
  `Unable to find an element with placeholder: ${String(placeholder)}`;

const {
  getBy: getByPlaceholderText,
  getAllBy: getAllByPlaceholderText,
  queryBy: queryByPlaceholderText,
  findBy: findByPlaceholderText,
  findAllBy: findAllByPlaceholderText,
}: Queries<TextMatch, TextMatchOptions> = makeQueries(
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
