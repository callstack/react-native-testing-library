import type { ReactTestInstance } from 'react-test-renderer';
import { TextMatch } from '../matches';
import { matchStringValue } from '../helpers/matchers/matchStringValue';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';

const queryAllByHintText = (
  instance: ReactTestInstance
): ((hint: TextMatch) => Array<ReactTestInstance>) =>
  function queryAllByA11yHintFn(hint) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        matchStringValue(node.props.accessibilityHint, hint)
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
  getByHintText: GetByQuery<TextMatch>;
  getAllByHintText: GetAllByQuery<TextMatch>;
  queryByHintText: QueryByQuery<TextMatch>;
  queryAllByHintText: QueryAllByQuery<TextMatch>;
  findByHintText: FindByQuery<TextMatch>;
  findAllByHintText: FindAllByQuery<TextMatch>;

  // a11yHint aliases
  getByA11yHint: GetByQuery<TextMatch>;
  getAllByA11yHint: GetAllByQuery<TextMatch>;
  queryByA11yHint: QueryByQuery<TextMatch>;
  queryAllByA11yHint: QueryAllByQuery<TextMatch>;
  findByA11yHint: FindByQuery<TextMatch>;
  findAllByA11yHint: FindAllByQuery<TextMatch>;

  // accessibilityHint aliases
  getByAccessibilityHint: GetByQuery<TextMatch>;
  getAllByAccessibilityHint: GetAllByQuery<TextMatch>;
  queryByAccessibilityHint: QueryByQuery<TextMatch>;
  queryAllByAccessibilityHint: QueryAllByQuery<TextMatch>;
  findByAccessibilityHint: FindByQuery<TextMatch>;
  findAllByAccessibilityHint: FindAllByQuery<TextMatch>;
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
