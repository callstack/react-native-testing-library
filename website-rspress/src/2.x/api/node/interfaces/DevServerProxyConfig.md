# Interface: DevServerProxyConfig

[DevServerProxy](../classes/DevServerProxy.md) configuration options.

## Hierarchy

- [`BaseDevServerConfig`](./BaseDevServerConfig.md)

  ↳ **`DevServerProxyConfig`**

## Table of contents

### Properties

- [cert](./DevServerProxyConfig.md#cert)
- [context](./DevServerProxyConfig.md#context)
- [enabled](./DevServerProxyConfig.md#enabled)
- [hmr](./DevServerProxyConfig.md#hmr)
- [host](./DevServerProxyConfig.md#host)
- [https](./DevServerProxyConfig.md#https)
- [key](./DevServerProxyConfig.md#key)
- [platform](./DevServerProxyConfig.md#platform)
- [port](./DevServerProxyConfig.md#port)

## Properties

### cert

• `Optional` **cert**: `string`

Path to certificate when running server on HTTPS.

#### Inherited from

[BaseDevServerConfig](./BaseDevServerConfig.md).[cert](./BaseDevServerConfig.md#cert)

#### Defined in

[packages/repack/src/types.ts:95](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L95)

___

### context

• **context**: `string`

Context in which all resolution happens. Usually it's project root directory.

#### Inherited from

[BaseDevServerConfig](./BaseDevServerConfig.md).[context](./BaseDevServerConfig.md#context)

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:22](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L22)

___

### enabled

• `Optional` **enabled**: `boolean`

Whether to start development server.

#### Inherited from

[BaseDevServerConfig](./BaseDevServerConfig.md).[enabled](./BaseDevServerConfig.md#enabled)

#### Defined in

[packages/repack/src/types.ts:84](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L84)

___

### hmr

• `Optional` **hmr**: `boolean`

Whether to enable Hot Module Replacement.

#### Inherited from

[BaseDevServerConfig](./BaseDevServerConfig.md).[hmr](./BaseDevServerConfig.md#hmr)

#### Defined in

[packages/repack/src/types.ts:99](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L99)

___

### host

• `Optional` **host**: `string`

Hostname or IP address under which to run the development server.
When left unspecified, it will listen on all available network interfaces, similarly to listening on '0.0.0.0'.

#### Inherited from

[BaseDevServerConfig](./BaseDevServerConfig.md).[host](./BaseDevServerConfig.md#host)

#### Defined in

[packages/repack/src/types.ts:89](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L89)

___

### https

• `Optional` **https**: `boolean`

Whether to run server on HTTPS instead of HTTP.

#### Inherited from

[BaseDevServerConfig](./BaseDevServerConfig.md).[https](./BaseDevServerConfig.md#https)

#### Defined in

[packages/repack/src/types.ts:93](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L93)

___

### key

• `Optional` **key**: `string`

Path to certificate key when running server on HTTPS.

#### Inherited from

[BaseDevServerConfig](./BaseDevServerConfig.md).[key](./BaseDevServerConfig.md#key)

#### Defined in

[packages/repack/src/types.ts:97](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L97)

___

### platform

• **platform**: `string`

Target application platform.

#### Inherited from

[BaseDevServerConfig](./BaseDevServerConfig.md).[platform](./BaseDevServerConfig.md#platform)

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:24](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L24)

___

### port

• **port**: `number`

Port under which to run the development server. See: [DEFAULT_PORT](../variables/DEFAULT_PORT.md).

#### Inherited from

[BaseDevServerConfig](./BaseDevServerConfig.md).[port](./BaseDevServerConfig.md#port)

#### Defined in

[packages/repack/src/types.ts:91](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L91)
