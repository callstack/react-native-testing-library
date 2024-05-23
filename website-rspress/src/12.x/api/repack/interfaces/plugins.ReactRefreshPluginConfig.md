# Interface: ReactRefreshPluginConfig

[plugins](../modules/plugins.md).ReactRefreshPluginConfig

[ReactRefreshPlugin](../classes/plugins.ReactRefreshPlugin.md) configuration options.

## Hierarchy

- [`DevServerOptions`](./DevServerOptions.md)

  ↳ **`ReactRefreshPluginConfig`**

## Table of contents

### Properties

- [hmr](./plugins.ReactRefreshPluginConfig.md#hmr)
- [host](./plugins.ReactRefreshPluginConfig.md#host)
- [https](./plugins.ReactRefreshPluginConfig.md#https)
- [platform](./plugins.ReactRefreshPluginConfig.md#platform)
- [port](./plugins.ReactRefreshPluginConfig.md#port)

## Properties

### hmr

• `Optional` **hmr**: `boolean`

Whether to enable Hot Module Replacement.

#### Inherited from

[DevServerOptions](./DevServerOptions.md).[hmr](./DevServerOptions.md#hmr)

#### Defined in

[packages/repack/src/types.ts:130](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L130)

___

### host

• `Optional` **host**: `string`

Hostname or IP address under which to run the development server.
When left unspecified, it will listen on all available network interfaces, similarly to listening on '0.0.0.0'.

#### Inherited from

[DevServerOptions](./DevServerOptions.md).[host](./DevServerOptions.md#host)

#### Defined in

[packages/repack/src/types.ts:113](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L113)

___

### https

• `Optional` **https**: `Object`

HTTPS options.
If specified, the server will use HTTPS, otherwise HTTP.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cert?` | `string` | Path to certificate when running server on HTTPS. |
| `key?` | `string` | Path to certificate key when running server on HTTPS. |

#### Inherited from

[DevServerOptions](./DevServerOptions.md).[https](./DevServerOptions.md#https)

#### Defined in

[packages/repack/src/types.ts:121](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L121)

___

### platform

• **platform**: `string`

#### Defined in

[packages/repack/src/webpack/plugins/ReactRefreshPlugin.ts:18](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/ReactRefreshPlugin.ts#L18)

___

### port

• **port**: `number`

Port under which to run the development server. See: {@link DEFAULT_PORT}.

#### Inherited from

[DevServerOptions](./DevServerOptions.md).[port](./DevServerOptions.md#port)

#### Defined in

[packages/repack/src/types.ts:116](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L116)
