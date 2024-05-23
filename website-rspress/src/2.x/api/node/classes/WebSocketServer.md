# Class: WebSocketServer

Abstract class for providing common logic (eg routing) for all WebSocket servers.

## Hierarchy

- **`WebSocketServer`**

  ↳ [`WebSocketDebuggerServer`](./WebSocketDebuggerServer.md)

  ↳ [`WebSocketDevClientServer`](./WebSocketDevClientServer.md)

  ↳ [`WebSocketEventsServer`](./WebSocketEventsServer.md)

  ↳ [`WebSocketHMRServer`](./WebSocketHMRServer.md)

  ↳ [`WebSocketMessageServer`](./WebSocketMessageServer.md)

## Table of contents

### Constructors

- [constructor](./WebSocketServer.md#constructor)

### Properties

- [fastify](./WebSocketServer.md#fastify)
- [paths](./WebSocketServer.md#paths)
- [server](./WebSocketServer.md#server)

### Methods

- [onConnection](./WebSocketServer.md#onconnection)
- [shouldUpgrade](./WebSocketServer.md#shouldupgrade)
- [upgrade](./WebSocketServer.md#upgrade)

## Constructors

### constructor

• **new WebSocketServer**(`fastify`, `path`, `wssOptions?`)

Create a new instance of the WebSocketServer.
Any logging information, will be passed through standard `fastify.log` API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fastify` | [`FastifyDevServer`](../types/FastifyDevServer.md) | Fastify instance to which the WebSocket will be attached to. |
| `path` | `string` \| `string`[] | Path on which this WebSocketServer will be accepting connections. |
| `wssOptions` | `Omit`<`ServerOptions`, ``"host"`` \| ``"port"`` \| ``"noServer"`` \| ``"server"`` \| ``"path"``\> | WebSocket Server options. |

#### Defined in

[packages/repack/src/server/ws/WebSocketServer.ts:28](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketServer.ts#L28)

## Properties

### fastify

• `Protected` **fastify**: [`FastifyDevServer`](../types/FastifyDevServer.md)

Fastify instance from which [server](./WebSocketServer.md#server) will receive upgrade connections.

#### Defined in

[packages/repack/src/server/ws/WebSocketServer.ts:16](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketServer.ts#L16)

___

### paths

• `Readonly` **paths**: `string`[]

#### Defined in

[packages/repack/src/server/ws/WebSocketServer.ts:18](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketServer.ts#L18)

___

### server

• `Readonly` **server**: `Server`

An instance of the underlying WebSocket server.

#### Defined in

[packages/repack/src/server/ws/WebSocketServer.ts:13](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketServer.ts#L13)

## Methods

### onConnection

▸ `Abstract` **onConnection**(`socket`, `request`): `void`

Process incoming WebSocket connection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `socket` | `WebSocket` | Incoming WebSocket connection. |
| `request` | `IncomingMessage` | Upgrade request for the connection. |

#### Returns

`void`

#### Defined in

[packages/repack/src/server/ws/WebSocketServer.ts:61](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketServer.ts#L61)

___

### shouldUpgrade

▸ **shouldUpgrade**(`pathname`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pathname` | `string` |

#### Returns

`boolean`

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

#### Defined in

[packages/repack/src/server/ws/WebSocketServer.ts:49](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketServer.ts#L49)
