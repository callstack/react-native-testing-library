# Class: RepackTargetPlugin

[plugins](../modules/plugins.md).RepackTargetPlugin

Plugin for tweaking the JavaScript runtime code to account for React Native environment.

Globally available APIs differ with React Native and other target's like Web, so there are some
tweaks necessary to make the final bundle runnable inside React Native's JavaScript VM.

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./plugins.RepackTargetPlugin.md#constructor)

### Methods

- [apply](./plugins.RepackTargetPlugin.md#apply)

## Constructors

### constructor

• **new RepackTargetPlugin**(`config?`)

Constructs new `RepackTargetPlugin`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`RepackTargetPluginConfig`](../interfaces/plugins.RepackTargetPluginConfig.md) | Plugin configuration options. |

#### Defined in

[packages/repack/src/webpack/plugins/RepackTargetPlugin/RepackTargetPlugin.ts:27](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/RepackTargetPlugin/RepackTargetPlugin.ts#L27)

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

[packages/repack/src/webpack/plugins/RepackTargetPlugin/RepackTargetPlugin.ts:34](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/RepackTargetPlugin/RepackTargetPlugin.ts#L34)
