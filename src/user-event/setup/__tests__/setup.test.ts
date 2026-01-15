import { _console } from '../../../helpers/logger';
import { setup } from '../setup';

beforeEach(() => {
  jest.spyOn(_console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('creates instance when no options are passed', () => {
  const instance = setup();

  expect(instance).toBeDefined();
  expect(_console.warn).not.toHaveBeenCalled();
});

test('creates instance with valid options', () => {
  const instance = setup({ delay: 100, advanceTimers: jest.fn() });

  expect(instance).toBeDefined();
  expect(instance.config.delay).toBe(100);
  expect(_console.warn).not.toHaveBeenCalled();
});

test('warns when unknown option is passed', () => {
  setup({ unknownOption: 'value' } as any);

  expect(_console.warn).toHaveBeenCalledTimes(1);
  expect(jest.mocked(_console.warn).mock.calls[0][0]).toContain(
    'Unknown option(s) passed to userEvent.setup: unknownOption',
  );
});
