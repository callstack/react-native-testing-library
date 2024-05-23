# Class: DevServer

Class for setting up and running development server for React Native application.
It's usually created by the [DevServerPlugin](./DevServerPlugin.md).

Each `DevServer` instance is platform-specific, for example for `ios` and `android` platforms,
you need 2 `DevServer` running (on different ports). Alternatively you can
use [DevServerProxy](./DevServerProxy.md) to spawn new processes with Webpack compilations for each platform.

## Hierarchy

- [`BaseDevServer`](./BaseDevServer.md)

  ↳ **`DevServer`**

## Table of contents

### Constructors

- [constructor](./DevServer.md#constructor)

### Properties

- [config](./DevServer.md#config)
- [fastify](./DevServer.md#fastify)
- [hmrServer](./DevServer.md#hmrserver)
- [symbolicator](./DevServer.md#symbolicator)
- [wdm](./DevServer.md#wdm)
- [wsClientServer](./DevServer.md#wsclientserver)
- [wsDashboardServer](./DevServer.md#wsdashboardserver)
- [wsDebuggerServer](./DevServer.md#wsdebuggerserver)
- [wsEventsServer](./DevServer.md#wseventsserver)
- [wsMessageServer](./DevServer.md#wsmessageserver)
- [wsRouter](./DevServer.md#wsrouter)

### Methods

- [run](./DevServer.md#run)
- [setup](./DevServer.md#setup)

## Constructors

### constructor

• **new DevServer**(`config`, `compiler`)

Constructs new `DevServer` instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`DevServerConfig`](../interfaces/DevServerConfig.md) | Configuration options. |
| `compiler` | `Compiler` | Webpack compiler instance. |

#### Overrides

[BaseDevServer](./BaseDevServer.md).[constructor](./BaseDevServer.md#constructor)

#### Defined in

[packages/repack/src/server/DevServer.ts:66](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServer.ts#L66)

## Properties

### config

• `Protected` **config**: [`BaseDevServerConfig`](../interfaces/BaseDevServerConfig.md)

Configuration options.

#### Inherited from

[BaseDevServer](./BaseDevServer.md).[config](./BaseDevServer.md#config)

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:35](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L35)

___

### fastify

• **fastify**: [`FastifyDevServer`](../types/FastifyDevServer.md)

Fastify instance.

#### Inherited from

[BaseDevServer](./BaseDevServer.md).[fastify](./BaseDevServer.md#fastify)

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:38](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L38)

___

### hmrServer

• **hmrServer**: [`WebSocketHMRServer`](./WebSocketHMRServer.md)

HMR WebSocket server instance to allow HMR clients to receive updates.

#### Defined in

[packages/repack/src/server/DevServer.ts:54](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServer.ts#L54)

___

### symbolicator

• **symbolicator**: [`Symbolicator`](./Symbolicator.md)

Symbolicator instance to transform stack traces using Source Maps.

#### Defined in

[packages/repack/src/server/DevServer.ts:58](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServer.ts#L58)

___

### wdm

• **wdm**: `WebpackDevMiddleware`

[webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) instance.

#### Defined in

[packages/repack/src/server/DevServer.ts:52](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServer.ts#L52)

___

### wsClientServer

• **wsClientServer**: [`WebSocketDevClientServer`](./WebSocketDevClientServer.md)

Server instance for React Native clients.

#### Inherited from

[BaseDevServer](./BaseDevServer.md).[wsClientServer](./BaseDevServer.md#wsclientserver)

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:48](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L48)

___

### wsDashboardServer

• **wsDashboardServer**: `WebSocketDashboardServer`

Dashboard WebSocket server instance to provide events to dashboard web client.

#### Defined in

[packages/repack/src/server/DevServer.ts:56](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServer.ts#L56)

___

### wsDebuggerServer

• **wsDebuggerServer**: [`WebSocketDebuggerServer`](./WebSocketDebuggerServer.md)

Debugger server instance.

#### Inherited from

[BaseDevServer](./BaseDevServer.md).[wsDebuggerServer](./BaseDevServer.md#wsdebuggerserver)

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:42](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L42)

___

### wsEventsServer

• **wsEventsServer**: [`WebSocketEventsServer`](./WebSocketEventsServer.md)

Events server instance.

#### Inherited from

[BaseDevServer](./BaseDevServer.md).[wsEventsServer](./BaseDevServer.md#wseventsserver)

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:46](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L46)

___

### wsMessageServer

• **wsMessageServer**: [`WebSocketMessageServer`](./WebSocketMessageServer.md)

Message server instance.

#### Inherited from

[BaseDevServer](./BaseDevServer.md).[wsMessageServer](./BaseDevServer.md#wsmessageserver)

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:44](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L44)

___

### wsRouter

• **wsRouter**: `WebSocketRouter`

WebSocket router instance.

#### Inherited from

[BaseDevServer](./BaseDevServer.md).[wsRouter](./BaseDevServer.md#wsrouter)

#### Defined in

[packages/repack/src/server/BaseDevServer.ts:40](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/BaseDevServer.ts#L40)

## Methods

### run

▸ **run**(): `Promise`<`void`\>

Runs development server.

#### Returns

`Promise`<`void`\>

#### Overrides

[BaseDevServer](./BaseDevServer.md).[run](./BaseDevServer.md#run)

#### Defined in

[packages/repack/src/server/DevServer.ts:198](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServer.ts#L198)

___

### setup

▸ **setup**(): `Promise`<`void`\>

Sets up Fastify plugins and routes.

#### Returns

`Promise`<`void`\>

#### Overrides

[BaseDevServer](./BaseDevServer.md).[setup](./BaseDevServer.md#setup)

#### Defined in

[packages/repack/src/server/DevServer.ts:144](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServer.ts#L144)
