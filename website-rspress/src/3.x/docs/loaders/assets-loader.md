# Assets loader

Assets loader allows you to use images in your application as well as to reference other static assets (video, audio, etc).

By default, Assets loader extracts asset files, meaning the files will be copied to the output directory and included in the final application as individual files. The assets files are put in `assets/` (on iOS) or `drawable-*` (on Android) directories.

This behavior is in line with how Metro handles assets.

:::info

If you want to inline assets as `base64` encoded data URI, check our [Inline assets guide](../guides/inline-assets).

:::

In the default [Webpack template](../configuration/templates), the Assets loader is configured to process the same assets types as Metro:

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    // ...
    rules: [
      // ...
      {
        test: ReactNative.getAssetExtensionsRegExp(
          ReactNative.ASSET_EXTENSIONS
        ),
        use: {
          loader: '@callstack/repack/assets-loader',
          options: {
            platform,
            devServerEnabled: devServer.enabled,
            /**
             * Defines which assets are scalable - which assets can have
             * scale suffixes: `@1x`, `@2x` and so on.
             * By default all images are scalable.
             */
            scalableAssetExtensions: ReactNative.SCALABLE_ASSETS,
          },
        },
      },
    ],
    // ...
  },
  // ...
};
```

:::info

Assets loader should be used in combination with [AssetsResolverPlugin](../../api/repack/classes/plugins.AssetsResolverPlugin)
to work correctly and process scales: `@1x`, `@2x` and so on.

:::

## Excluding assets

In some cases, you might want to exclude assets from being processed by Re.Pack's Assets loader.
A typical scenario would be if you want to manually process specific assets separately using
different loaders — a common example of such scenario would be SVGs.

You can exclude asset types by filtering them out from `ASSET_EXTENSIONS` array:

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    // ...
    rules: [
      // ...
      {
        test: ReactNative.getAssetExtensionsRegExp(
          ReactNative.ASSET_EXTENSIONS.filter((ext) => ext !== 'svg')
        ),
        use: {
          loader: '@callstack/repack/assets-loader',
          options: {
            // ...
          },
        },
      },
    ],
    // ...
  },
  // ...
};
```

and then add your own rule and loader to process the excluded asset:

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    // ...
    rules: [
      // ...
      {
        test: ReactNative.getAssetExtensionsRegExp(
          ReactNative.ASSET_EXTENSIONS.filter((ext) => ext !== 'svg')
        ),
        // ...
      },
      {
        test: /\.svg$/, // or ReactNative.getAssetExtensionsRegExp(['svg'])
        use: {
          loader: '<your_loader>',
          options: {
            /* ... options for your loader ... */
          },
        },
      },
    ],
    // ...
  },
  // ...
};
```

:::tip

If you want to use SVGs in your application, check out [dedicated guide on SVGs](../guides/svg).

:::

## Migrating from `AssetsPlugin`

If you are using older version of Re.Pack you might have `AssetPlugin` and no rule with Assets loader
in your Webpack config.

You can keep using `AssetsPlugin`, as long as you don't want to render SVGs in your application,
or you don't intend to use custom rules for other assets.

:::caution

Keep in mind that `AssetPlugin` is **deprecated** and will be removed in next major version of Re.Pack.

:::

To migrate from `AssetPlugin` and use Re.Pack's Assets loader, apply the following diff to your
Webpack config:

````diff
@@ -165,6 +165,34 @@ module.exports = {
           },
         },
       },
+      /**
+       * This loader handles all static assets (images, video, audio and others), so that you can
+       * use (reference) them inside your application.
+       *
+       * If you wan to handle specific asset type manually, filter out the extension
+       * from `ASSET_EXTENSIONS`, for example:
+       * ```
+       * ReactNative.ASSET_EXTENSIONS.filter((ext) => ext !== 'svg')
+       * ```
+       */
+      {
+        test: ReactNative.getAssetExtensionsRegExp(
+          ReactNative.ASSET_EXTENSIONS
+        ),
+        use: {
+          loader: '@callstack/repack/assets-loader',
+          options: {
+            platform,
+            devServerEnabled: devServer.enabled,
+            /**
+             * Defines which assets are scalable - which assets can have
+             * scale suffixes: `@1x`, `@2x` and so on.
+             * By default all images are scalable.
+             */
+            scalableAssetExtensions: ReactNative.SCALABLE_ASSETS,
+          },
+        },
+      },
     ],
   },
   plugins: [
@@ -177,11 +205,11 @@ module.exports = {
     }),

     /**
-     * This plugin makes sure you can use assets like images, videos, audio.
+     * This plugin makes sure the resolution for assets like images works with scales,
+     * for example: `image@1x.png`, `image@2x.png`.
      */
-    new ReactNative.AssetsPlugin({
+    new ReactNative.AssetsResolverPlugin({
       platform,
-      devServerEnabled: devServer.enabled,
     }),

     /**

````

After applying these changes, your application should still behave the same as it was before,
but now you can modify, which assets are processed by Re.Pack's Assets loader and use different
loader to handle them.
