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

const warned = {
  getByName: false,
  getAllByName: false,
  queryByName: false,
  queryAllByName: false,
};

export const logDeprecationWarning = (
  deprecatedFnName: string,
  alternativeFnName: string
) => {
  if (warned[deprecatedFnName]) {
    return;
  }
  console.warn(`Deprecation Warning:

  "${deprecatedFnName}" is deprecated and will be removed in next major release. Please use "${alternativeFnName}" instead.

  Docs: https://github.com/callstack/react-native-testing-library#${alternativeFnName.toLowerCase()}-type-reactcomponenttype
    `);

  warned[deprecatedFnName] = true;
};

export const prepareErrorMessage = (error: Error) =>
  // Strip info about custom predicate
  error.message.replace(/ matching custom predicate[^]*/gm, '');

export const createQueryByError = (error: Error, callsite: Function) => {
  if (error.message.includes('No instances found')) {
    return null;
  }
  throw new ErrorWithStack(error.message, callsite);
};
