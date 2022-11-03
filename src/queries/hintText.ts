import type { ReactTestInstance } from 'react-test-renderer';
import { matches, TextMatch } from '../matches';
import { findAll } from '../helpers/findAll';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';
import { TextMatchOptions } from './options';

const getNodeByHintText = (
  node: ReactTestInstance,
  text: TextMatch,
  options: TextMatchOptions = {}
) => {
  const { exact, normalizer } = options;
  return matches(text, node.props.accessibilityHint, normalizer, exact);
};

const queryAllByHintText = (
  instance: ReactTestInstance
): ((
  hint: TextMatch,
  queryOptions?: TextMatchOptions
) => Array<ReactTestInstance>) =>
  function queryAllByA11yHintFn(hint, queryOptions) {
    return findAll(
      instance,
      (node) =>
        typeof node.type === 'string' &&
        getNodeByHintText(node, hint, queryOptions),
      queryOptions
    );
  };

const getMultipleError = (hint: TextMatch) =>
  `Found multiple elements with accessibilityHint: ${String(hint)} `;
const getMissingError = (hint: TextMatch) =>
  `Unable to find an element with accessibilityHint: ${String(hint)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByHintText,
  getMissingError,
  getMultipleError
);

export type ByHintTextQueries = {
  getByHintText: GetByQuery<TextMatch, TextMatchOptions>;
  getAllByHintText: GetAllByQuery<TextMatch, TextMatchOptions>;
  queryByHintText: QueryByQuery<TextMatch, TextMatchOptions>;
  queryAllByHintText: QueryAllByQuery<TextMatch, TextMatchOptions>;
  findByHintText: FindByQuery<TextMatch, TextMatchOptions>;
  findAllByHintText: FindAllByQuery<TextMatch, TextMatchOptions>;

  // a11yHint aliases
  getByA11yHint: GetByQuery<TextMatch, TextMatchOptions>;
  getAllByA11yHint: GetAllByQuery<TextMatch, TextMatchOptions>;
  queryByA11yHint: QueryByQuery<TextMatch, TextMatchOptions>;
  queryAllByA11yHint: QueryAllByQuery<TextMatch, TextMatchOptions>;
  findByA11yHint: FindByQuery<TextMatch, TextMatchOptions>;
  findAllByA11yHint: FindAllByQuery<TextMatch, TextMatchOptions>;

  // accessibilityHint aliases
  getByAccessibilityHint: GetByQuery<TextMatch, TextMatchOptions>;
  getAllByAccessibilityHint: GetAllByQuery<TextMatch, TextMatchOptions>;
  queryByAccessibilityHint: QueryByQuery<TextMatch, TextMatchOptions>;
  queryAllByAccessibilityHint: QueryAllByQuery<TextMatch, TextMatchOptions>;
  findByAccessibilityHint: FindByQuery<TextMatch, TextMatchOptions>;
  findAllByAccessibilityHint: FindAllByQuery<TextMatch, TextMatchOptions>;
};

export const bindByHintTextQueries = (
  instance: ReactTestInstance
): ByHintTextQueries => {
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
