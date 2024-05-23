# Interface: GetPublicPathOptions

[getPublicPath](../functions/getPublicPath.md) options.

## Hierarchy

- `Pick`<[`DevServerConfig`](./DevServerConfig.md), ``"enabled"`` \| ``"host"`` \| ``"https"``\>

  ↳ **`GetPublicPathOptions`**

## Table of contents

### Properties

- [enabled](./GetPublicPathOptions.md#enabled)
- [host](./GetPublicPathOptions.md#host)
- [https](./GetPublicPathOptions.md#https)
- [port](./GetPublicPathOptions.md#port)

## Properties

### enabled

• `Optional` **enabled**: `boolean`

Whether to start development server.

#### Inherited from

Pick.enabled

#### Defined in

[packages/repack/src/types.ts:84](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L84)

___

### host

• `Optional` **host**: `string`

Hostname or IP address under which to run the development server.
When left unspecified, it will listen on all available network interfaces, similarly to listening on '0.0.0.0'.

#### Inherited from

Pick.host

#### Defined in

[packages/repack/src/types.ts:89](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L89)

___

### https

• `Optional` **https**: `boolean`

Whether to run server on HTTPS instead of HTTP.

#### Inherited from

Pick.https

#### Defined in

[packages/repack/src/types.ts:93](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L93)

___

### port

• `Optional` **port**: `number`

Port under which to run the development server.

#### Defined in

[packages/repack/src/webpack/utils/getPublicPath.ts:7](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/utils/getPublicPath.ts#L7)
