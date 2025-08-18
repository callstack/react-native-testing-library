import { _console, logger } from '../logger';

beforeEach(() => {
  jest.spyOn(_console, 'debug').mockImplementation(() => {});
  jest.spyOn(_console, 'info').mockImplementation(() => {});
  jest.spyOn(_console, 'warn').mockImplementation(() => {});
  jest.spyOn(_console, 'error').mockImplementation(() => {});
});

test('debug should call console.debug', () => {
  logger.debug('test message');

  expect(_console.debug).toHaveBeenCalledTimes(1);
  expect(_console.debug).toHaveBeenCalledWith(expect.any(String));
});

test('should call console.info', () => {
  logger.info('info message');

  expect(_console.info).toHaveBeenCalledTimes(1);
  expect(_console.info).toHaveBeenCalledWith(expect.any(String));
});

test('should call console.warn', () => {
  logger.warn('warning message');

  expect(_console.warn).toHaveBeenCalledTimes(1);
  expect(_console.warn).toHaveBeenCalledWith(expect.any(String));
});

test('should call console.error', () => {
  logger.error('error message');

  expect(_console.error).toHaveBeenCalledTimes(1);
  expect(_console.error).toHaveBeenCalledWith(expect.any(String));
});
