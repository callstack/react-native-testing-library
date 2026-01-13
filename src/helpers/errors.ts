export class ErrorWithStack extends Error {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  constructor(message: string | undefined, callsite: Function) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, callsite);
    }
  }
}

export function copyStackTraceIfNeeded(target: unknown, stackTraceSource: Error | undefined) {
  if (stackTraceSource != null && target instanceof Error && stackTraceSource.stack) {
    target.stack = stackTraceSource.stack.replace(stackTraceSource.message, target.message);
  }
}
