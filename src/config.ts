import { DebugOptions } from './helpers/debugDeep';

export type Config = {
  /** Default timeout, in ms, for `waitFor` and `findBy*` queries. */
  asyncUtilTimeout: number;
  defaultDebugOptions?: Partial<DebugOptions>;
};

const defaultConfig: Config = {
  asyncUtilTimeout: 1000,
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
