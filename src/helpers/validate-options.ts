import { ErrorWithStack } from './errors';
import { logger } from './logger';

/**
 * Validates that no unknown options are passed to a function.
 * Logs a warning if unknown options are found.
 *
 * @param functionName - The name of the function being called (for error messages)
 * @param restOptions - The rest object from destructuring that contains unknown options
 * @param _callsite - The function where the validation is called from (unused, kept for API compatibility)
 */
export function validateOptions(
  functionName: string,
  restOptions: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  _callsite: Function,
): void {
  const unknownKeys = Object.keys(restOptions);
  if (unknownKeys.length > 0) {
    // Pass validateOptions as callsite so the stack trace shows where the function (e.g., render) was called from
    const stackTraceError = new ErrorWithStack('STACK_TRACE_ERROR', validateOptions);
    const stackTrace = stackTraceError.stack
      ? `\n\n${stackTraceError.stack.split('\n').slice(1).join('\n')}`
      : '';
    logger.warn(
      `Unknown option(s) passed to ${functionName}: ${unknownKeys.join(', ')}${stackTrace}`,
    );
  }
}
