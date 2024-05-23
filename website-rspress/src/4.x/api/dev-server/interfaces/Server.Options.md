# Interface: Options

[Server](../modules/Server.md).Options

Development server options.

## Table of contents

### Properties

- [host](./Server.Options.md#host)
- [https](./Server.Options.md#https)
- [port](./Server.Options.md#port)
- [rootDir](./Server.Options.md#rootdir)

## Properties

### host

• `Optional` **host**: `string`

Hostname or IP address under which to run the development server.
When left unspecified, it will listen on all available network interfaces, similarly to listening on '0.0.0.0'.

#### Defined in

[types.ts:39](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L39)

___

### https

• `Optional` **https**: `Object`

Options for running the server as HTTPS. If `undefined`, the server will run as HTTP.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cert?` | `string` | Path to certificate when running server as HTTPS. |
| `key?` | `string` | Path to certificate key when running server as HTTPS. |

#### Defined in

[types.ts:42](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L42)

___

### port

• **port**: `number`

Port under which to run the development server.

#### Defined in

[types.ts:33](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L33)

___

### rootDir

• **rootDir**: `string`

Root directory of the project.

#### Defined in

[types.ts:30](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L30)
