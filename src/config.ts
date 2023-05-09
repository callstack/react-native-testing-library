import { DebugOptions } from './helpers/debugDeep';

/**
 * Global configuration options for React Native Testing Library.
 */

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

export type HostComponentNames = {
  text: string;
  textInput: string;
  switch: string;
};

export type InternalConfig = Config & {
  /** Names for key React Native host components. */
  hostComponentNames?: HostComponentNames;
};

const defaultConfig: InternalConfig = {
  asyncUtilTimeout: 1000,
  defaultIncludeHiddenElements: false,
};

let config = { ...defaultConfig };

/**
 * Configure global options for React Native Testing Library.
 */
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

export function configureInternal(option: Partial<InternalConfig>) {
  config = {
    ...config,
    ...option,
  };
}

export function resetToDefaults() {
  config = { ...defaultConfig };
}

export function getConfig() {
  return config;
}
