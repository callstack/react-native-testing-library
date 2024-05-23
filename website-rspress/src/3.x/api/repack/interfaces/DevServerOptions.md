# Interface: DevServerOptions

Development server configuration options.

## Hierarchy

- **`DevServerOptions`**

  ↳ [`ReactRefreshPluginConfig`](./plugins.ReactRefreshPluginConfig.md)

## Table of contents

### Properties

- [hmr](./DevServerOptions.md#hmr)
- [host](./DevServerOptions.md#host)
- [https](./DevServerOptions.md#https)
- [port](./DevServerOptions.md#port)

## Properties

### hmr

• `Optional` **hmr**: `boolean`

Whether to enable Hot Module Replacement.

#### Defined in

[packages/repack/src/types.ts:130](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L130)

___

### host

• `Optional` **host**: `string`

Hostname or IP address under which to run the development server.
When left unspecified, it will listen on all available network interfaces, similarly to listening on '0.0.0.0'.

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

#### Defined in

[packages/repack/src/types.ts:121](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L121)

___

### port

• **port**: `number`

Port under which to run the development server. See: {@link DEFAULT_PORT}.

#### Defined in

[packages/repack/src/types.ts:116](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L116)
