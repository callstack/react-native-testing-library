import { HostComponent } from 'universal-test-renderer';
import { findAll } from '../helpers/find-all';
import { matches, TextMatch, TextMatchOptions } from '../matches';
import { makeQueries } from './make-queries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './make-queries';
import { CommonQueryOptions } from './options';

type ByHintTextOptions = CommonQueryOptions & TextMatchOptions;

const getNodeByHintText = (
  node: HostComponent,
  text: TextMatch,
  options: TextMatchOptions = {},
) => {
  const { exact, normalizer } = options;
  return matches(text, node.props.accessibilityHint, normalizer, exact);
};

const queryAllByHintText = (
  instance: HostComponent,
): QueryAllByQuery<TextMatch, ByHintTextOptions> =>
  function queryAllByA11yHintFn(hint, queryOptions) {
    return findAll(instance, (node) => getNodeByHintText(node, hint, queryOptions), queryOptions);
  };

const getMultipleError = (hint: TextMatch) =>
  `Found multiple elements with accessibility hint: ${String(hint)} `;
const getMissingError = (hint: TextMatch) =>
  `Unable to find an element with accessibility hint: ${String(hint)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByHintText,
  getMissingError,
  getMultipleError,
);

export type ByHintTextQueries = {
  getByHintText: GetByQuery<TextMatch, ByHintTextOptions>;
  getAllByHintText: GetAllByQuery<TextMatch, ByHintTextOptions>;
  queryByHintText: QueryByQuery<TextMatch, ByHintTextOptions>;
  queryAllByHintText: QueryAllByQuery<TextMatch, ByHintTextOptions>;
  findByHintText: FindByQuery<TextMatch, ByHintTextOptions>;
  findAllByHintText: FindAllByQuery<TextMatch, ByHintTextOptions>;

  // a11yHint aliases
  getByA11yHint: GetByQuery<TextMatch, ByHintTextOptions>;
  getAllByA11yHint: GetAllByQuery<TextMatch, ByHintTextOptions>;
  queryByA11yHint: QueryByQuery<TextMatch, ByHintTextOptions>;
  queryAllByA11yHint: QueryAllByQuery<TextMatch, ByHintTextOptions>;
  findByA11yHint: FindByQuery<TextMatch, ByHintTextOptions>;
  findAllByA11yHint: FindAllByQuery<TextMatch, ByHintTextOptions>;

  // accessibilityHint aliases
  getByAccessibilityHint: GetByQuery<TextMatch, ByHintTextOptions>;
  getAllByAccessibilityHint: GetAllByQuery<TextMatch, ByHintTextOptions>;
  queryByAccessibilityHint: QueryByQuery<TextMatch, ByHintTextOptions>;
  queryAllByAccessibilityHint: QueryAllByQuery<TextMatch, ByHintTextOptions>;
  findByAccessibilityHint: FindByQuery<TextMatch, ByHintTextOptions>;
  findAllByAccessibilityHint: FindAllByQuery<TextMatch, ByHintTextOptions>;
};

export const bindByHintTextQueries = (instance: HostComponent): ByHintTextQueries => {
  const getByHintText = getBy(instance);
  const getAllByHintText = getAllBy(instance);
  const queryByHintText = queryBy(instance);
  const queryAllByHintText = queryAllBy(instance);
  const findByHintText = findBy(instance);
  const findAllByHintText = findAllBy(instance);

  return {
    getByHintText,
    getAllByHintText,
    queryByHintText,
    queryAllByHintText,
    findByHintText,
    findAllByHintText,

    // a11yHint aliases
    getByA11yHint: getByHintText,
    getAllByA11yHint: getAllByHintText,
    queryByA11yHint: queryByHintText,
    queryAllByA11yHint: queryAllByHintText,
    findByA11yHint: findByHintText,
    findAllByA11yHint: findAllByHintText,

    // accessibilityHint aliases
    getByAccessibilityHint: getByHintText,
    getAllByAccessibilityHint: getAllByHintText,
    queryByAccessibilityHint: queryByHintText,
    queryAllByAccessibilityHint: queryAllByHintText,
    findByAccessibilityHint: findByHintText,
    findAllByAccessibilityHint: findAllByHintText,
  };
};
