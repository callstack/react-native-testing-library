export type Config = {
  /** Default timeout, in ms, for `waitFor` and `findBy*` queries. */
  asyncUtilTimeout: number;
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

export function resetToDefault() {
  config = defaultConfig;
}

export function getConfig() {
  return config;
}
