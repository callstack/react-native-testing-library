import type { ReactTestRendererJSON } from 'react-test-renderer';
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
  instance: ReactTestRendererJSON | ReactTestRendererJSON[],
  options: DebugOptions | string = {},
) {
  const { message, ...formatOptions } =
    typeof options === 'string' ? { message: options } : options;

  if (message) {
    logger.info(`${message}\n\n`, formatJson(instance, formatOptions));
  } else {
    logger.info(formatJson(instance, formatOptions));
  }
}
