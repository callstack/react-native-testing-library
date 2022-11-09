import { DebugOptions } from './helpers/debugDeep';

export type Config = {
  /** Default timeout, in ms, for `waitFor` and `findBy*` queries. */
  asyncUtilTimeout: number;

  /** Default includeHidden value for all queries */
  defaultIncludeHidden: boolean;

  /** Default hidden value for all queries, alias to defaultIncludeHidden to respect react-testing-library API
   * WARNING: if both defaultHidden and defaultIncludeHidden values are defined,
   * then defaultIncludeHidden will take precedence
   */
  defaultHidden: boolean;

  /** Default options for `debug` helper. */
  defaultDebugOptions?: Partial<DebugOptions>;
};

const defaultConfig: Config = {
  asyncUtilTimeout: 1000,
  defaultHidden: true,
  defaultIncludeHidden: true,
};

let config = { ...defaultConfig };

export function configure(options: Partial<Config>) {
  config = {
    ...config,
    ...options,
  };
}

export function resetToDefaults() {
  config = { ...defaultConfig };
}

export function getConfig() {
  return config;
}
