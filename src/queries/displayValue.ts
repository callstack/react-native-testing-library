import type { ReactTestInstance } from 'react-test-renderer';
import { filterNodeByType } from '../helpers/filterNodeByType';
import { findAll } from '../helpers/findAll';
import { matches, TextMatch, TextMatchOptions } from '../matches';
import { getHostComponentNames } from '../helpers/host-component-names';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';
import type { CommonQueryOptions } from './options';

type ByDisplayValueOptions = CommonQueryOptions & TextMatchOptions;

const getTextInputNodeByDisplayValue = (
  node: ReactTestInstance,
  value: TextMatch,
  options: TextMatchOptions = {}
) => {
  const { exact, normalizer } = options;
  const nodeValue =
    node.props.value !== undefined ? node.props.value : node.props.defaultValue;

  return (
    filterNodeByType(node, getHostComponentNames().textInput) &&
    matches(value, nodeValue, normalizer, exact)
  );
};

const queryAllByDisplayValue = (
  instance: ReactTestInstance
): ((
  displayValue: TextMatch,
  queryOptions?: ByDisplayValueOptions
) => Array<ReactTestInstance>) =>
  function queryAllByDisplayValueFn(displayValue, queryOptions) {
    return findAll(
      instance,
      (node) =>
        getTextInputNodeByDisplayValue(node, displayValue, queryOptions),
      queryOptions
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
  getByDisplayValue: GetByQuery<TextMatch, ByDisplayValueOptions>;
  getAllByDisplayValue: GetAllByQuery<TextMatch, ByDisplayValueOptions>;
  queryByDisplayValue: QueryByQuery<TextMatch, ByDisplayValueOptions>;
  queryAllByDisplayValue: QueryAllByQuery<TextMatch, ByDisplayValueOptions>;
  findByDisplayValue: FindByQuery<TextMatch, ByDisplayValueOptions>;
  findAllByDisplayValue: FindAllByQuery<TextMatch, ByDisplayValueOptions>;
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
