# Class: WebSocketDevClientServer

Class for creating a WebSocket server for communication with React Native clients.
All client logs - logs from React Native application - are processed here.

## Hierarchy

- [`WebSocketServer`](./WebSocketServer.md)

  ↳ **`WebSocketDevClientServer`**

## Table of contents

### Constructors

- [constructor](./WebSocketDevClientServer.md#constructor)

### Properties

- [fastify](./WebSocketDevClientServer.md#fastify)
- [paths](./WebSocketDevClientServer.md#paths)
- [server](./WebSocketDevClientServer.md#server)

### Methods

- [onConnection](./WebSocketDevClientServer.md#onconnection)
- [processMessage](./WebSocketDevClientServer.md#processmessage)
- [shouldUpgrade](./WebSocketDevClientServer.md#shouldupgrade)
- [upgrade](./WebSocketDevClientServer.md#upgrade)

## Constructors

### constructor

• **new WebSocketDevClientServer**(`fastify`)

Create new instance of WebSocketDevClientServer and attach it to the given Fastify instance.
Any logging information, will be passed through standard `fastify.log` API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fastify` | [`FastifyDevServer`](../types/FastifyDevServer.md) | Fastify instance to attach the WebSocket server to. |

#### Overrides

[WebSocketServer](./WebSocketServer.md).[constructor](./WebSocketServer.md#constructor)

#### Defined in

[packages/repack/src/server/ws/WebSocketDevClientServer.ts:21](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketDevClientServer.ts#L21)

## Properties

### fastify

• `Protected` **fastify**: [`FastifyDevServer`](../types/FastifyDevServer.md)

Fastify instance from which [server](./WebSocketDevClientServer.md#server) will receive upgrade connections.

#### Inherited from

[WebSocketServer](./WebSocketServer.md).[fastify](./WebSocketServer.md#fastify)

#### Defined in

[packages/repack/src/server/ws/WebSocketServer.ts:16](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketServer.ts#L16)

___

### paths

• `Readonly` **paths**: `string`[]

#### Inherited from

[WebSocketServer](./WebSocketServer.md).[paths](./WebSocketServer.md#paths)

#### Defined in

[packages/repack/src/server/ws/WebSocketServer.ts:18](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketServer.ts#L18)

___

### server

• `Readonly` **server**: `Server`

An instance of the underlying WebSocket server.

#### Inherited from

[WebSocketServer](./WebSocketServer.md).[server](./WebSocketServer.md#server)

#### Defined in

[packages/repack/src/server/ws/WebSocketServer.ts:13](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketServer.ts#L13)

## Methods

### onConnection

▸ **onConnection**(`socket`): `void`

Process new WebSocket connection from client application.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `socket` | `WebSocket` | Incoming client's WebSocket connection. |

#### Returns

`void`

#### Overrides

[WebSocketServer](./WebSocketServer.md).[onConnection](./WebSocketServer.md#onconnection)

#### Defined in

[packages/repack/src/server/ws/WebSocketDevClientServer.ts:52](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketDevClientServer.ts#L52)

___

### processMessage

▸ **processMessage**(`message`): `void`

Process client message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Stringified client message. |

#### Returns

`void`

#### Defined in

[packages/repack/src/server/ws/WebSocketDevClientServer.ts:30](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketDevClientServer.ts#L30)

___

### shouldUpgrade

▸ **shouldUpgrade**(`pathname`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pathname` | `string` |

#### Returns

`boolean`

#### Inherited from

[WebSocketServer](./WebSocketServer.md).[shouldUpgrade](./WebSocketServer.md#shouldupgrade)

#### Defined in

[packages/repack/src/server/ws/WebSocketServer.ts:45](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketServer.ts#L45)

___

### upgrade

▸ **upgrade**(`request`, `socket`, `head`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `IncomingMessage` |
| `socket` | `Socket` |
| `head` | `Buffer` |

#### Returns

`void`

#### Inherited from

[WebSocketServer](./WebSocketServer.md).[upgrade](./WebSocketServer.md#upgrade)

#### Defined in

[packages/repack/src/server/ws/WebSocketServer.ts:49](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketServer.ts#L49)
