import * as nodeConsole from 'console';
import * as nodeUtil from 'util';
import chalk from 'chalk';

export const logger = {
  debug(message: any, ...args: any[]) {
    const output = nodeUtil.format('RNTL: ', message, ...args);
    nodeConsole.debug(chalk.dim(output));
  },

  info(message: any, ...args: any[]) {
    const output = nodeUtil.format('RNTL: ', message, ...args);
    nodeConsole.info(output);
  },

  warn(message: any, ...args: any[]) {
    const output = nodeUtil.format('RNTL: ', message, ...args);
    nodeConsole.warn(chalk.yellow(output));
  },

  error(message: any, ...args: any[]) {
    const output = nodeUtil.format('RNTL: ', message, ...args);
    nodeConsole.error(chalk.red(output));
  },
};
