import { logger } from './logger';

/**
 * Validates that no unknown options are passed to a function.
 * Logs a warning if unknown options are found.
 *
 * @param functionName - The name of the function being called (for error messages)
 * @param restOptions - The rest object from destructuring that contains unknown options
 */
export function validateOptions(functionName: string, restOptions: Record<string, unknown>): void {
  const unknownKeys = Object.keys(restOptions);
  if (unknownKeys.length > 0) {
    logger.warn(`Unknown option(s) passed to ${functionName}: ${unknownKeys.join(', ')}`);
  }
}
