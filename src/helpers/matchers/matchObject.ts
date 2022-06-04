/**
 * check that each key value pair of the objects match
 * BE CAREFUL it works only for 1 level deep key value pairs
 * won't work for nested objects
 */
export function matchObject<T extends Record<string, unknown>>(
  prop: T | undefined,
  matcher: T
): boolean {
  return prop
    ? Object.keys(matcher).length !== 0 &&
        Object.keys(prop).length !== 0 &&
        Object.keys(matcher).every((key) => prop[key] === matcher[key])
    : false;
}
