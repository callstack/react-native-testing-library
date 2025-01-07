import * as nodeConsole from 'console';
import pc from 'picocolors';
import redent from 'redent';
import * as nodeUtil from 'util';

import { getConfig } from '../config';

export const _console = {
  debug: nodeConsole.debug,
  info: nodeConsole.info,
  warn: nodeConsole.warn,
  error: nodeConsole.error,
};

export const logger = {
  debug(message: unknown, ...args: unknown[]) {
    if (getConfig().debug) {
      const output = formatMessage('●', message, ...args);
      _console.debug(pc.dim(output));
    }
  },

  info(message: unknown, ...args: unknown[]) {
    const output = formatMessage('●', message, ...args);
    _console.info(output);
  },

  warn(message: unknown, ...args: unknown[]) {
    const output = formatMessage('▲', message, ...args);
    _console.warn(pc.yellow(output));
  },

  error(message: unknown, ...args: unknown[]) {
    const output = formatMessage('■', message, ...args);
    _console.error(pc.red(output));
  },
};

function formatMessage(symbol: string, message: unknown, ...args: unknown[]) {
  const formatted = nodeUtil.format(message, ...args);
  const indented = redent(formatted, 4);
  return `  ${symbol} ${indented.trimStart()}\n`;
}
