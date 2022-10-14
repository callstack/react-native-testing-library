import { getConfig, configure, resetToDefaults } from '../config';

beforeEach(() => {
  resetToDefaults();
});

test('getConfig() returns existing configuration', () => {
  expect(getConfig().asyncUtilTimeout).toEqual(1000);
});

test('configure() overrides existing config values', () => {
  configure({ asyncUtilTimeout: 5000 });
  configure({ debugOptions: { message: 'debug message' } });
  expect(getConfig()).toEqual({
    asyncUtilTimeout: 5000,
    debugOptions: { message: 'debug message' },
  });
});

test('resetToDefaults() resets config to defaults', () => {
  configure({ asyncUtilTimeout: 5000 });
  expect(getConfig().asyncUtilTimeout).toEqual(5000);

  resetToDefaults();
  expect(getConfig().asyncUtilTimeout).toEqual(1000);
});
