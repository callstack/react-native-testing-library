# Class: OutputPlugin

[plugins](../modules/plugins.md).OutputPlugin

Plugin for copying generated files (bundle, chunks, assets) from Webpack's built location to the
React Native application directory, so that the files can be packed together into the `ipa`/`apk`.

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./plugins.OutputPlugin.md#constructor)

### Methods

- [apply](./plugins.OutputPlugin.md#apply)

## Constructors

### constructor

• **new OutputPlugin**(`config`)

Constructs new `OutputPlugin`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`OutputPluginConfig`](../interfaces/plugins.OutputPluginConfig.md) | Plugin configuration options. |

#### Defined in

[packages/repack/src/webpack/plugins/OutputPlugin.ts:151](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/OutputPlugin.ts#L151)

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

[packages/repack/src/webpack/plugins/OutputPlugin.ts:181](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/OutputPlugin.ts#L181)
