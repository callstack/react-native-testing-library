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
  Use of ${functionName} is not recommended and will be deleted in future versions of react-native-testing-library.
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
