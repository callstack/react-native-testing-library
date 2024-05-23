# Code Push

Officially, CodePush is only supported if you're **not** using Code Splitting.

With Code Splitting, the support is not official. It should be still possible to use Code Push, but
you might face unexpected difficulties. In general, the usage of Code Push should be limited to the
main bundle and the rest should rely on [Caching & versioning](./caching-versioning) to invalidate
and download new chunks.

The process of using Code Push with Code SPlitting could be described as follows:

1. Bundle the application using Webpack and Re.Pack.
2. Upload remote chunks/scripts/containers to a server/CDN.
3. Release application to the store.
4. Make changes to the code.
5. **Change the `url` in [`ChunkManager.configure(...)`](../../api/react-native/classes/ChunkManager#configure)**.
6. Bundle the application using Webpack and Re.Pack (and build other scripts and containers when
   using Scripts/Module Federation approach).
7. Upload remote chunks/scripts/containers to a server/CDN **under new `url` from point 5**.
8. Push main bundle using CodePush.
9. When `resolveRemoteChunk` from a new main bundle is called, it will return different `url`,
   which will cause cache invalidation and new remote chunks/scripts/containers will be downloaded.

:::info

Re.Pack is not an alternative for CodePush, and both projects aim to accomplish different use cases.

:::
