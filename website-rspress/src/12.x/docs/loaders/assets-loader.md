# Assets Loader

Assets loader allows you to use images in your application as well as to reference other static assets (video, audio, etc).

By default, Assets loader extracts asset files, meaning the files will be copied to the output directory and included in the final application as individual files. The assets files are put in target location depending on the platform:

- on iOS: `assets/` directory
- on Android: `drawable-*` directories

This behavior is in line with how Metro handles assets. The default [Webpack template](../configuration/templates) has Assets Loader configured to process the same assets types as Metro.

Assets Loader in Re.Pack also has some additional capabilities like inlining assets as `base64` encoded data URI or converting the assets to be downloadable from a remote server, you can read more about them here:

- [Inline assets guide](../guides/inline-assets)
- [Remote assets guide](../guides/remote-assets)

:::tip
If you want to use SVGs in your application, check out [dedicated guide on SVGs](../guides/svg).
:::

:::details
Assets Loader should be used in combination with `AssetsResolverPlugin` to work correctly and process scales like `@1x`, `@2x` and so on. If you are using `RepackPlugin` you don't need to do anything, as it's already included there.
:::

## Usage

```js title="webpack.config.js"
{
  module: {
    rules: [
      {
        test: ReactNative.getAssetExtensionsRegExp(
          ReactNative.ASSET_EXTENSIONS
        ),
        use: {
          loader: '@callstack/repack/assets-loader',
          options: {
            platform,
            devServerEnabled: Boolean(devServer),
            scalableAssetExtensions: ReactNative.SCALABLE_ASSETS,
          },
        },
      },
    ],
  },
};
```

## Excluding assets

In some cases, you might want to exclude assets from being processed by Re.Pack's Assets Loader.
A typical scenario would be if you want to manually process specific assets separately using
different loaders — a common example of such scenario would be SVGs.

You can exclude asset types by filtering them out from `ASSET_EXTENSIONS` array:

```js title="webpack.config.js"
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

Then add your own rule and loader to process the excluded asset:

```js title="webpack.config.js"
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
