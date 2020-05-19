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

const warned = {};

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

export function throwRemovedFunctionError(
  functionName: string,
  docsRef: string
) {
  throw new Error(
    `${functionName} has been removed in version 2.0.\n\nPlease consult: https://callstack.github.io/react-native-testing-library/docs/${docsRef}`
  );
}
