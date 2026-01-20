# Configuration

## `configure`

```ts
type Config = {
  /** Default timeout, in ms, for `waitFor` and `findBy*` queries. */
  asyncUtilTimeout: number;

  /** Default value for `includeHiddenElements` query option. */
  defaultIncludeHiddenElements: boolean;

  /** Default options for `debug` helper. */
  defaultDebugOptions?: Partial<DebugOptions>;
};

type ConfigAliasOptions = {
  /** RTL-compatibility alias for `defaultIncludeHiddenElements`. */
  defaultHidden: boolean;
};

function configure(options: Partial<Config & ConfigAliasOptions>) {}
```

### `asyncUtilTimeout` option

Default timeout, in ms, for async helper functions (`waitFor`, `waitForElementToBeRemoved`) and `findBy*` queries. Defaults to 1000 ms.

### `defaultIncludeHiddenElements` option

Default value for [includeHiddenElements](/react-native-testing-library/14.x/docs/api/queries.md#includehiddenelements-option) query option for all queries. The default value is set to `false`, so all queries will not match [elements hidden from accessibility](#ishiddenfromaccessibility). This is because the users of the app would not be able to see such elements.

This option is also available as `defaultHidden` alias for compatibility with [React Testing Library](https://testing-library.com/docs/dom-testing-library/api-configuration/#defaulthidden).

### `defaultDebugOptions` option

Default [debug options](#debug) to be used when calling `debug()`. These default options will be overridden by the ones you specify directly when calling `debug()`.

## `resetToDefaults()`

```ts
function resetToDefaults() {}
```

## Environment variables

### `RNTL_SKIP_AUTO_CLEANUP`

Set to `true` to disable automatic `cleanup()` after each test. It works the same as importing `react-native-testing-library/dont-cleanup-after-each` or using `react-native-testing-library/pure`.

```shell
$ RNTL_SKIP_AUTO_CLEANUP=true jest
```

### `RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS`

Set to `true` to disable auto-detection of fake timers. This might be useful in rare cases when you want to use non-Jest fake timers. See [issue #886](https://github.com/callstack/react-native-testing-library/issues/886) for more details.

```shell
$ RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS=true jest
```
