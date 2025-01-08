import * as nodeConsole from 'console';
import * as nodeUtil from 'util';
import chalk from 'chalk';
import redent from 'redent';

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
