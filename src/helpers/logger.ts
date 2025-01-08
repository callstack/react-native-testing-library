import chalk from 'chalk';
import * as nodeConsole from 'console';
import redent from 'redent';
import * as nodeUtil from 'util';

export const logger = {
  debug(message: unknown, ...args: unknown[]) {
    const output = formatMessage('●', message, ...args);
    nodeConsole.debug(chalk.dim(output));
  },

  info(message: unknown, ...args: unknown[]) {
    const output = formatMessage('●', message, ...args);
    nodeConsole.info(output);
  },

  warn(message: unknown, ...args: unknown[]) {
    const output = formatMessage('▲', message, ...args);
    nodeConsole.warn(chalk.yellow(output));
  },

  error(message: unknown, ...args: unknown[]) {
    const output = formatMessage('■', message, ...args);
    nodeConsole.error(chalk.red(output));
  },
};

function formatMessage(symbol: string, message: unknown, ...args: unknown[]) {
  const formatted = nodeUtil.format(message, ...args);
  const indented = redent(formatted, 4);
  return `  ${symbol} ${indented.trimStart()}\n`;
}
