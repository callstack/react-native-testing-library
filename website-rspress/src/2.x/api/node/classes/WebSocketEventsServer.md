# Class: WebSocketEventsServer

Class for creating a WebSocket server to process events and reports.

Based on: https://github.com/react-native-community/cli/blob/v4.14.0/packages/cli-server-api/src/websocket/eventsSocketServer.ts

## Hierarchy

- [`WebSocketServer`](./WebSocketServer.md)

  ↳ **`WebSocketEventsServer`**

## Table of contents

### Constructors

- [constructor](./WebSocketEventsServer.md#constructor)

### Properties

- [fastify](./WebSocketEventsServer.md#fastify)
- [paths](./WebSocketEventsServer.md#paths)
- [server](./WebSocketEventsServer.md#server)
- [PROTOCOL\_VERSION](./WebSocketEventsServer.md#protocol_version)

### Methods

- [broadcastEvent](./WebSocketEventsServer.md#broadcastevent)
- [onConnection](./WebSocketEventsServer.md#onconnection)
- [parseMessage](./WebSocketEventsServer.md#parsemessage)
- [serializeMessage](./WebSocketEventsServer.md#serializemessage)
- [shouldUpgrade](./WebSocketEventsServer.md#shouldupgrade)
- [upgrade](./WebSocketEventsServer.md#upgrade)

## Constructors

### constructor

• **new WebSocketEventsServer**(`fastify`, `config`)

Create new instance of WebSocketHMRServer and attach it to the given Fastify instance.
Any logging information, will be passed through standard `fastify.log` API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fastify` | [`FastifyDevServer`](../types/FastifyDevServer.md) | Fastify instance to attach the WebSocket server to. |
| `config` | [`WebSocketEventsServerConfig`](../interfaces/WebSocketEventsServerConfig.md) | Configuration object. |

#### Overrides

[WebSocketServer](./WebSocketServer.md).[constructor](./WebSocketServer.md#constructor)

#### Defined in

[packages/repack/src/server/ws/WebSocketEventsServer.ts:54](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketEventsServer.ts#L54)

## Properties

### fastify

• `Protected` **fastify**: [`FastifyDevServer`](../types/FastifyDevServer.md)

Fastify instance from which [server](./WebSocketEventsServer.md#server) will receive upgrade connections.

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

___

### PROTOCOL\_VERSION

▪ `Static` `Readonly` **PROTOCOL\_VERSION**: ``2``

#### Defined in

[packages/repack/src/server/ws/WebSocketEventsServer.ts:42](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketEventsServer.ts#L42)

## Methods

### broadcastEvent

▸ **broadcastEvent**(`event`): `void`

Broadcast event to all connected clients.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | [`EventMessage`](../interfaces/EventMessage.md) | Event message to broadcast. |

#### Returns

`void`

#### Defined in

[packages/repack/src/server/ws/WebSocketEventsServer.ts:138](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketEventsServer.ts#L138)

___

### onConnection

▸ **onConnection**(`socket`): `void`

Process new client's WebSocket connection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `socket` | `WebSocket` | Incoming WebSocket connection. |

#### Returns

`void`

#### Overrides

[WebSocketServer](./WebSocketServer.md).[onConnection](./WebSocketServer.md#onconnection)

#### Defined in

[packages/repack/src/server/ws/WebSocketEventsServer.ts:167](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketEventsServer.ts#L167)

___

### parseMessage

▸ **parseMessage**(`data`): `undefined` \| [`Command`](../interfaces/Command.md)

Parse received command message from connected client.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `string` | Stringified command message to parse. |

#### Returns

`undefined` \| [`Command`](../interfaces/Command.md)

Parsed command or `undefined` if parsing failed.

#### Defined in

[packages/repack/src/server/ws/WebSocketEventsServer.ts:71](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketEventsServer.ts#L71)

___

### serializeMessage

▸ **serializeMessage**(`message`): `undefined` \| `string`

Stringify `message` into a format that can be transported as a `string`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`EventMessage`](../interfaces/EventMessage.md) | Message to serialize. |

#### Returns

`undefined` \| `string`

String representation of a `message` or `undefined` if serialization failed.

#### Defined in

[packages/repack/src/server/ws/WebSocketEventsServer.ts:97](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketEventsServer.ts#L97)

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
