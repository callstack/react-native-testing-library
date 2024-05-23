# Class: AssetsPlugin

Plugin for loading and processing assets (images, audio, video etc) for
React Native applications.

Assets processing in React Native differs from Web, Node.js or other targets. This plugin allows
you to use assets in the same way as you would do when using Metro.

**`deprecated`** Use dedicated rule with `@callstack/repack/assets-loader` and `AssetsResolverPlugin`.
More information can be found here: https://github.com/callstack/repack/pull/81

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./AssetsPlugin.md#constructor)

### Methods

- [apply](./AssetsPlugin.md#apply)

## Constructors

### constructor

• **new AssetsPlugin**(`config`)

Constructs new `AssetsPlugin`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`AssetsPluginConfig`](../interfaces/AssetsPluginConfig.md) | Plugin configuration options. |

#### Defined in

[packages/repack/src/webpack/plugins/AssetsPlugin.ts:49](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/AssetsPlugin.ts#L49)

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

[packages/repack/src/webpack/plugins/AssetsPlugin.ts:61](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/AssetsPlugin.ts#L61)
