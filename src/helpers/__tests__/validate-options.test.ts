import { _console } from '../logger';
import { validateOptions } from '../validate-options';

function testFunction() {
  // Test function for callsite
}

beforeEach(() => {
  jest.spyOn(_console, 'warn').mockImplementation(() => {});
});

test('does not warn when rest object is empty', () => {
  validateOptions('testFunction', {}, testFunction);

  expect(_console.warn).not.toHaveBeenCalled();
});

test('warns when unknown option is passed', () => {
  function testFunctionWithCall() {
    validateOptions('testFunction', { unknownOption: 'value' }, testFunctionWithCall);
  }
  testFunctionWithCall();

  expect(_console.warn).toHaveBeenCalledTimes(1);
  const warningMessage = jest.mocked(_console.warn).mock.calls[0][0];
  expect(warningMessage).toContain('Unknown option(s) passed to testFunction: unknownOption');
  expect(warningMessage).toContain('validate-options.test.ts');
});

test('warns when multiple unknown options are passed', () => {
  function testFunctionWithCall() {
    validateOptions(
      'testFunction',
      { option1: 'value1', option2: 'value2', option3: 'value3' },
      testFunctionWithCall,
    );
  }
  testFunctionWithCall();

  expect(_console.warn).toHaveBeenCalledTimes(1);
  const warningMessage = jest.mocked(_console.warn).mock.calls[0][0];
  expect(warningMessage).toContain(
    'Unknown option(s) passed to testFunction: option1, option2, option3',
  );
  expect(warningMessage).toContain('validate-options.test.ts');
});

test('warns with correct function name and includes stack trace', () => {
  function render() {
    validateOptions('render', { invalid: true }, render);
  }
  render();

  expect(_console.warn).toHaveBeenCalledTimes(1);
  const warningMessage = jest.mocked(_console.warn).mock.calls[0][0];
  expect(warningMessage).toContain('render');
  expect(warningMessage).toContain('validate-options.test.ts');
});
