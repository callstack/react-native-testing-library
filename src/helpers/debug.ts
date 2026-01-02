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
export function debug(
  node: JsonNode | JsonNode[],
  { message, ...formatOptions }: DebugOptions = {},
) {
  if (message) {
    logger.info(`${message}\n\n`, formatJson(node, formatOptions));
  } else {
    logger.info(formatJson(node, formatOptions));
  }
}
