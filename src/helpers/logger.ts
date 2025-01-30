import chalk from 'chalk';
import * as nodeConsole from 'console';
import redent from 'redent';
import * as nodeUtil from 'util';
import { getConfig } from '../config';

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

export const debugLogger = {
  debug(message: unknown, ...args: unknown[]) {
    if (getConfig().debug) {
      logger.debug(message, ...args);
    }
  },

  info(message: unknown, ...args: unknown[]) {
    if (getConfig().debug) {
      logger.info(message, ...args);
    }
  },

  warn(message: unknown, ...args: unknown[]) {
    if (getConfig().debug) {
      logger.warn(message, ...args);
    }
  },

  error(message: unknown, ...args: unknown[]) {
    if (getConfig().debug) {
      logger.error(message, ...args);
    }
  },
};

function formatMessage(symbol: string, message: unknown, ...args: unknown[]) {
  const formatted = nodeUtil.format(message, ...args);
  const indented = redent(formatted, 4);
  return `  ${symbol} ${indented.trimStart()}\n`;
}
