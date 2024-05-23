# Interface: AssetsPluginConfig

[AssetsPlugin](../classes/AssetsPlugin.md) configuration options.

## Hierarchy

- `AssetResolverConfig`

  ↳ **`AssetsPluginConfig`**

## Table of contents

### Properties

- [configureLoader](./AssetsPluginConfig.md#configureloader)
- [devServerEnabled](./AssetsPluginConfig.md#devserverenabled)
- [extensions](./AssetsPluginConfig.md#extensions)
- [platform](./AssetsPluginConfig.md#platform)
- [scalableExtensions](./AssetsPluginConfig.md#scalableextensions)

## Properties

### configureLoader

• `Optional` **configureLoader**: `boolean`

Whether `AssetsPlugin` should configure asset loader automatically.

Set to `false` if you want to configure it manually, for example if you are using
`@svgr/webpack`.

#### Defined in

[packages/repack/src/webpack/plugins/AssetsPlugin.ts:28](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/AssetsPlugin.ts#L28)

___

### devServerEnabled

• `Optional` **devServerEnabled**: `boolean`

Whether the development server is enabled.

#### Defined in

[packages/repack/src/webpack/plugins/AssetsPlugin.ts:20](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/AssetsPlugin.ts#L20)

___

### extensions

• `Optional` **extensions**: `string`[]

Override default asset extensions. If the asset matches one of the extensions, it will be process
by the custom React Native asset resolver. Otherwise, the resolution will process normally and
the asset will be handled by Webpack.

#### Inherited from

AssetResolverConfig.extensions

#### Defined in

[packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetResolver.ts:16](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetResolver.ts#L16)

___

### platform

• **platform**: `string`

Target application platform.

#### Inherited from

AssetResolverConfig.platform

#### Defined in

[packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetResolver.ts:25](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetResolver.ts#L25)

___

### scalableExtensions

• `Optional` **scalableExtensions**: `string`[]

Override default scalable extensions, which processes only scalable assets like images
to create a map of DPI variants of the asset.

#### Inherited from

AssetResolverConfig.scalableExtensions

#### Defined in

[packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetResolver.ts:22](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetResolver.ts#L22)
