import type { DebugOptions } from './helpers/debug';
import { validateOptions } from './helpers/validate-options';

/**
 * Global configuration options for React Native Testing Library.
 */

export type EventSystem = 'legacy' | 'modern';

export type Config = {
  /** Default timeout, in ms, for `waitFor` and `findBy*` queries. */
  asyncUtilTimeout: number;

  /** Default value for `includeHiddenElements` query option. */
  defaultIncludeHiddenElements: boolean;

  /**
   * Warn when `fireEvent` or a `userEvent` interaction calls no handler, because the target
   * is disabled, blocked by `pointerEvents`, or no element handles the event. Off by default.
   */
  eventDiagnostics: boolean;

  /**
   * Event system used by `fireEvent` and `userEvent`. `'legacy'` is the current simplified
   * implementation. `'modern'` follows React Native's event dispatch. Defaults to `'legacy'`.
   */
  eventSystem: EventSystem;

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
  eventDiagnostics: false,
  eventSystem: 'legacy',
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
    eventDiagnostics,
    eventSystem,
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
    eventDiagnostics: eventDiagnostics ?? config.eventDiagnostics,
    eventSystem: eventSystem ?? config.eventSystem,
  };
}

export function resetToDefaults() {
  config = { ...defaultConfig };
}

export function getConfig() {
  return config;
}
