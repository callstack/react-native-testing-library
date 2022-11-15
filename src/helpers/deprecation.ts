export function deprecateAllQueries<Queries extends Record<string, any>>(
  queriesObject: Queries,
  querySuffix: string,
  recommendationSuffix: string
): Queries {
  const result = {} as Queries;
  Object.keys(queriesObject).forEach((queryName) => {
    const queryFn = queriesObject[queryName];
    const recommendation = queryName.replace(querySuffix, recommendationSuffix);
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
  // @ts-expect-error: generic typing is hard
  const wrapper: QueryFn = (...args: any) => {
    // eslint-disable-next-line no-console
    console.warn(
      `${queryName}(...) is deprecated.\n\nPlease use ${recommendation} instead.`
    );

    return queryFn(...args);
  };

  return wrapper;
}
