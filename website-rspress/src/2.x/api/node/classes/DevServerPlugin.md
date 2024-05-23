# Class: DevServerPlugin

Class for running development server that handles serving the built bundle, all assets as well as
providing Hot Module Replacement functionality.

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./DevServerPlugin.md#constructor)

### Methods

- [apply](./DevServerPlugin.md#apply)

## Constructors

### constructor

• **new DevServerPlugin**(`config`)

Constructs new `DevServerPlugin`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`DevServerPluginConfig`](../interfaces/DevServerPluginConfig.md) | Plugin configuration options. |

#### Defined in

[packages/repack/src/webpack/plugins/DevServerPlugin/DevServerPlugin.ts:41](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/DevServerPlugin/DevServerPlugin.ts#L41)

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

[packages/repack/src/webpack/plugins/DevServerPlugin/DevServerPlugin.ts:51](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/DevServerPlugin/DevServerPlugin.ts#L51)
