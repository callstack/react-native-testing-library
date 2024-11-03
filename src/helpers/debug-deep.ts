import type { JsonNode } from 'universal-test-renderer/dist/index.d.ts';
import format, { FormatOptions } from './format';

export type DebugOptions = {
  message?: string;
} & FormatOptions;

/**
 * Log pretty-printed deep test component instance
 */
export default function debugDeep(
  instance: JsonNode | JsonNode[],
  options?: DebugOptions | string,
) {
  const message = typeof options === 'string' ? options : options?.message;

  const formatOptions = typeof options === 'object' ? { mapProps: options?.mapProps } : undefined;

  if (message) {
    // eslint-disable-next-line no-console
    console.log(`${message}\n\n`, format(instance, formatOptions));
  } else {
    // eslint-disable-next-line no-console
    console.log(format(instance, formatOptions));
  }
}
