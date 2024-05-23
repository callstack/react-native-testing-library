# Class: RepackPlugin

Webpack plugin, which abstracts configuration of other Re.Pack's plugin
to make Webpack config more readable.

**`example`** Usage in Webpack config (ESM):
```ts
import * as Repack from '@callstack/repack';

export default (env) => {
  const {
    mode = 'development',
    platform,
    devServer = undefined,
  } = env;

  return {
    plugins: [
      new Repack.RepackPlugin({
        mode,
        platform,
        devServer,
      }),
    ],
  };
};
```

Internally, `RepackPlugin` configures the following plugins:
- `webpack.DefinePlugin` with `__DEV__` global
- [AssetsResolverPlugin](./plugins.AssetsResolverPlugin.md)
- [OutputPlugin](./plugins.OutputPlugin.md)
- [DevelopmentPlugin](./plugins.DevelopmentPlugin.md)
- [RepackTargetPlugin](./plugins.RepackTargetPlugin.md)
- `webpack.SourceMapDevToolPlugin`
- [LoggerPlugin](./plugins.LoggerPlugin.md)

`RepackPlugin` provides a sensible defaults, but can be customized to some extent.
If you need more control, it's recommended to remove `RepackPlugin` and use other plugins
directly, eg:
```ts
import * as Repack from '@callstack/repack';

new Repack.plugins.AssetsResolverPlugin();
```

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./RepackPlugin.md#constructor)

### Methods

- [apply](./RepackPlugin.md#apply)

## Constructors

### constructor

• **new RepackPlugin**(`config`)

Constructs new `RepackPlugin`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`RepackPluginConfig`](../interfaces/RepackPluginConfig.md) | Plugin configuration options. |

#### Defined in

[packages/repack/src/webpack/plugins/RepackPlugin.ts:116](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/RepackPlugin.ts#L116)

## Methods

### apply

▸ **apply**(`compiler`): `void`

Apply the plugin.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compiler` | `Compiler` | Webpack compiler instance. |

#### Returns

`void`

#### Implementation of

[WebpackPlugin](../interfaces/WebpackPlugin.md).[apply](../interfaces/WebpackPlugin.md#apply)

#### Defined in

[packages/repack/src/webpack/plugins/RepackPlugin.ts:126](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/RepackPlugin.ts#L126)
