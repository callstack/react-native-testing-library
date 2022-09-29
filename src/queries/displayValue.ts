import type { ReactTestInstance } from 'react-test-renderer';
import { filterNodeByType } from '../helpers/filterNodeByType';
import { importTextInputFromReactNative } from '../helpers/react-native-api';
import { matches, TextMatch } from '../matches';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';
import type { TextMatchOptions } from './text';

const getTextInputNodeByDisplayValue = (
  node: ReactTestInstance,
  value: TextMatch,
  options: TextMatchOptions = {}
) => {
  const TextInput = importTextInputFromReactNative();
  const { exact, normalizer } = options;
  const nodeValue =
    node.props.value !== undefined ? node.props.value : node.props.defaultValue;
  return (
    filterNodeByType(node, TextInput) &&
    matches(value, nodeValue, normalizer, exact)
  );
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

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByDisplayValue,
  getMissingError,
  getMultipleError
);

export type ByDisplayValueQueries = {
  getByDisplayValue: GetByQuery<TextMatch, TextMatchOptions>;
  getAllByDisplayValue: GetAllByQuery<TextMatch, TextMatchOptions>;
  queryByDisplayValue: QueryByQuery<TextMatch, TextMatchOptions>;
  queryAllByDisplayValue: QueryAllByQuery<TextMatch, TextMatchOptions>;
  findByDisplayValue: FindByQuery<TextMatch, TextMatchOptions>;
  findAllByDisplayValue: FindAllByQuery<TextMatch, TextMatchOptions>;
};

export const bindByDisplayValueQueries = (
  instance: ReactTestInstance
): ByDisplayValueQueries => ({
  getByDisplayValue: getBy(instance),
  getAllByDisplayValue: getAllBy(instance),
  queryByDisplayValue: queryBy(instance),
  queryAllByDisplayValue: queryAllBy(instance),
  findByDisplayValue: findBy(instance),
  findAllByDisplayValue: findAllBy(instance),
});
