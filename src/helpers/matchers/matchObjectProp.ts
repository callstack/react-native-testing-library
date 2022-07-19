/**
 * check that each key value pair of the objects match
 * BE CAREFUL it works only for 1 level deep key value pairs
 * won't work for nested objects
 */

/**
 * Matches whether given object prop contains all key/value pairs.
 * @param prop - The object prop to match.
 * @param matcher - The key/value pairs to be included in the object.
 * @returns Whether the object prop contains all key/value pairs.
 */
export function matchObjectProp<T extends Record<string, unknown>>(
  prop: T | undefined,
  matcher: T
): boolean {
  if (!prop || Object.keys(matcher).length === 0) {
    return false;
  }

  return (
    Object.keys(prop).length !== 0 &&
    Object.keys(matcher).every((key) => prop[key] === matcher[key])
  );
}
