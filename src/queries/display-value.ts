import { HostElement } from 'universal-test-renderer';
import { findAll } from '../helpers/find-all';
import { isHostTextInput } from '../helpers/host-component-names';
import { getTextInputValue } from '../helpers/text-input';
import type { TextMatch, TextMatchOptions } from '../matches';
import { matches } from '../matches';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './make-queries';
import { makeQueries } from './make-queries';
import type { CommonQueryOptions } from './options';

type ByDisplayValueOptions = CommonQueryOptions & TextMatchOptions;

const matchDisplayValue = (
  node: HostElement,
  expectedValue: TextMatch,
  options: TextMatchOptions = {},
) => {
  const { exact, normalizer } = options;
  const nodeValue = getTextInputValue(node);
  return matches(expectedValue, nodeValue, normalizer, exact);
};

const queryAllByDisplayValue = (
  instance: HostElement,
): QueryAllByQuery<TextMatch, ByDisplayValueOptions> =>
  function queryAllByDisplayValueFn(displayValue, queryOptions) {
    return findAll(
      instance,
      (node) => isHostTextInput(node) && matchDisplayValue(node, displayValue, queryOptions),
      queryOptions,
    );
  };

const getMultipleError = (displayValue: TextMatch) =>
  `Found multiple elements with display value: ${String(displayValue)} `;
const getMissingError = (displayValue: TextMatch) =>
  `Unable to find an element with displayValue: ${String(displayValue)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByDisplayValue,
  getMissingError,
  getMultipleError,
);

export type ByDisplayValueQueries = {
  getByDisplayValue: GetByQuery<TextMatch, ByDisplayValueOptions>;
  getAllByDisplayValue: GetAllByQuery<TextMatch, ByDisplayValueOptions>;
  queryByDisplayValue: QueryByQuery<TextMatch, ByDisplayValueOptions>;
  queryAllByDisplayValue: QueryAllByQuery<TextMatch, ByDisplayValueOptions>;
  findByDisplayValue: FindByQuery<TextMatch, ByDisplayValueOptions>;
  findAllByDisplayValue: FindAllByQuery<TextMatch, ByDisplayValueOptions>;
};

export const bindByDisplayValueQueries = (instance: HostElement): ByDisplayValueQueries => ({
  getByDisplayValue: getBy(instance),
  getAllByDisplayValue: getAllBy(instance),
  queryByDisplayValue: queryBy(instance),
  queryAllByDisplayValue: queryAllBy(instance),
  findByDisplayValue: findBy(instance),
  findAllByDisplayValue: findAllBy(instance),
});
