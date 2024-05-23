# Inline Assets

There are some situations when you might want to inline assets into the JavaScript bundle, instead of extracting them into standalone files.

Common examples of such use cases are:

- Out-of-tree platforms that don't support static assets in a similar way as React Native on iOS/Android does or don't support static assets at all.
- [Code splitting](../code-splitting/usage) with static assets used by [remote chunks](../code-splitting/glossary#remote-chunks).

:::info

If you're using [Code Splitting](../code-splitting/concept) or Module Federation, assets will be inlined into the chunks or containers
importing them and should be properly rendered by the host application.

:::

## Usage

Generally speaking, to inline assets you have to pass `inline: true` option to the [Assets loader](../loaders/assets-loader):

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
          test: Repack.getAssetExtensionsRegExp(Repack.ASSET_EXTENSIONS),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              inline: true,
              platform,
              devServerEnabled: Boolean(devServer),
              /**
               * Defines which assets are scalable - which assets can have
               * scale suffixes: `@1x`, `@2x` and so on.
               * By default all images are scalable.
               */
              scalableAssetExtensions: Repack.SCALABLE_ASSETS,
            },
          },
        },
      ],
    },

    /* ... */
  };
};
```

This will cause all assets processed by Assets loader in the rule to be inlined into the JavaScript bundle.

Inlined assets are imported in the same way as extracted assets:

```jsx
import image from './image.png';
<Image source={image} />
// or
<Image source={require('./image.png')} />
```

The value of `image` in this example would be either an object with `uri`, `width`, `height` and `scale` or an array of such objects, in case there are multiple scales.

:::info

Assets loader supports inlining assets with multiple scales.

:::

Keep in mind, you can provide multiple rules with Re.Pack's Assets loader - one rule would extract the assets and another would inline them. There's no limit how many of these rules you could have.

Make sure you configure those rules not to overlap, so that any single asset is only processed by one rule (by one Asset loader).
Use combination `include`, `exclude` and `test` (for extensions matching) to configure each rule.

:::tip

You can read more about Webpack's loader rules here: https://webpack.js.org/configuration/module/#rule-conditions:

- `test: string | RegExp | Array<string | RegExp>` must match if specified
- `include: string | RegExp | Array<string | RegExp>` must match if specified
- `exclude: string | RegExp | Array<string | RegExp>` must **not** match if specified

:::

You can even use [Webpack's Assets Modules](https://webpack.js.org/guides/asset-modules/) if you prefer (with some differences however).
