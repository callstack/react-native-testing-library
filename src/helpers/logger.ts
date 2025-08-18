import * as nodeConsole from 'console';
import pc from 'picocolors';
import redent from 'redent';
import * as nodeUtil from 'util';

export const logger = {
  debug(message: unknown, ...args: unknown[]) {
    const output = formatMessage('●', message, ...args);
    nodeConsole.debug(pc.dim(output));
  },

  info(message: unknown, ...args: unknown[]) {
    const output = formatMessage('●', message, ...args);
    nodeConsole.info(output);
  },

  warn(message: unknown, ...args: unknown[]) {
    const output = formatMessage('▲', message, ...args);
    nodeConsole.warn(pc.yellow(output));
  },

  error(message: unknown, ...args: unknown[]) {
    const output = formatMessage('■', message, ...args);
    nodeConsole.error(pc.red(output));
  },
};

function formatMessage(symbol: string, message: unknown, ...args: unknown[]) {
  const formatted = nodeUtil.format(message, ...args);
  const indented = redent(formatted, 4);
  return `  ${symbol} ${indented.trimStart()}\n`;
}
