import {
  getConfig,
  configure,
  resetToDefaults,
  configureInternal,
} from '../config';

beforeEach(() => {
  resetToDefaults();
});

test('getConfig() returns existing configuration', () => {
  expect(getConfig().allowBreakingChanges).toEqual(false);
  expect(getConfig().asyncUtilTimeout).toEqual(1000);
  expect(getConfig().defaultIncludeHiddenElements).toEqual(true);
});

test('configure() overrides existing config values', () => {
  configure({ asyncUtilTimeout: 5000 });
  configure({ defaultDebugOptions: { message: 'debug message' } });
  expect(getConfig()).toEqual({
    asyncUtilTimeout: 5000,
    defaultDebugOptions: { message: 'debug message' },
    defaultIncludeHiddenElements: true,
    allowBreakingChanges: false,
  });
});

test('resetToDefaults() resets config to defaults', () => {
  configure({
    asyncUtilTimeout: 5000,
    defaultIncludeHiddenElements: false,
  });
  expect(getConfig().asyncUtilTimeout).toEqual(5000);
  expect(getConfig().defaultIncludeHiddenElements).toEqual(false);

  resetToDefaults();
  expect(getConfig().asyncUtilTimeout).toEqual(1000);
  expect(getConfig().defaultIncludeHiddenElements).toEqual(true);
});

test('resetToDefaults() resets internal config to defaults', () => {
  configureInternal({
    allowBreakingChanges: true,
  });
  expect(getConfig().allowBreakingChanges).toEqual(true);

  resetToDefaults();
  expect(getConfig().allowBreakingChanges).toEqual(false);
});

test('configure handles alias option defaultHidden', () => {
  expect(getConfig().defaultIncludeHiddenElements).toEqual(true);

  configure({ defaultHidden: false });
  expect(getConfig().defaultIncludeHiddenElements).toEqual(false);
});
