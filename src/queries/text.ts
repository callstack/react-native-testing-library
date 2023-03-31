import type { ReactTestInstance } from 'react-test-renderer';
import { filterNodeByType } from '../helpers/filterNodeByType';
import { findAll } from '../helpers/findAll';
import format from '../helpers/format';
import { getHostComponentNames } from '../helpers/host-component-names';
import { mapVisibilityRelatedProps } from '../helpers/mapProps';
import { matchTextContent } from '../helpers/matchers/matchTextContent';
import { TextMatch, TextMatchOptions } from '../matches';
import { screen } from '../screen';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';
import { makeQueries } from './makeQueries';
import type { CommonQueryOptions } from './options';

type ByTextOptions = CommonQueryOptions & TextMatchOptions;

const queryAllByText = (
  instance: ReactTestInstance
): ((text: TextMatch, options?: ByTextOptions) => Array<ReactTestInstance>) =>
  function queryAllByTextFn(text, options = {}) {
    return findAll(
      instance,
      (node) =>
        filterNodeByType(node, getHostComponentNames().text) &&
        matchTextContent(node, text, options),
      {
        ...options,
        matchDeepestOnly: true,
      }
    );
  };

const getMultipleError = (text: TextMatch) =>
  `Found multiple elements with text: ${String(text)}`;

const getMissingError = (text: TextMatch) =>
  `Unable to find an element with text: ${String(text)}

${format(screen.toJSON() || [], { mapProps: mapVisibilityRelatedProps })}`;

const { getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy } = makeQueries(
  queryAllByText,
  getMissingError,
  getMultipleError
);

export type ByTextQueries = {
  getByText: GetByQuery<TextMatch, ByTextOptions>;
  getAllByText: GetAllByQuery<TextMatch, ByTextOptions>;
  queryByText: QueryByQuery<TextMatch, ByTextOptions>;
  queryAllByText: QueryAllByQuery<TextMatch, ByTextOptions>;
  findByText: FindByQuery<TextMatch, ByTextOptions>;
  findAllByText: FindAllByQuery<TextMatch, ByTextOptions>;
};

export const bindByTextQueries = (
  instance: ReactTestInstance
): ByTextQueries => ({
  getByText: getBy(instance),
  getAllByText: getAllBy(instance),
  queryByText: queryBy(instance),
  queryAllByText: queryAllBy(instance),
  findByText: findBy(instance),
  findAllByText: findAllBy(instance),
});
