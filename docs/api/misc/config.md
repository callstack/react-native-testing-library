# Configuration

## `configure`

```ts
type Config = {
  asyncUtilTimeout: number;
  defaultHidden: boolean;
  defaultDebugOptions: Partial<DebugOptions>;
  concurrentRoot: boolean;
};

function configure(options: Partial<Config>) {}
```

### `asyncUtilTimeout` option

Default timeout, in ms, for async helper functions (`waitFor`, `waitForElementToBeRemoved`) and `findBy*` queries. Defaults to 1000 ms.

### `defaultIncludeHiddenElements` option

Default value for [includeHiddenElements](/react-native-testing-library/docs/api/queries.md#includehiddenelements-option) query option for all queries. The default value is `false`, so all queries won't match [elements hidden from accessibility](#ishiddenfromaccessibility). This is because users of the app wouldn't be able to see such elements.

This option is also available as `defaultHidden` alias for compatibility with [React Testing Library](https://testing-library.com/docs/dom-testing-library/api-configuration/#defaulthidden).

### `defaultDebugOptions` option

Default [debug options](#debug) used when calling `debug()`. These default options are overridden by the ones you specify directly when calling `debug()`.

### `concurrentRoot` option \{#concurrent-root}

Set to `false` to disable concurrent rendering.
Otherwise, `render` defaults to using concurrent rendering used in the React Native New Architecture.

## `resetToDefaults()`

```ts
function resetToDefaults() {}
```

## Environment variables

### `RNTL_SKIP_AUTO_CLEANUP`

Set to `true` to disable automatic `cleanup()` after each test. This works the same as importing `react-native-testing-library/dont-cleanup-after-each` or using `react-native-testing-library/pure`.

```shell
$ RNTL_SKIP_AUTO_CLEANUP=true jest
```

### `RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS`

Set to `true` to disable auto-detection of fake timers. This might be useful in rare cases when you want to use non-Jest fake timers. See [issue #886](https://github.com/callstack/react-native-testing-library/issues/886) for more details.

```shell
$ RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS=true jest
```
