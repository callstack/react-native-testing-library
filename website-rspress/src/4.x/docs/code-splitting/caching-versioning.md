# Caching and versioning

The caching mechanism in Re.Pack prevents scripts over-fetching, which helps reducing
bandwidth usage, specially since they can easily take up multiple MBs od data.

Providing `storage` options to
[`ScriptManager.shared.setStorage`](../../api/repack/client/classes/ScriptManager#setstorage) will enable
caching of downloaded script. The `storage` option accepts anything with similar
API to `AsyncStorage`'s `getItem`, `setItem` and `removeItem` functions.

By default, [`ScriptManager`](../../api/repack/client/classes/ScriptManager) will compare the `method`/`url`/`query`/`header` or `body`
returned by `resolve` with the values stored in `storage` to determine if downloading is
necessary. Skipping the download will only happen, if the values are equal, meaning you can introduce
versioning by changing the `url`, for example:

```js
import { ScriptManager, Script } from '@callstack/repack/client';

ScriptManager.shared.setStorage(AsyncStorage);
ScriptManager.shared.addResolver(async (scriptId) => {
  const { version } = await getRemoteConfig();

  return {
    url: Script.getRemoteURL(`http://my-domain.dev/v${version}/${scriptId}`),
  };
});
```

Or by keeping the base URL inside remote config:

```js
import { ScriptManager, Script } from '@callstack/repack/client';

ScriptManager.shared.setStorage(AsyncStorage);
ScriptManager.shared.addResolver(async (scriptId) => {
  const { baseURL } = await getRemoteConfig();

  return {
    url: Script.getRemoteURL(`${baseURL}/${scriptId}`),
  };
});
```
:::caution

Versioning should be use with caution. If you upload a new version of a script and it happens that old main bundle is not compatible with new files, you
might end up with broken application or crashes.

:::

Usually cache invalidation happens automatically, but it's possible to invalidate chunk manually as
well using [`ScriptManager.shared.invalidateScripts(...)`](../../api/repack/client/classes/ScriptManager#invalidatescripts),
which removes the scripts from filesystem and from the `storage`.

:::warning

Be careful what scripts are you manually invalidating - it's possible to remove local scripts from
filesystem using this API.

:::