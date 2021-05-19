// @flow
import prettyFormat from 'pretty-format';

export class ErrorWithStack extends Error {
  constructor(message: ?string, callsite: Function) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, callsite);
    }
  }
}

export const createLibraryNotSupportedError = (error: Error): Error =>
  new Error(
    `Currently the only supported library to search by text is "react-native".\n\n${error.message}`
  );

export const prepareErrorMessage = (
  error: Error,
  name: ?string,
  value: ?mixed
): string => {
  // Strip info about custom predicate
  let errorMessage = error.message.replace(
    / matching custom predicate[^]*/gm,
    ''
  );

  if (name && value) {
    errorMessage += ` with ${name} ${prettyFormat(value, { min: true })}`;
  }
  return errorMessage;
};

export const createQueryByError = (error: Error, callsite: Function): null => {
  if (error.message.includes('No instances found')) {
    return null;
  }
  throw new ErrorWithStack(error.message, callsite);
};

export function copyStackTrace(target: Error, stackTraceSource: Error) {
  target.stack = stackTraceSource.stack.replace(
    stackTraceSource.message,
    target.message
  );
}

const warned = {};

export function printDeprecationWarning(functionName: string) {
  if (warned[functionName]) {
    return;
  }

  // eslint-disable-next-line no-console
  console.warn(`
  Deprecation Warning:
  Use of ${functionName} is not recommended and will be deleted in future versions of @testing-library/react-native.
  `);

  warned[functionName] = true;
}

export function throwRemovedFunctionError(
  functionName: string,
  docsRef: string
) {
  throw new Error(
    `"${functionName}" has been removed.\n\nPlease consult: https://callstack.github.io/react-native-testing-library/docs/${docsRef}`
  );
}

export function throwRenamedFunctionError(
  functionName: string,
  newFunctionName: string
) {
  throw new ErrorWithStack(
    `The "${functionName}" function has been renamed to "${newFunctionName}". Please replace all occurrences.`,
    throwRenamedFunctionError
  );
}
