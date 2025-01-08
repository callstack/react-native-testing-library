export function pick<T extends object>(object: T, keys: (keyof T)[]): Partial<T> {
  const result: Partial<T> = {};
  keys.forEach((key) => {
    if (object[key] !== undefined) {
      result[key] = object[key];
    }
  });

  return result;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function removeUndefinedKeys(prop: unknown) {
  if (!isObject(prop)) {
    return prop;
  }

  let hasKeys = false;
  const result: Record<string, unknown> = {};
  Object.entries(prop).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = value;
      hasKeys = true;
    }
  });

  return hasKeys ? result : undefined;
}
