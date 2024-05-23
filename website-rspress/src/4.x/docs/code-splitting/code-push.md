# Code Push

Officially, CodePush is only supported if you're **not** using Code Splitting.

With Code Splitting, the support is not official. It should be still possible to use Code Push, but
you might face unexpected difficulties. In general, the usage of Code Push should be limited to the
main bundle and the rest should rely on [Caching & versioning](./caching-versioning) to invalidate
and download new scripts.

The process of using Code Push with Code Splitting could be described as follows:

1. Bundle the application using Webpack and Re.Pack.
2. Upload scripts to a server/CDN.
3. Release application to the store.
4. Make changes to the code.
5. **Change the `method`/`url`/`query`/`header` or `body` when resolving script in resolver added to [`ScriptManager`](../../api/repack/client/classes/ScriptManager#addresolver)**.
6. Bundle the application using Webpack and Re.Pack (and build other scripts and containers when
   using Scripts/Module Federation approach).
7. Upload scripts to a server/CDN **under new `method`/`url`/`query`/`header` or `body` from point 5**.
8. Push main bundle using CodePush.
9. When `resolve` from a new main bundle is called, it should return different `method`/`url`/`query`/`header` or `body`,
   which will cause cache invalidation and new script will be downloaded.

:::info

Re.Pack is not an alternative for CodePush, and both projects aim to accomplish different use cases.

:::

:::warning

Code Push works only on the main bundle, meaning all local chunks will not be updated by Code Push.

:::
