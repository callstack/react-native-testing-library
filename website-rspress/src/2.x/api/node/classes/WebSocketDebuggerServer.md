# Class: WebSocketDebuggerServer

Class for creating a WebSocket server and providing a bridge between
debugger UI (Remote JS debugger) and the running React Native application.

React Native application (aka client) will send and receive messages from the debugger UI
which runs inside a browser.

## Hierarchy

- [`WebSocketServer`](./WebSocketServer.md)

  ↳ **`WebSocketDebuggerServer`**

## Table of contents

### Constructors

- [constructor](./WebSocketDebuggerServer.md#constructor)

### Properties

- [fastify](./WebSocketDebuggerServer.md#fastify)
- [paths](./WebSocketDebuggerServer.md#paths)
- [server](./WebSocketDebuggerServer.md#server)

### Methods

- [isDebuggerConnected](./WebSocketDebuggerServer.md#isdebuggerconnected)
- [onClientConnection](./WebSocketDebuggerServer.md#onclientconnection)
- [onConnection](./WebSocketDebuggerServer.md#onconnection)
- [onDebuggerConnection](./WebSocketDebuggerServer.md#ondebuggerconnection)
- [send](./WebSocketDebuggerServer.md#send)
- [shouldUpgrade](./WebSocketDebuggerServer.md#shouldupgrade)
- [upgrade](./WebSocketDebuggerServer.md#upgrade)

## Constructors

### constructor

• **new WebSocketDebuggerServer**(`fastify`)

Create new instance of WebSocketDebuggerServer and attach it to the given Fastify instance.
Any logging information, will be passed through standard `fastify.log` API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fastify` | [`FastifyDevServer`](../types/FastifyDevServer.md) | Fastify instance to attach the WebSocket server to. |

#### Overrides

[WebSocketServer](./WebSocketServer.md).[constructor](./WebSocketServer.md#constructor)

#### Defined in

[packages/repack/src/server/ws/WebSocketDebuggerServer.ts:32](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketDebuggerServer.ts#L32)

## Properties

### fastify

• `Protected` **fastify**: [`FastifyDevServer`](../types/FastifyDevServer.md)

Fastify instance from which [server](./WebSocketDebuggerServer.md#server) will receive upgrade connections.

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

### isDebuggerConnected

▸ **isDebuggerConnected**(): `boolean`

Check if debugger UI is connected to the WebSocketDebuggerServer.

#### Returns

`boolean`

#### Defined in

[packages/repack/src/server/ws/WebSocketDebuggerServer.ts:39](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketDebuggerServer.ts#L39)

___

### onClientConnection

▸ **onClientConnection**(`socket`): `void`

Process new WebSocket connection from React Native app (client)
and close any previous connection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `socket` | `WebSocket` | Incoming client WebSocket connection. |

#### Returns

`void`

#### Defined in

[packages/repack/src/server/ws/WebSocketDebuggerServer.ts:110](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketDebuggerServer.ts#L110)

___

### onConnection

▸ **onConnection**(`socket`, `request`): `void`

Process new WebSocket connection. The upgrade request should contain `role` query param
for determining the type of the connection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `socket` | `WebSocket` | Incoming WebSocket connection. |
| `request` | `IncomingMessage` | Upgrade request for the connection. |

#### Returns

`void`

#### Overrides

[WebSocketServer](./WebSocketServer.md).[onConnection](./WebSocketServer.md#onconnection)

#### Defined in

[packages/repack/src/server/ws/WebSocketDebuggerServer.ts:64](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketDebuggerServer.ts#L64)

___

### onDebuggerConnection

▸ **onDebuggerConnection**(`socket`): `void`

Process new WebSocket connection from Debugger UI (Remote JS Debugger).
If there's already open connection, the new one gets closed automatically.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `socket` | `WebSocket` | Incoming debugger WebSocket connection. |

#### Returns

`void`

#### Defined in

[packages/repack/src/server/ws/WebSocketDebuggerServer.ts:83](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketDebuggerServer.ts#L83)

___

### send

▸ **send**(`socket`, `message`): `void`

Send a message to a given WebSocket connection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `socket` | `undefined` \| `WebSocket` | WebSocket connection to send the message to. |
| `message` | `string` | Message to send. |

#### Returns

`void`

#### Defined in

[packages/repack/src/server/ws/WebSocketDebuggerServer.ts:49](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketDebuggerServer.ts#L49)

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
