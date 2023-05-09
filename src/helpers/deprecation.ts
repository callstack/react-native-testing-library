import { getQueryPrefix } from './query-name';

export function deprecateQueries<Queries extends Record<string, any>>(
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

function deprecateQuery<QueryFn extends (...args: any) => any>(
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
    const errorMessage = `${queryName}(...) is deprecated and will be removed in the future.\n\n${formattedRecommendation}`;
    // eslint-disable-next-line no-console
    console.warn(errorMessage);
    return queryFn(...args);
  };

  return wrapper;
}

const warned: { [functionName: string]: boolean } = {};

// istambul ignore next: Occasionally used
export function printDeprecationWarning(functionName: string) {
  if (warned[functionName]) {
    return;
  }

  // eslint-disable-next-line no-console
  console.warn(`
  Deprecation Warning:
  Use of ${functionName} is not recommended and will be deleted in future versions of @testing-library/react-native.
  `);

  warned[functionName] = true;
}
