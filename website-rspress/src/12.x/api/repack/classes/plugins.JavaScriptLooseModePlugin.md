# Class: JavaScriptLooseModePlugin

[plugins](../modules/plugins.md).JavaScriptLooseModePlugin

Enable JavaScript loose mode, by removing `use strict` directives from the code.
This plugin should only be used for compatibility reasons with Metro, where some libraries
might not work in JavaScript Strict mode.

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./plugins.JavaScriptLooseModePlugin.md#constructor)

### Methods

- [apply](./plugins.JavaScriptLooseModePlugin.md#apply)

## Constructors

### constructor

• **new JavaScriptLooseModePlugin**(`config`)

Constructs new `JavaScriptLooseModePlugin`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`JavaScriptLooseModePluginConfig`](../interfaces/plugins.JavaScriptLooseModePluginConfig.md) | Plugin configuration options. |

#### Defined in

[packages/repack/src/webpack/plugins/JavaScriptLooseModePlugin.ts:29](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/JavaScriptLooseModePlugin.ts#L29)

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

[packages/repack/src/webpack/plugins/JavaScriptLooseModePlugin.ts:36](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/JavaScriptLooseModePlugin.ts#L36)
