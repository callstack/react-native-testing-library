import { getQueryPrefix } from './query-name';

export function deprecateAllQueries<Queries extends Record<string, any>>(
  queriesObject: Queries,
  recommendation: string
): Queries {
  const result = {} as Queries;
  Object.keys(queriesObject).forEach((queryName) => {
    const queryFn = queriesObject[queryName];
    // @ts-expect-error: generic typing is hard
    result[queryName] = deprecateQuery(queryFn, queryName, recommendation);
  });

  return result;
}

export function deprecateQuery<QueryFn extends (...args: any) => any>(
  queryFn: QueryFn,
  queryName: string,
  recommendation: string
): QueryFn {
  const formattedRecommendation = recommendation.replace(
    /{queryPrefix}/g,
    getQueryPrefix(queryName)
  );

  // @ts-expect-error: generic typing is hard
  const wrapper: QueryFn = (...args: any) => {
    const errorMessage = `${queryName}(...) is deprecated.\n\n${formattedRecommendation}`;
    // eslint-disable-next-line no-console
    console.warn(errorMessage);
    return queryFn(...args);
  };

  return wrapper;
}
