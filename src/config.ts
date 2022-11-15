import { DebugOptions } from './helpers/debugDeep';

export type Config = {
  /** Default timeout, in ms, for `waitFor` and `findBy*` queries. */
  asyncUtilTimeout: number;

  /** Default value for `includeHiddenElements` query option. */
  defaultIncludeHiddenElements: boolean;

  /** Default options for `debug` helper. */
  defaultDebugOptions?: Partial<DebugOptions>;
};

export type ConfigAliasOptions = {
  /** RTL-compatibility alias to `defaultIncludeHiddenElements` */
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

  config = {
    ...config,
    ...restOptions,
    defaultIncludeHiddenElements,
  };
}

export function resetToDefaults() {
  config = { ...defaultConfig };
}

export function getConfig() {
  return config;
}
