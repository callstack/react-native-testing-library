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
  getByName: false,
  getAllByName: false,
  queryByName: false,
  queryAllByName: false,

  getByProps: false,
  getAllByProps: false,
  queryByProps: false,
  queryAllByProps: false,

  getByType: false,
  getAllByType: false,
  queryByType: false,
  queryAllByType: false,
};

export function printDeprecationWarning(functionName: string) {
  if (warned[functionName]) {
    return;
  }

  console.warn(`
  Deprecation Warning:
  ${functionName} is not recommended for use and will be deleted in react-native-testing-library 2.x.
  `);

  warned[functionName] = true;
}

export function printUnsafeWarning(functionName: string) {
  if (warned[functionName]) {
    return;
  }

  console.warn(`
  Deprecation Warning:
  ${functionName} is not recommended for use and has been renamed to UNSAFE_${functionName}.
  In react-native-testing-library 2.x only the UNSAFE_${functionName} name will work.
  `);

  warned[functionName] = true;
}
