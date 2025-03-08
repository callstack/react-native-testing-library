import type { JsonNode } from 'universal-test-renderer';

import type { FormatElementOptions } from './format-element';
import { formatJson } from './format-element';
import { logger } from './logger';

export type DebugOptions = {
  message?: string;
} & FormatElementOptions;

/**
 * Log pretty-printed deep test component instance
 */
export function debug(instance: JsonNode | JsonNode[], options?: DebugOptions) {
  const message = options?.message;
  const formatOptions = { mapProps: options?.mapProps };

  if (message) {
    logger.info(`${message}\n\n`, formatJson(instance, formatOptions));
  } else {
    logger.info(formatJson(instance, formatOptions));
  }
}
