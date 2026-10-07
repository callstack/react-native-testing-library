# Configuration

## `configure`

```ts
type Config = {
  /** Default timeout, in ms, for `waitFor` and `findBy*` queries. */
  asyncUtilTimeout: number;

  /** Default value for `includeHiddenElements` query option. */
  defaultIncludeHiddenElements: boolean;

  /** Warn when `fireEvent` or a `userEvent` interaction calls no handler. Off by default. */
  eventDiagnostics: boolean;

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

Default value for [includeHiddenElements](./queries.md#includehiddenelements-option) query option for all queries. The default value is set to `false`, so all queries will not match [elements hidden from accessibility](#ishiddenfromaccessibility). This is because the users of the app would not be able to see such elements.

This option is also available as `defaultHidden` alias for compatibility with [React Testing Library](https://testing-library.com/docs/dom-testing-library/api-configuration/#defaulthidden).

### `eventDiagnostics` option

When `fireEvent` or `userEvent` doesn't call any handler, the test can silently do nothing, which can be confusing while debugging. When this option is enabled, a warning is logged in these cases:

- The handler is on a disabled element (e.g. a `Pressable` with `disabled={true}`, or a `TextInput` with `editable={false}`).
- Neither the element nor any of its ancestors has a handler for the event. For direct events like `layout`, which don't bubble, only the element itself is checked.

A `userEvent` interaction, like `press()` or `type()`, dispatches several events. It warns only when none of them called a handler. For example, `longPress()` on an element that has only `onPress` warns, because `longPress()` doesn't dispatch a `press` event.

No warning is logged when the event is blocked by `pointerEvents="none"`, or when it updates native state, e.g. `fireEvent.changeText` or `userEvent.type` on an uncontrolled `TextInput`. Defaults to `false`. Turn it on while debugging a test, or for the whole test suite in your Jest setup file:

```ts
configure({ eventDiagnostics: true });
```

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
