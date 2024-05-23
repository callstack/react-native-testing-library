# Class: ReactRefreshPlugin

[plugins](../modules/plugins.md).ReactRefreshPlugin

Class for setting up Hot Module Replacement and React Refresh support using `@pmmmwh/react-refresh-webpack-plugin`.

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./plugins.ReactRefreshPlugin.md#constructor)

### Methods

- [apply](./plugins.ReactRefreshPlugin.md#apply)

## Constructors

### constructor

• **new ReactRefreshPlugin**(`config?`)

Constructs new `ReactRefreshPlugin`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`ReactRefreshPluginConfig`](../interfaces/plugins.ReactRefreshPluginConfig.md) | Plugin configuration options. |

#### Defined in

[packages/repack/src/webpack/plugins/ReactRefreshPlugin.ts:32](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/ReactRefreshPlugin.ts#L32)

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

[packages/repack/src/webpack/plugins/ReactRefreshPlugin.ts:39](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/ReactRefreshPlugin.ts#L39)
