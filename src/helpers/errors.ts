import prettyFormat from 'pretty-format';

export class ErrorWithStack extends Error {
  constructor(message: string | undefined, callsite: Function) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, callsite);
    }
  }
}

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
