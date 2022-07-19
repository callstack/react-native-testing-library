import type { ReactTestInstance } from 'react-test-renderer';
import { TextMatch } from '../matches';
import { matchStringProp } from '../helpers/matchers/matchStringProp';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';

const queryAllByLabelText = (
  instance: ReactTestInstance
): ((text: TextMatch) => Array<ReactTestInstance>) =>
  function queryAllByLabelTextFn(text) {
    return instance.findAll(
      (node) =>
        typeof node.type === 'string' &&
        matchStringProp(node.props.accessibilityLabel, text)
    );
  };

const getMultipleError = (labelText: TextMatch) =>
  `Found multiple elements with accessibilityLabel: ${String(labelText)} `;
const getMissingError = (labelText: TextMatch) =>
  `Unable to find an element with accessibilityLabel: ${String(labelText)}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByLabelText,
  getMissingError,
  getMultipleError
);

export type ByLabelTextQueries = {
  getByLabelText: GetByQuery<TextMatch>;
  getAllByLabelText: GetAllByQuery<TextMatch>;
  queryByLabelText: QueryByQuery<TextMatch>;
  queryAllByLabelText: QueryAllByQuery<TextMatch>;
  findByLabelText: FindByQuery<TextMatch>;
  findAllByLabelText: FindAllByQuery<TextMatch>;
};

export const bindByLabelTextQueries = (
  instance: ReactTestInstance
): ByLabelTextQueries => ({
  getByLabelText: getBy(instance),
  getAllByLabelText: getAllBy(instance),
  queryByLabelText: queryBy(instance),
  queryAllByLabelText: queryAllBy(instance),
  findByLabelText: findBy(instance),
  findAllByLabelText: findAllBy(instance),
});
