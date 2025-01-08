import type { ReactTestRendererJSON } from 'react-test-renderer';
import type { FormatOptions } from './format';
import format from './format';
import { logger } from './logger';

export type DebugOptions = {
  message?: string;
} & FormatOptions;

/**
 * Log pretty-printed deep test component instance
 */
export function debug(
  instance: ReactTestRendererJSON | ReactTestRendererJSON[],
  options?: DebugOptions | string,
) {
  const message = typeof options === 'string' ? options : options?.message;

  const formatOptions = typeof options === 'object' ? { mapProps: options?.mapProps } : undefined;

  if (message) {
    logger.info(`${message}\n\n`, format(instance, formatOptions));
  } else {
    logger.info(format(instance, formatOptions));
  }
}
