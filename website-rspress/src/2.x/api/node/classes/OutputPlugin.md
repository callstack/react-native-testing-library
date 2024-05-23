# Class: OutputPlugin

Plugin for copying generated files (bundle, chunks, assets) from Webpack's built location to the
React Native application directory, so that the files can be packed together into the `ipa`/`apk`.

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./OutputPlugin.md#constructor)

### Methods

- [apply](./OutputPlugin.md#apply)

## Constructors

### constructor

• **new OutputPlugin**(`config`)

Constructs new `OutputPlugin`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`OutputPluginConfig`](../interfaces/OutputPluginConfig.md) | Plugin configuration options. |

#### Defined in

[packages/repack/src/webpack/plugins/OutputPlugin.ts:45](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/OutputPlugin.ts#L45)

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

[packages/repack/src/webpack/plugins/OutputPlugin.ts:56](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/OutputPlugin.ts#L56)
