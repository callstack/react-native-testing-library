import { configure, getConfig, resetToDefaults } from '../config';
import { _console } from '../helpers/logger';

beforeEach(() => {
  resetToDefaults();
  jest.spyOn(_console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('getConfig() returns existing configuration', () => {
  expect(getConfig().asyncUtilTimeout).toEqual(1000);
  expect(getConfig().defaultIncludeHiddenElements).toEqual(false);
});

test('configure() overrides existing config values', () => {
  configure({ asyncUtilTimeout: 5000 });
  configure({ defaultDebugOptions: { message: 'debug message' } });
  expect(getConfig()).toEqual({
    asyncUtilTimeout: 5000,
    defaultDebugOptions: { message: 'debug message' },
    defaultIncludeHiddenElements: false,
  });
});

test('resetToDefaults() resets config to defaults', () => {
  configure({
    asyncUtilTimeout: 5000,
    defaultIncludeHiddenElements: true,
  });
  expect(getConfig().asyncUtilTimeout).toEqual(5000);
  expect(getConfig().defaultIncludeHiddenElements).toEqual(true);

  resetToDefaults();
  expect(getConfig().asyncUtilTimeout).toEqual(1000);
  expect(getConfig().defaultIncludeHiddenElements).toEqual(false);
});

test('resetToDefaults() resets internal config to defaults', () => {
  configure({ asyncUtilTimeout: 2000 });
  expect(getConfig().asyncUtilTimeout).toBe(2000);

  resetToDefaults();
  expect(getConfig().asyncUtilTimeout).toBe(1000);
});

test('configure handles alias option defaultHidden', () => {
  expect(getConfig().defaultIncludeHiddenElements).toEqual(false);

  configure({ defaultHidden: true });
  expect(getConfig().defaultIncludeHiddenElements).toEqual(true);
});

test('does not warn when no options are passed', () => {
  configure({});

  expect(_console.warn).not.toHaveBeenCalled();
});

test('does not warn when only valid options are passed', () => {
  configure({
    asyncUtilTimeout: 2000,
    defaultIncludeHiddenElements: true,
    defaultDebugOptions: { message: 'test' },
    defaultHidden: false,
  });

  expect(_console.warn).not.toHaveBeenCalled();
});

test('warns when unknown option is passed', () => {
  configure({ unknownOption: 'value' } as any);

  expect(_console.warn).toHaveBeenCalledTimes(1);
  const warningMessage = jest.mocked(_console.warn).mock.calls[0][0];
  expect(warningMessage).toContain('Unknown option(s) passed to configure: unknownOption');
  expect(warningMessage).toContain('config.test.ts');
});

test('warns when multiple unknown options are passed', () => {
  configure({ asyncUtilTimeout: 1000, unknown1: 'value1', unknown2: 'value2' } as any);

  expect(_console.warn).toHaveBeenCalledTimes(1);
  const warningMessage = jest.mocked(_console.warn).mock.calls[0][0];
  expect(warningMessage).toContain('Unknown option(s) passed to configure: unknown1, unknown2');
  expect(warningMessage).toContain('config.test.ts');
});

test('still configures correctly when unknown options are passed', () => {
  configure({ asyncUtilTimeout: 3000, unknownOption: 'value' } as any);

  expect(_console.warn).toHaveBeenCalledTimes(1);
  expect(getConfig().asyncUtilTimeout).toBe(3000);
});
