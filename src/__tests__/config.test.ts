import {
  getConfig,
  configure,
  resetToDefaults,
  configureInternal,
} from '../config';

test('getConfig() returns existing configuration', () => {
  expect(getConfig().useBreakingChanges).toEqual(false);
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
    useBreakingChanges: false,
    useLegacyQueries: true,
    hostComponentNames: {
      text: 'Text',
      textInput: 'TextInput',
    },
  });
});

test('resetToDefaults() resets config to defaults', () => {
  configure({
    asyncUtilTimeout: 5000,
    defaultIncludeHiddenElements: false,
    useLegacyQueries: false,
  });
  expect(getConfig().asyncUtilTimeout).toEqual(5000);
  expect(getConfig().defaultIncludeHiddenElements).toEqual(false);
  expect(getConfig().useLegacyQueries).toBe(false);

  resetToDefaults();
  expect(getConfig().asyncUtilTimeout).toEqual(1000);
  expect(getConfig().defaultIncludeHiddenElements).toEqual(true);
  expect(getConfig().useLegacyQueries).toBe(true);
});

test('resetToDefaults() resets internal config to defaults', () => {
  configureInternal({
    useBreakingChanges: true,
  });
  expect(getConfig().useBreakingChanges).toEqual(true);

  resetToDefaults();
  expect(getConfig().useBreakingChanges).toEqual(false);
});

test('configure handles alias option defaultHidden', () => {
  expect(getConfig().defaultIncludeHiddenElements).toEqual(true);

  configure({ defaultHidden: false });
  expect(getConfig().defaultIncludeHiddenElements).toEqual(false);
});

test('configure handles hostComponentNames', () => {
  expect(getConfig().hostComponentNames).toEqual({
    text: 'Text',
    textInput: 'TextInput',
  });

  configure({
    hostComponentNames: { text: 'RCText', textInput: 'RCTextInput' },
  });
  expect(getConfig().hostComponentNames).toEqual({
    text: 'RCText',
    textInput: 'RCTextInput',
  });
});
