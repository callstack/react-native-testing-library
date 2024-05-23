# Caching and versioning

The caching mechanism in Re.Pack prevents chunk/script/container over-fetching, which helps reducing
bandwidth usage, specially since they can easily take up multiple MBs od data.

:::info

Automatic caching and versioning applies only to remote chunks, scripts and containers. Local chunks
are excluded.

:::

Providing `storage` options to
[`ChunkManager.configure(...)`](../../api/react-native/classes/ChunkManager#configure) will enable
caching of downloaded chunks/scripts/containers. The `storage` option accepts anything with similar
API to `AsyncStorage`'s `getItem`, `setItem` and `removeItem` functions.

By default, [`ChunkManager`](../../api/react-native/classes/ChunkManager) will compare the `url`
returned by `resolveRemoteChunk` with the values stored in `storage` to determine if downloading if
necessary. Skipping the download will only happen if the values are equal, meaning you can introduce
versioning by changing the `url`, for example:

```js
ChunkManager.configure({
  storage: AsyncStorage,
  resolveRemoteChunk: async (chunkId) => {
    const { version } = await getRemoteConfig();

    return {
      url: `http://my-domain.dev/v${version}/${chunkId}`,
    };
  },
});
```

Or by keeping the base URL inside remote config:

```js
ChunkManager.configure({
  storage: AsyncStorage,
  resolveRemoteChunk: async (chunkId) => {
    const { baseURL } = await getRemoteConfig();

    return {
      url: `${baseURL}/${chunkId}`,
    };
  },
});
```

:::caution

Versioning should be use with caution. If you upload a new version of remote
chunks/scripts/containers and it happens that old main bundle is not compatible with new files, you
might end up with broken application or crashes.

:::

Usually cache invalidation happens automatically, but it's possible to invalidate chunk manually as
well using [`ChunkManager.invalidateChunks(...)`](../../api/react-native/classes/ChunkManager#invalidatechunks)
API which removes the chunks from filesystem and from the `storage`.

:::warning

Be careful what chunks are you manually invalidating - it's possible to remove local chunks from
filesystem using this API.

:::
