import { DebugOptions } from './helpers/debugDeep';

export type Config = {
  /** Default timeout, in ms, for `waitFor` and `findBy*` queries. */
  asyncUtilTimeout: number;

  /** Default includeHiddenElements value for all queries */
  defaultIncludeHiddenElements: boolean;

  /** Default options for `debug` helper. */
  defaultDebugOptions?: Partial<DebugOptions>;
};

export type ConfigAliasOptions = {
  /** Default hidden value for all queries, alias to defaultIncludeHiddenElements to respect react-testing-library API
   * WARNING: if both defaultHidden and defaultIncludeHiddenElements values are defined,
   * then defaultIncludeHiddenElements will take precedence
   */
  defaultHidden: boolean;
};

const defaultConfig: Config = {
  asyncUtilTimeout: 1000,
  defaultIncludeHiddenElements: true,
};

let config = { ...defaultConfig };

export function configure(options: Partial<Config & ConfigAliasOptions>) {
  const { defaultHidden, ...restOptions } = options;

  const defaultIncludeHiddenElements =
    restOptions.defaultIncludeHiddenElements ??
    defaultHidden ??
    config.defaultIncludeHiddenElements;

  const optionsToSet = {
    ...restOptions,
    defaultIncludeHiddenElements,
  };

  config = {
    ...config,
    ...optionsToSet,
  };
}

export function resetToDefaults() {
  config = { ...defaultConfig };
}

export function getConfig() {
  return config;
}
