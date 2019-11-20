// @flow

export function matchString<T: string>(prop?: T, matcher: T | RegExp) {
  if (!prop) {
    return false;
  }

  if (typeof matcher === 'string') {
    return prop === matcher;
  }

  return Boolean(prop.match(matcher));
}

export function matchArray<T: string>(prop?: Array<T>, matcher: Array<T> | T) {
  if (!prop || matcher.length === 0) {
    return false;
  }

  if (typeof matcher === 'string') {
    return prop.includes(matcher);
  }

  return !matcher.some(e => !prop.includes(e));
}

export function matchObject<T: {}>(prop?: T, matcher: T) {
  return (
    prop !== undefined &&
    Object.keys(matcher).length !== 0 &&
    !Object.keys(matcher).some(key => prop[key] !== matcher[key])
  );
}
