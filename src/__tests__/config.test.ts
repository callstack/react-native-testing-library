import {
  getConfig,
  configure,
  resetToDefaults,
  configureInternal,
} from '../config';

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
  configureInternal({
    hostComponentNames: { text: 'A', textInput: 'A', switch: 'A' },
  });
  expect(getConfig().hostComponentNames).toEqual({
    text: 'A',
    textInput: 'A',
    switch: 'A',
  });

  resetToDefaults();
  expect(getConfig().hostComponentNames).toBe(undefined);
});

test('configure handles alias option defaultHidden', () => {
  expect(getConfig().defaultIncludeHiddenElements).toEqual(false);

  configure({ defaultHidden: true });
  expect(getConfig().defaultIncludeHiddenElements).toEqual(true);
});
