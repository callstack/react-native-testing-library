# Interface: AssetsResolverPluginConfig

[plugins](../modules/plugins.md).AssetsResolverPluginConfig

[AssetsResolverPlugin](../classes/plugins.AssetsResolverPlugin.md) configuration options.

## Hierarchy

- `AssetResolverConfig`

  ↳ **`AssetsResolverPluginConfig`**

## Table of contents

### Properties

- [extensions](./plugins.AssetsResolverPluginConfig.md#extensions)
- [platform](./plugins.AssetsResolverPluginConfig.md#platform)
- [scalableExtensions](./plugins.AssetsResolverPluginConfig.md#scalableextensions)

## Properties

### extensions

• `Optional` **extensions**: `string`[]

Override default asset extensions. If the asset matches one of the extensions, it will be process
by the custom React Native asset resolver. Otherwise, the resolution will process normally and
the asset will be handled by Webpack.

#### Inherited from

AssetResolverConfig.extensions

#### Defined in

[packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetResolver.ts:16](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetResolver.ts#L16)

___

### platform

• **platform**: `string`

Target application platform.

#### Inherited from

AssetResolverConfig.platform

#### Defined in

[packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetResolver.ts:25](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetResolver.ts#L25)

___

### scalableExtensions

• `Optional` **scalableExtensions**: `string`[]

Override default scalable extensions, which processes only scalable assets like images
to create a map of DPI variants of the asset.

#### Inherited from

AssetResolverConfig.scalableExtensions

#### Defined in

[packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetResolver.ts:22](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetResolver.ts#L22)
