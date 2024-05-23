# Interface: WebpackPlugin

Interface that all Webpack plugins should implement.

## Implemented by

- [`AssetsPlugin`](../classes/AssetsPlugin.md)
- [`AssetsResolverPlugin`](../classes/AssetsResolverPlugin.md)
- [`DevServerPlugin`](../classes/DevServerPlugin.md)
- [`JavaScriptLooseModePlugin`](../classes/JavaScriptLooseModePlugin.md)
- [`LoggerPlugin`](../classes/LoggerPlugin.md)
- [`OutputPlugin`](../classes/OutputPlugin.md)
- [`TargetPlugin`](../classes/TargetPlugin.md)

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

[packages/repack/src/types.ts:27](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L27)
