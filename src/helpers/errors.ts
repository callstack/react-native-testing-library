import prettyFormat from 'pretty-format';

export class ErrorWithStack extends Error {
  constructor(message: string | undefined, callsite: Function) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, callsite);
    }
  }
}

export const createLibraryNotSupportedError = (error: unknown): Error =>
  new Error(
    `Currently the only supported library to search by text is "react-native".\n\n${
      error instanceof Error ? error.message : ''
    }`
  );

export const prepareErrorMessage = (
  // TS states that error caught in a catch close are of type `unknown`
  // most real cases will be `Error`, but better safe than sorry
  error: unknown,
  name?: string,
  value?: unknown
): string => {
  let errorMessage: string;
  if (error instanceof Error) {
    // Strip info about custom predicate
    errorMessage = error.message.replace(
      / matching custom predicate[^]*/gm,
      ''
    );
  } else if (error && typeof error === 'object') {
    errorMessage = error.toString();
  } else {
    errorMessage = 'Caught unknown error';
  }

  if (name && value) {
    errorMessage += ` with ${name} ${prettyFormat(value, { min: true })}`;
  }
  return errorMessage;
};

export const createQueryByError = (
  error: unknown,
  callsite: Function
): null => {
  if (error instanceof Error) {
    if (error.message.includes('No instances found')) {
      return null;
    }
    throw new ErrorWithStack(error.message, callsite);
  }

  throw new ErrorWithStack(
    // generic refining of `unknown` is very hard, you cannot do `'toString' in error` or anything like that
    // Converting as any with extra safe optional chaining will do the job just as well
    `Query: caught unknown error type: ${typeof error}, value: ${(
      error as any
    )?.toString?.()}`,
    callsite
  );
};

export function copyStackTrace(target: unknown, stackTraceSource: Error) {
  if (target instanceof Error && stackTraceSource.stack) {
    target.stack = stackTraceSource.stack.replace(
      stackTraceSource.message,
      target.message
    );
  }
}

const warned: { [functionName: string]: boolean } = {};

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
