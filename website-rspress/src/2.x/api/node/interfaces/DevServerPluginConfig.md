# Interface: DevServerPluginConfig

[DevServerPlugin](../classes/DevServerPlugin.md) configuration options.

## Hierarchy

- `Omit`<[`DevServerConfig`](./DevServerConfig.md), ``"context"``\>

  ↳ **`DevServerPluginConfig`**

## Table of contents

### Properties

- [cert](./DevServerPluginConfig.md#cert)
- [enabled](./DevServerPluginConfig.md#enabled)
- [hmr](./DevServerPluginConfig.md#hmr)
- [host](./DevServerPluginConfig.md#host)
- [https](./DevServerPluginConfig.md#https)
- [key](./DevServerPluginConfig.md#key)
- [platform](./DevServerPluginConfig.md#platform)
- [port](./DevServerPluginConfig.md#port)

## Properties

### cert

• `Optional` **cert**: `string`

Path to certificate when running server on HTTPS.

#### Inherited from

Omit.cert

#### Defined in

[packages/repack/src/types.ts:95](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L95)

___

### enabled

• `Optional` **enabled**: `boolean`

Whether to run development server or not.

#### Overrides

Omit.enabled

#### Defined in

[packages/repack/src/webpack/plugins/DevServerPlugin/DevServerPlugin.ts:22](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/DevServerPlugin/DevServerPlugin.ts#L22)

___

### hmr

• `Optional` **hmr**: `boolean`

Whether Hot Module Replacement / React Refresh should be enabled. Defaults to `true`.

#### Overrides

Omit.hmr

#### Defined in

[packages/repack/src/webpack/plugins/DevServerPlugin/DevServerPlugin.ts:26](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/DevServerPlugin/DevServerPlugin.ts#L26)

___

### host

• `Optional` **host**: `string`

Hostname or IP address under which to run the development server.
When left unspecified, it will listen on all available network interfaces, similarly to listening on '0.0.0.0'.

#### Inherited from

Omit.host

#### Defined in

[packages/repack/src/types.ts:89](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L89)

___

### https

• `Optional` **https**: `boolean`

Whether to run server on HTTPS instead of HTTP.

#### Inherited from

Omit.https

#### Defined in

[packages/repack/src/types.ts:93](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L93)

___

### key

• `Optional` **key**: `string`

Path to certificate key when running server on HTTPS.

#### Inherited from

Omit.key

#### Defined in

[packages/repack/src/types.ts:97](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L97)

___

### platform

• **platform**: `string`

Target application platform.

#### Inherited from

Omit.platform

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:24](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L24)

___

### port

• **port**: `number`

Port under which to run the development server. See: [DEFAULT_PORT](../variables/DEFAULT_PORT.md).

#### Inherited from

Omit.port

#### Defined in

[packages/repack/src/types.ts:91](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L91)
