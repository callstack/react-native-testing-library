// @flow
export class ErrorWithStack extends Error {
  constructor(message: ?string, callsite: Function) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, callsite);
    }
  }
}

export const createLibraryNotSupportedError = (error: Error) =>
  new Error(
    `Currently the only supported library to search by text is "react-native".\n\n${error.message}`
  );

export const prepareErrorMessage = (error: Error) =>
  // Strip info about custom predicate
  error.message.replace(/ matching custom predicate[^]*/gm, '');

export const createQueryByError = (error: Error, callsite: Function) => {
  if (error.message.includes('No instances found')) {
    return null;
  }
  throw new ErrorWithStack(error.message, callsite);
};

const warned = {
  UNSAFE_getByProps: false,
  UNSAFE_getAllByProps: false,
  UNSAFE_queryByProps: false,
  UNSAFE_queryAllByProps: false,

  UNSAFE_getByType: false,
  UNSAFE_getAllByType: false,
  UNSAFE_queryByType: false,
  UNSAFE_queryAllByType: false,
};

export function printUnsafeWarning(functionName: string) {
  if (warned[functionName]) {
    return;
  }

  console.warn(`
  Warning:
  ${functionName} promotes testing implementation details and is not recommended.
  It may be removed it in the future. Please test observable outcomes of rendering components.
  `);

  warned[functionName] = true;
}
