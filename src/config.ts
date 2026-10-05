import type { DebugOptions } from './helpers/debug';
import { validateOptions } from './helpers/validate-options';

/**
 * Global configuration options for React Native Testing Library.
 */

export type Config = {
  /** Default timeout, in ms, for `waitFor` and `findBy*` queries. */
  asyncUtilTimeout: number;

  /** Default value for `includeHiddenElements` query option. */
  defaultIncludeHiddenElements: boolean;

  /**
   * Warn when `fireEvent` calls no handler, because the target is disabled or
   * no element handles the event. Set to `false` to opt out.
   */
  warnOnUnhandledEvent: boolean;

  /** Default options for `debug` helper. */
  defaultDebugOptions?: Partial<DebugOptions>;
};

export type ConfigAliasOptions = {
  /** RTL-compatibility alias to `defaultIncludeHiddenElements` */
  defaultHidden: boolean;
};

const defaultConfig: Config = {
  asyncUtilTimeout: 1000,
  defaultIncludeHiddenElements: false,
  warnOnUnhandledEvent: true,
};

let config = { ...defaultConfig };

/**
 * Configure global options for React Native Testing Library.
 */
export function configure(options: Partial<Config & ConfigAliasOptions>) {
  const {
    asyncUtilTimeout,
    defaultDebugOptions,
    defaultHidden,
    defaultIncludeHiddenElements,
    warnOnUnhandledEvent,
    ...rest
  } = options;

  validateOptions('configure', rest, configure);

  const resolvedDefaultIncludeHiddenElements =
    defaultIncludeHiddenElements ?? defaultHidden ?? config.defaultIncludeHiddenElements;

  config = {
    ...config,
    asyncUtilTimeout: asyncUtilTimeout ?? config.asyncUtilTimeout,
    defaultDebugOptions,
    defaultIncludeHiddenElements: resolvedDefaultIncludeHiddenElements,
    warnOnUnhandledEvent: warnOnUnhandledEvent ?? config.warnOnUnhandledEvent,
  };
}

export function resetToDefaults() {
  config = { ...defaultConfig };
}

export function getConfig() {
  return config;
}
