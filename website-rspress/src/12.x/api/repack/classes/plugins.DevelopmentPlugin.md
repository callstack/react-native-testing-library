# Class: DevelopmentPlugin

[plugins](../modules/plugins.md).DevelopmentPlugin

Class for running development server that handles serving the built bundle, all assets as well as
providing Hot Module Replacement functionality.

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./plugins.DevelopmentPlugin.md#constructor)

### Methods

- [apply](./plugins.DevelopmentPlugin.md#apply)

## Constructors

### constructor

• **new DevelopmentPlugin**(`config?`)

Constructs new `DevelopmentPlugin`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`DevelopmentPluginConfig`](../interfaces/plugins.DevelopmentPluginConfig.md) | Plugin configuration options. |

#### Defined in

[packages/repack/src/webpack/plugins/DevelopmentPlugin.ts:35](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/DevelopmentPlugin.ts#L35)

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

[packages/repack/src/webpack/plugins/DevelopmentPlugin.ts:42](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/DevelopmentPlugin.ts#L42)
