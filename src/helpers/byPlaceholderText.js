// @flow
import { makeQueries } from './makeQueries';
import type { Queries } from './makeQueries';
import { filterNodeByType } from './filterNodeByType';
import { createLibraryNotSupportedError } from './errors';

const getTextInputNodeByPlaceholderText = (node, placeholder) => {
  try {
    const { TextInput } = require('react-native');
    return (
      filterNodeByType(node, TextInput) &&
      (typeof placeholder === 'string'
        ? placeholder === node.props.placeholder
        : placeholder.test(node.props.placeholder))
    );
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
};

const queryAllByPlaceholderText = (
  instance: ReactTestInstance
): ((placeholder: string | RegExp) => Array<ReactTestInstance>) =>
  function queryAllByPlaceholderFn(placeholder) {
    return instance.findAll((node) =>
      getTextInputNodeByPlaceholderText(node, placeholder)
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
