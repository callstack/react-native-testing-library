import { DebugOptions } from './helpers/debugDeep';

/**
 * Global configuration options for React Native Testing Library.
 */

export type HostComponentNames = {
  text: string;
  textInput: string;
};

export type Config = {
  /** Default timeout, in ms, for `waitFor` and `findBy*` queries. */
  asyncUtilTimeout: number;

  /** Default value for `includeHiddenElements` query option. */
  defaultIncludeHiddenElements: boolean;

  /** Default options for `debug` helper. */
  defaultDebugOptions?: Partial<DebugOptions>;

  /** Option to return composite components */
  useLegacyQueries: boolean;

  /** Host component names used for queries */
  hostComponentNames: HostComponentNames;
};

export type ConfigAliasOptions = {
  /** RTL-compatibility alias to `defaultIncludeHiddenElements` */
  defaultHidden: boolean;
};

export type InternalConfig = Config & {
  /** Whether to use breaking changes intended for next major version release. */
  useBreakingChanges: boolean;
};

const defaultConfig: InternalConfig = {
  useBreakingChanges: false,
  asyncUtilTimeout: 1000,
  defaultIncludeHiddenElements: true,
  useLegacyQueries: false,
  hostComponentNames: { text: 'Text', textInput: 'TextInput' },
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
