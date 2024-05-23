# Class: BaseDevServer

Base class for all Fastify-based servers.
It handles creation of a Fastify instance, creation of all WebSocket servers and running Fastify.

## Hierarchy

- **`BaseDevServer`**

  ↳ [`DevServer`](./DevServer.md)

  ↳ [`DevServerProxy`](./DevServerProxy.md)

## Table of contents

### Constructors

- [constructor](./BaseDevServer.md#constructor)

### Properties

- [config](./BaseDevServer.md#config)
- [fastify](./BaseDevServer.md#fastify)
- [wsClientServer](./BaseDevServer.md#wsclientserver)
- [wsDebuggerServer](./BaseDevServer.md#wsdebuggerserver)
- [wsEventsServer](./BaseDevServer.md#wseventsserver)
- [wsMessageServer](./BaseDevServer.md#wsmessageserver)
- [wsRouter](./BaseDevServer.md#wsrouter)

### Methods

- [run](./BaseDevServer.md#run)
- [setup](./BaseDevServer.md#setup)

## Constructors

### constructor

• **new BaseDevServer**(`config`, `loggerOptions?`)

Constructs new `BaseDevServer` instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`BaseDevServerConfig`](../interfaces/BaseDevServerConfig.md) | Configuration options. |
| `loggerOptions?` | [`DevServerLoggerOptions`](../interfaces/DevServerLoggerOptions.md) | Logger options. |

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:56](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L56)

## Properties

### config

• `Protected` **config**: [`BaseDevServerConfig`](../interfaces/BaseDevServerConfig.md)

Configuration options.

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:35](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L35)

___

### fastify

• **fastify**: [`FastifyDevServer`](../types/FastifyDevServer.md)

Fastify instance.

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:38](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L38)

___

### wsClientServer

• **wsClientServer**: [`WebSocketDevClientServer`](./WebSocketDevClientServer.md)

Server instance for React Native clients.

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:48](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L48)

___

### wsDebuggerServer

• **wsDebuggerServer**: [`WebSocketDebuggerServer`](./WebSocketDebuggerServer.md)

Debugger server instance.

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:42](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L42)

___

### wsEventsServer

• **wsEventsServer**: [`WebSocketEventsServer`](./WebSocketEventsServer.md)

Events server instance.

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:46](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L46)

___

### wsMessageServer

• **wsMessageServer**: [`WebSocketMessageServer`](./WebSocketMessageServer.md)

Message server instance.

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:44](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L44)

___

### wsRouter

• **wsRouter**: `WebSocketRouter`

WebSocket router instance.

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:40](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L40)

## Methods

### run

▸ **run**(): `Promise`<`void`\>

Runs Fastify and listens on port and host specified in constructor.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:208](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L208)

___

### setup

▸ **setup**(): `Promise`<`void`\>

Sets up common routes.

All classes that implements [BaseDevServer](./BaseDevServer.md) should call this method before
calling [run](./BaseDevServer.md#run).

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:99](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L99)
