# Class: AssetsResolverPlugin

Plugin for resolving assets (images, audio, video etc) for React Native applications.

Assets processing in React Native differs from Web, Node.js or other targets.
This plugin in combination with `@callstack/repack/assets-loader` allows
you to use assets in the same way as you would do when using Metro.

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./AssetsResolverPlugin.md#constructor)

### Methods

- [apply](./AssetsResolverPlugin.md#apply)

## Constructors

### constructor

• **new AssetsResolverPlugin**(`config`)

Constructs new `AssetsResolverPlugin`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`AssetsResolverPluginConfig`](../interfaces/AssetsResolverPluginConfig.md) | Plugin configuration options. |

#### Defined in

[packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetsResolverPlugin.ts:26](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetsResolverPlugin.ts#L26)

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

[packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetsResolverPlugin.ts:37](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/AssetsResolverPlugin/AssetsResolverPlugin.ts#L37)
