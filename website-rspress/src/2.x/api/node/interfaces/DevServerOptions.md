# Interface: DevServerOptions

Development server configuration options.

Used by [DevServerPlugin](../classes/DevServerPlugin.md), [BaseDevServer](../classes/BaseDevServer.md), [DevServer](../classes/DevServer.md) and [DevServerProxy](../classes/DevServerProxy.md).

## Hierarchy

- **`DevServerOptions`**

  ↳ [`BaseDevServerConfig`](./BaseDevServerConfig.md)

## Table of contents

### Properties

- [cert](./DevServerOptions.md#cert)
- [enabled](./DevServerOptions.md#enabled)
- [hmr](./DevServerOptions.md#hmr)
- [host](./DevServerOptions.md#host)
- [https](./DevServerOptions.md#https)
- [key](./DevServerOptions.md#key)
- [port](./DevServerOptions.md#port)

## Properties

### cert

• `Optional` **cert**: `string`

Path to certificate when running server on HTTPS.

#### Defined in

[packages/repack/src/types.ts:95](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L95)

___

### enabled

• `Optional` **enabled**: `boolean`

Whether to start development server.

#### Defined in

[packages/repack/src/types.ts:84](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L84)

___

### hmr

• `Optional` **hmr**: `boolean`

Whether to enable Hot Module Replacement.

#### Defined in

[packages/repack/src/types.ts:99](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L99)

___

### host

• `Optional` **host**: `string`

Hostname or IP address under which to run the development server.
When left unspecified, it will listen on all available network interfaces, similarly to listening on '0.0.0.0'.

#### Defined in

[packages/repack/src/types.ts:89](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L89)

___

### https

• `Optional` **https**: `boolean`

Whether to run server on HTTPS instead of HTTP.

#### Defined in

[packages/repack/src/types.ts:93](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L93)

___

### key

• `Optional` **key**: `string`

Path to certificate key when running server on HTTPS.

#### Defined in

[packages/repack/src/types.ts:97](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L97)

___

### port

• **port**: `number`

Port under which to run the development server. See: [DEFAULT_PORT](../variables/DEFAULT_PORT.md).

#### Defined in

[packages/repack/src/types.ts:91](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L91)
