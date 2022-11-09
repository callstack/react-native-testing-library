import { getConfig, configure, resetToDefaults } from '../config';

beforeEach(() => {
  resetToDefaults();
});

test('getConfig() returns existing configuration', () => {
  expect(getConfig().asyncUtilTimeout).toEqual(1000);
});

test('configure() overrides existing config values', () => {
  configure({ asyncUtilTimeout: 5000 });
  configure({ defaultDebugOptions: { message: 'debug message' } });
  expect(getConfig()).toEqual({
    asyncUtilTimeout: 5000,
    defaultDebugOptions: { message: 'debug message' },
    defaultHidden: true,
    defaultIncludeHidden: true,
  });
});

test('resetToDefaults() resets config to defaults', () => {
  configure({
    asyncUtilTimeout: 5000,
    defaultIncludeHidden: false,
    defaultHidden: false,
  });
  expect(getConfig().asyncUtilTimeout).toEqual(5000);
  expect(getConfig().defaultHidden).toEqual(false);
  expect(getConfig().defaultIncludeHidden).toEqual(false);

  resetToDefaults();
  expect(getConfig().asyncUtilTimeout).toEqual(1000);
  expect(getConfig().defaultHidden).toEqual(true);
  expect(getConfig().defaultIncludeHidden).toEqual(true);
});
