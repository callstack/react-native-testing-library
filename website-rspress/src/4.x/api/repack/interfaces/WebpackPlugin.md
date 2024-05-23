# Interface: WebpackPlugin

Interface that all Webpack plugins should implement.

## Implemented by

- [`AssetsResolverPlugin`](../classes/plugins.AssetsResolverPlugin.md)
- [`ChunksToHermesBytecodePlugin`](../classes/plugins.ChunksToHermesBytecodePlugin.md)
- [`CodeSigningPlugin`](../classes/plugins.CodeSigningPlugin.md)
- [`DevelopmentPlugin`](../classes/plugins.DevelopmentPlugin.md)
- [`JavaScriptLooseModePlugin`](../classes/plugins.JavaScriptLooseModePlugin.md)
- [`LoggerPlugin`](../classes/plugins.LoggerPlugin.md)
- [`ManifestPlugin`](../classes/plugins.ManifestPlugin.md)
- [`ModuleFederationPlugin`](../classes/plugins.ModuleFederationPlugin.md)
- [`OutputPlugin`](../classes/plugins.OutputPlugin.md)
- [`ReactRefreshPlugin`](../classes/plugins.ReactRefreshPlugin.md)
- [`RepackPlugin`](../classes/RepackPlugin.md)
- [`RepackTargetPlugin`](../classes/plugins.RepackTargetPlugin.md)

## Table of contents

### Methods

- [apply](./WebpackPlugin.md#apply)

## Methods

### apply

▸ **apply**(`compiler`): `void`

Entry point for a plugin. It should perform any kind of setup or initialization
hook into compiler's events.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compiler` | `Compiler` | Webpack compiler instance. |

#### Returns

`void`

#### Defined in

[packages/repack/src/types.ts:27](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L27)
