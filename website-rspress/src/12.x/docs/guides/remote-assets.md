# Remote Assets

RePack provides you with a way to extract and serve your assets externally, such as on a CDN,
instead of bundling them directly into your application. When working with ModuleFederation
this is the recommended approach to handling the assets in federated modules, as inlining
the assets causes your bundle size to increase dramatically.

## Usage

To convert assets to remote assets you have to configure `remote` option to the [Assets loader](../loaders/assets-loader):

```js
/* ... */

export default (env) => {
  /* ... */

  return {
    /* ... */

    module: {
      rules: [
        /* ... */

        {
          test: Repack.getAssetExtensionsRegExp(
            Repack.ASSET_EXTENSIONS.filter((ext) => ext !== 'svg')
          ),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
              scalableAssetExtensions: Repack.SCALABLE_ASSETS,
              remote: {
                enabled: true,
                publicPath: 'http://localhost:9999',
              },
            },
          },
        },
      ],
    },

    /* ... */
  };
};
```

This will cause all assets processed by this Assets Loader to be converted to remote ones.

:::info
For development, it's best to set `enabled: false` and load the assets locally. This will allow you to work with the assets more efficiently. However, when you're ready to move to production, you can switch the flag to `enabled: true` and include the converted assets in the production bundle.
:::

Remote assets are imported in the same way as local assets:

```jsx
import image from './image.png';
<Image source={image} />
// or
<Image source={require('./image.png')} />
```

In both cases shown above, the the value of `source` prop will resolve to an object of shape:

```ts
type source = {
  uri: string;
  width: number;
  height: number;
  scale: number;
};
```

The `uri` prop will have a value of an URL that's constructed by joining `publicPath`, 'assets' and local path to the asset together. If `publicPath` is set to https://example.com and the local path to the asset is logo.png, then the resulting `uri` value would be: `https://example.com/assets/images/logo.png`.

:::info

Scaled assets are fully supported. The asset will resolve to proper scale in runtime by constructing a relevant URL with scale suffix at the end of it.

:::

When you create a production bundle, a directory called `remote-assets` will be included in your project's build directory. This directory contains all of the remote assets that are needed for your application.

By default, the remote-assets directory will be located at `build/generated/<platform>/remote-assets`. However, if you want the remote assets to appear in the `OutputPlugin` directory, which is part of the `RepackPlugin`, you will need to configure an additional property called `auxiliaryAssetsPath`:

```ts
new Repack.RepackPlugin({
  context,
  mode,
  platform,
  devServer,
  output: {
    bundleFilename,
    sourceMapFilename,
    assetsPath,
    auxiliaryAssetsPath: path.join('build/output', platform, 'remote'),
  },
});
```

The final step is to upload your remote assets to your CDN, which is located at `publicPath`, and then host them from that location, which will make them available to users of your app.
