# Class: TargetPlugin

Plugin for tweaking the JavaScript runtime code to account for React Native environment.

Globally available APIs differ with React Native and other target's like Web, so there are some
tweaks necessary to make the final bundle runnable inside React Native's JavaScript VM.

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./TargetPlugin.md#constructor)

### Methods

- [apply](./TargetPlugin.md#apply)

## Constructors

### constructor

• **new TargetPlugin**()

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

[packages/repack/src/webpack/plugins/TargetPlugin.ts:20](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/TargetPlugin.ts#L20)
