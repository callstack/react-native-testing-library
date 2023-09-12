export function pick<T extends {}>(object: T, keys: (keyof T)[]): Partial<T> {
  const result: Partial<T> = {};
  keys.forEach((key) => {
    if (object[key] !== undefined) {
      result[key] = object[key];
    }
  });

  return result;
}
