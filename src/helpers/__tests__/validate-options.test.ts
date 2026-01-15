import { _console } from '../logger';
import { validateOptions } from '../validate-options';

beforeEach(() => {
  jest.spyOn(_console, 'warn').mockImplementation(() => {});
});

test('does not warn when rest object is empty', () => {
  validateOptions('testFunction', {});

  expect(_console.warn).not.toHaveBeenCalled();
});

test('warns when unknown option is passed', () => {
  validateOptions('testFunction', { unknownOption: 'value' });

  expect(_console.warn).toHaveBeenCalledTimes(1);
  expect(jest.mocked(_console.warn).mock.calls[0][0]).toMatchInlineSnapshot(`
    "  ▲ Unknown option(s) passed to testFunction: unknownOption
    "
  `);
});

test('warns when multiple unknown options are passed', () => {
  validateOptions('testFunction', { option1: 'value1', option2: 'value2', option3: 'value3' });

  expect(_console.warn).toHaveBeenCalledTimes(1);
  expect(jest.mocked(_console.warn).mock.calls[0][0]).toMatchInlineSnapshot(`
    "  ▲ Unknown option(s) passed to testFunction: option1, option2, option3
    "
  `);
});

test('warns with correct function name', () => {
  validateOptions('render', { invalid: true });

  expect(_console.warn).toHaveBeenCalledTimes(1);
  expect(jest.mocked(_console.warn).mock.calls[0][0]).toContain('render');
});
