import { DebugOptions } from './helpers/debugDeep';

export type Config = {
  /** Default timeout, in ms, for `waitFor` and `findBy*` queries. */
  asyncUtilTimeout: number;
  /** Default options for `debug` helper. */
  defaultDebugOptions?: Partial<DebugOptions>;
  /** Default hidden value for all queries */
  defaultHidden: boolean;
};

const defaultConfig: Config = {
  asyncUtilTimeout: 1000,
  defaultHidden: true,
};

let config = {
  ...defaultConfig,
};

export function configure(options: Partial<Config>) {
  config = {
    ...config,
    ...options,
  };
}

export function resetToDefaults() {
  config = defaultConfig;
}

export function getConfig() {
  return config;
}
