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
  expect(jest.mocked(_console.debug).mock.calls[0][0]).toMatchInlineSnapshot(`
    "  ● test message
    "
  `);
});

test('should call console.info', () => {
  logger.info('info message');

  expect(_console.info).toHaveBeenCalledTimes(1);
  expect(jest.mocked(_console.info).mock.calls[0][0]).toMatchInlineSnapshot(`
    "  ● info message
    "
  `);
});

test('should call console.warn', () => {
  logger.warn('warning message');

  expect(_console.warn).toHaveBeenCalledTimes(1);
  expect(jest.mocked(_console.warn).mock.calls[0][0]).toMatchInlineSnapshot(`
    "  ▲ warning message
    "
  `);
});

test('should call console.error', () => {
  logger.error('error message');

  expect(_console.error).toHaveBeenCalledTimes(1);
  expect(jest.mocked(_console.error).mock.calls[0][0]).toMatchInlineSnapshot(`
    "  ■ error message
    "
  `);
});
