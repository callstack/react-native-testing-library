import { TextMatch } from '../../matches';

export function matchStringValue(
  prop: string | undefined,
  matcher: TextMatch
): boolean {
  if (!prop) {
    return false;
  }

  if (typeof matcher === 'string') {
    return prop === matcher;
  }

  return Boolean(prop.match(matcher));
}
