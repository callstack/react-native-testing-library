import { DebugOptions } from './helpers/debugDeep';

export type Config = {
  /** Default timeout, in ms, for `waitFor` and `findBy*` queries. */
  asyncUtilTimeout: number;

  /** Default includeHiddenElements value for all queries */
  defaultIncludeHiddenElements: boolean;

  /** Default hidden value for all queries, alias to defaultIncludeHiddenElements to respect react-testing-library API
   * WARNING: if both defaultHidden and defaultIncludeHiddenElements values are defined,
   * then defaultIncludeHiddenElements will take precedence
   */
  defaultHidden: boolean;

  /** Default options for `debug` helper. */
  defaultDebugOptions?: Partial<DebugOptions>;
};

const defaultConfig: Config = {
  asyncUtilTimeout: 1000,
  defaultHidden: true,
  defaultIncludeHiddenElements: true,
};

let config = { ...defaultConfig };

export function configure(options: Partial<Config>) {
  if (
    options.defaultHidden !== undefined &&
    options.defaultIncludeHiddenElements === undefined
  ) {
    options.defaultIncludeHiddenElements = options.defaultHidden;
  }

  if (
    options.defaultIncludeHiddenElements !== undefined &&
    options.defaultHidden === undefined
  ) {
    options.defaultHidden = options.defaultIncludeHiddenElements;
  }

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
