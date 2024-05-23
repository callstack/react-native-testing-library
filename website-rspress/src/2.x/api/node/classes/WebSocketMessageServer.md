# Class: WebSocketMessageServer

Class for creating a WebSocket server and sending messages between development server
and the React Native applications.

Based on: https://github.com/react-native-community/cli/blob/v4.14.0/packages/cli-server-api/src/websocket/messageSocketServer.ts

## Hierarchy

- [`WebSocketServer`](./WebSocketServer.md)

  ↳ **`WebSocketMessageServer`**

## Table of contents

### Constructors

- [constructor](./WebSocketMessageServer.md#constructor)

### Properties

- [fastify](./WebSocketMessageServer.md#fastify)
- [paths](./WebSocketMessageServer.md#paths)
- [server](./WebSocketMessageServer.md#server)
- [PROTOCOL\_VERSION](./WebSocketMessageServer.md#protocol_version)

### Methods

- [broadcast](./WebSocketMessageServer.md#broadcast)
- [forwardRequest](./WebSocketMessageServer.md#forwardrequest)
- [forwardResponse](./WebSocketMessageServer.md#forwardresponse)
- [getClientSocket](./WebSocketMessageServer.md#getclientsocket)
- [handleError](./WebSocketMessageServer.md#handleerror)
- [onConnection](./WebSocketMessageServer.md#onconnection)
- [parseMessage](./WebSocketMessageServer.md#parsemessage)
- [processServerRequest](./WebSocketMessageServer.md#processserverrequest)
- [sendBroadcast](./WebSocketMessageServer.md#sendbroadcast)
- [shouldUpgrade](./WebSocketMessageServer.md#shouldupgrade)
- [upgrade](./WebSocketMessageServer.md#upgrade)
- [isBroadcast](./WebSocketMessageServer.md#isbroadcast)
- [isRequest](./WebSocketMessageServer.md#isrequest)
- [isResponse](./WebSocketMessageServer.md#isresponse)

## Constructors

### constructor

• **new WebSocketMessageServer**(`fastify`)

Create new instance of WebSocketMessageServer and attach it to the given Fastify instance.
Any logging information, will be passed through standard `fastify.log` API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fastify` | [`FastifyDevServer`](../types/FastifyDevServer.md) | Fastify instance to attach the WebSocket server to. |

#### Overrides

[WebSocketServer](./WebSocketServer.md).[constructor](./WebSocketServer.md#constructor)

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:92](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L92)

## Properties

### fastify

• `Protected` **fastify**: [`FastifyDevServer`](../types/FastifyDevServer.md)

Fastify instance from which [server](./WebSocketMessageServer.md#server) will receive upgrade connections.

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

[packages/repack/src/server/ws/WebSocketMessageServer.ts:39](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L39)

## Methods

### broadcast

▸ **broadcast**(`method`, `params?`): `void`

Send method broadcast to all connected clients.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | Method name to broadcast. |
| `params?` | `Record`<`string`, `any`\> | Method parameters. |

#### Returns

`void`

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:348](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L348)

___

### forwardRequest

▸ **forwardRequest**(`clientId`, `message`): `void`

Send given request `message` to it's designated client's socket based on `message.target`.
The target client must be connected, otherwise it will throw an error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientId` | `string` | Id of the client that requested the forward. |
| `message` | `Partial`<[`ReactNativeMessage`](../interfaces/ReactNativeMessage.md)\> | Message to forward. |

#### Returns

`void`

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:204](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L204)

___

### forwardResponse

▸ **forwardResponse**(`message`): `void`

Send given response `message` to it's designated client's socket based
on `message.id.clientId`.
The target client must be connected, otherwise it will throw an error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Partial`<[`ReactNativeMessage`](../interfaces/ReactNativeMessage.md)\> | Message to forward. |

#### Returns

`void`

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:235](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L235)

___

### getClientSocket

▸ **getClientSocket**(`clientId`): `WebSocketWithUpgradeReq`

Get client's WebSocket connection for given `clientId`.
Throws if no such client is connected.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientId` | `string` | Id of the client. |

#### Returns

`WebSocketWithUpgradeReq`

WebSocket connection.

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:140](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L140)

___

### handleError

▸ **handleError**(`clientId`, `message`, `error`): `void`

Process error by sending an error message to the client whose message caused the error
to occur.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientId` | `string` | Id of the client whose message caused an error. |
| `message` | `Partial`<[`ReactNativeMessage`](../interfaces/ReactNativeMessage.md)\> | Original message which caused the error. |
| `error` | `Error` | Concrete instance of an error that occurred. |

#### Returns

`void`

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:156](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L156)

___

### onConnection

▸ **onConnection**(`socket`, `request`): `void`

Process new client's WebSocket connection.

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

[packages/repack/src/server/ws/WebSocketMessageServer.ts:358](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L358)

___

### parseMessage

▸ **parseMessage**(`data`, `binary`): `undefined` \| `Partial`<[`ReactNativeMessage`](../interfaces/ReactNativeMessage.md)\>

Parse stringified message into a [ReactNativeMessage](../interfaces/ReactNativeMessage.md).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `string` | Stringified message. |
| `binary` | `any` | Additional binary data if any. |

#### Returns

`undefined` \| `Partial`<[`ReactNativeMessage`](../interfaces/ReactNativeMessage.md)\>

Parsed message or `undefined` if parsing failed.

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:103](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L103)

___

### processServerRequest

▸ **processServerRequest**(`clientId`, `message`): `void`

Process request message targeted towards this [WebSocketMessageServer](./WebSocketMessageServer.md)
and send back the results.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientId` | `string` | Id of the client who send the message. |
| `message` | `Partial`<[`ReactNativeMessage`](../interfaces/ReactNativeMessage.md)\> | The message to process by the server. |

#### Returns

`void`

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:258](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L258)

___

### sendBroadcast

▸ **sendBroadcast**(`broadcasterId`, `message`): `void`

Broadcast given message to all connected clients.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `broadcasterId` | `undefined` \| `string` | Id of the client who is broadcasting. |
| `message` | `Partial`<[`ReactNativeMessage`](../interfaces/ReactNativeMessage.md)\> | Message to broadcast. |

#### Returns

`void`

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:307](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L307)

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

___

### isBroadcast

▸ `Static` **isBroadcast**(`message`): `boolean`

Check if message is a broadcast request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Partial`<[`ReactNativeMessage`](../interfaces/ReactNativeMessage.md)\> | Message to check. |

#### Returns

`boolean`

True if message is a broadcast request and should be broadcasted
with [sendBroadcast](./WebSocketMessageServer.md#sendbroadcast).

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:48](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L48)

___

### isRequest

▸ `Static` **isRequest**(`message`): `boolean`

Check if message is a method request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Partial`<[`ReactNativeMessage`](../interfaces/ReactNativeMessage.md)\> | Message to check. |

#### Returns

`boolean`

True if message is a request.

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:62](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L62)

___

### isResponse

▸ `Static` **isResponse**(`message`): `boolean`

Check if message is a response with results of performing some request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Partial`<[`ReactNativeMessage`](../interfaces/ReactNativeMessage.md)\> | Message to check. |

#### Returns

`boolean`

True if message is a response.

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:74](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L74)
