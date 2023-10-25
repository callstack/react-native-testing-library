/**
 * Matches whether given array prop contains the given value, or all given values.
 *
 * @param prop - The array prop to match.
 * @param matcher - The value or values to be included in the array.
 * @returns Whether the array prop contains the given value, or all given values.
 */
export function matchArrayProp(
  prop: Array<string> | undefined,
  matcher: string | Array<string>
): boolean {
  if (!prop || matcher.length === 0) {
    return false;
  }

  if (typeof matcher === 'string') {
    return prop.includes(matcher);
  }

  return matcher.every((e) => prop.includes(e));
}
