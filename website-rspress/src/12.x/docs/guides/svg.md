# SVG

By default, Re.Pack's [Assets loader](../loaders/assets-loader) is configured to allow you to import SVGs in you code, but that doesn't mean you can render them immediately.

## Pre-requisites

To render SVGs in your application, you first need to add [`react-native-svg`](https://github.com/react-native-svg/react-native-svg) native module to your application.

Please follow this installation instructions here: https://github.com/react-native-svg/react-native-svg#installation

## Exclude SVG from Re.Pack's Assets loader

Now that you have [`react-native-svg`](https://github.com/react-native-svg/react-native-svg) installed and linked into the application, you need to tell Webpack **not to use** Re.Pack's [Assets loader](../loaders/assets-loader) from processing SVGs, since you will process them manually later.

Go to your Webpack configuration and apply the following diff:

```diff
      {
        test: ReactNative.getAssetExtensionsRegExp(
-         ReactNative.ASSET_EXTENSIONS
+         ReactNative.ASSET_EXTENSIONS.filter((ext) => ext !== 'svg')
        ),
        use: {
          loader: '@callstack/repack/assets-loader',
```

:::tip

If you don't have Re.Pack's Assets loader rule in your Webpack config, read [this guide](../loaders/assets-loader#migrating-from-assetsplugin) first.

:::

Now you need to tell Webpack how to handle `.svg` files.

## Using `@svgr/webpack`

Using [SVGR](https://react-svgr.com/) is a good option, if you want to render imported SVGs in the
same way as you would render any other React component:

```js
import * as React from 'react';
import DeveloperActivitySvg from './undraw_Developer_activity_re_39tg.svg';

export function MyComponent() {
  return <DeveloperActivitySvg width="100%" height="400" />;
}
```

### Setup

To use SVGR, you need to add an additional rule to process SVGs with `@svgr/webpack` loader.

Go to your Webpack configuration and apply the following diff:

```diff
// webpack.config.js
module.exports = {
  // ...
  module: {
    // ...
    rules: [
      // ...
+     {
+       test: /\.svg$/,
+       use: [
+         {
+           loader: '@svgr/webpack',
+           options: {
+             native: true,
+             // You might want to uncomment the following line.
+             // More info: https://react-svgr.com/docs/options/#dimensions
+             // dimensions: false,
+           },
+         },
+       ],
+     },
    ],
    // ...
  },
  // ...
};
```

Thanks to the rule above, your SVGs will be processed by `@svgr/webpack` and converted to components
from [`react-native-svg`](https://github.com/react-native-svg/react-native-svg) allowing you to simply
import the component and render it as a React component.

## Using Webpack's asset modules

Using Webpack's asset modules is a simpler and faster way to render SVGs in your application.
It's a good option, if you don't need or care about using the imported SVG as React component,
and you're fine with using `SvgXml` or `SvgUri` component from [`react-native-svg`](https://github.com/react-native-svg/react-native-svg).

:::info

You can read more about Webpack's asset modules here: https://webpack.js.org/guides/asset-modules/.

:::

### `SvgXml` + `asset/source`

The SVG file will be included in a bundle as a raw source in a separate module.

```js
import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import developerActivitySvgXml from './undraw_Developer_activity_re_39tg.svg';

export function MyComponent() {
  return <SvgXml xml={developerActivitySvgXml} width="100%" height="400" />;
}
```

### `SvgUri` + `asset/inline`

The SVG file will be included in a bundle as a data URI in a separate module.

```js
import * as React from 'react';
import { SvgUri } from 'react-native-svg';
import developerActivitySvgUri from './undraw_Developer_activity_re_39tg.svg';

export function MyComponent() {
  return <SvgUri uri={developerActivitySvgUri} width="100%" height="400" />;
}
```

### Setup

To use asset modules, you need to add additional rule to process SVGs as an asset module.

Go to your Webpack configuration and apply the following diff:

```diff
// webpack.config.js
module.exports = {
  // ...
  module: {
    // ...
    rules: [
      // ...
+     {
+       test: /\.svg$/,
+       type: 'asset/source', // or `asset/inline`
+     },
    ],
    // ...
  },
  // ...
};
```

Now you can import the XML of your SVG in you code and render it using `SvgXml` from [`react-native-svg`](https://github.com/react-native-svg/react-native-svg) or `SvgUri` if you chose `asset/inline` type.

:::info

If you want to inline SVGs as data URI, use `asset/inline` in the rule:

```js
      {
        test: /\.svg$/,
        type: 'asset/inline',
      },
```

Remember to use `SvgUri` for inlined SVGs instead of `SvgXml`.

:::

You can also use both, `asset/source` and `asset/inline` in your application:

```diff
// webpack.config.js
module.exports = {
  // ...
  module: {
    // ...
    rules: [
      // ...
+     {
+       test: /\.svg$/,
+       include: /assets\/source\//,
+       type: 'asset/source',
+     },
+     {
+       test: /\.svg$/,
+       include: /assets\/inline\//,
+       type: 'asset/inline',
+     },
    ],
    // ...
  },
  // ...
};
```

:::tip

When using both `assets/source` and `assets/inline`, you can specify different `test`, `include` and `exclude` values,
so that Webpack can figure out which mechanism to use for which SVG. You can read more about rule conditions here:

- https://webpack.js.org/configuration/module/#rule-conditions
- https://webpack.js.org/configuration/module/#ruleinclude
- https://webpack.js.org/configuration/module/#ruleexclude
- https://webpack.js.org/configuration/module/#ruletest
- https://webpack.js.org/configuration/module/#condition

:::

:::warning

Do not use `asset/resource` type, as it won't work correctly in React Native and can potentially
crash your application.

:::
