# Class: DevServerProxy

Class for spawning new compiler workers for each requested platform and forwarding requests
to respective platform-specific [DevServer](./DevServer.md).

The overall architecture is:
```
`DevServerProxy`
├── <compiler worker platform=ios>
│   └── <webpack compilation>
│       └── `DevServerPlugin`
│           └── `DevServer`
├── <compiler worker platform=android>
│   └── <webpack compilation>
│       └── `DevServerPlugin`
│           └── `DevServer`
└── ...
```

Each worker is lazy, meaning it will be spawned upon receiving first request from which
`platform` can be inferred. This would usually be a request
for bundle eg: `index.bundle?platform=ios&...`.

## Hierarchy

- [`BaseDevServer`](./BaseDevServer.md)

  ↳ **`DevServerProxy`**

## Table of contents

### Constructors

- [constructor](./DevServerProxy.md#constructor)

### Properties

- [config](./DevServerProxy.md#config)
- [fastify](./DevServerProxy.md#fastify)
- [reporter](./DevServerProxy.md#reporter)
- [workers](./DevServerProxy.md#workers)
- [wsClientServer](./DevServerProxy.md#wsclientserver)
- [wsDashboardServer](./DevServerProxy.md#wsdashboardserver)
- [wsDebuggerServer](./DevServerProxy.md#wsdebuggerserver)
- [wsEventsServer](./DevServerProxy.md#wseventsserver)
- [wsMessageServer](./DevServerProxy.md#wsmessageserver)
- [wsRouter](./DevServerProxy.md#wsrouter)

### Methods

- [forwardRequest](./DevServerProxy.md#forwardrequest)
- [run](./DevServerProxy.md#run)
- [runWorker](./DevServerProxy.md#runworker)
- [setup](./DevServerProxy.md#setup)

## Constructors

### constructor

• **new DevServerProxy**(`config`, `cliOptions`)

Constructs new `DevServerProxy`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`DevServerProxyConfig`](../interfaces/DevServerProxyConfig.md) | Configuration options. |
| `cliOptions` | [`CliOptions`](../interfaces/CliOptions.md) | CLI options (usually provided by [start](../functions/start.md) command based on arguments from React Native CLI.) |

#### Overrides

[BaseDevServer](./BaseDevServer.md).[constructor](./BaseDevServer.md#constructor)

#### Defined in

[packages/repack/src/server/DevServerProxy.ts:100](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServerProxy.ts#L100)

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

### reporter

• **reporter**: [`Reporter`](./Reporter.md)

Reporter instance.

#### Defined in

[packages/repack/src/server/DevServerProxy.ts:88](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServerProxy.ts#L88)

___

### workers

• **workers**: `Record`<`string`, `undefined` \| `Promise`<[`CompilerWorker`](../interfaces/CompilerWorker.md)\>\> = `{}`

Platform to worker mappings.

#### Defined in

[packages/repack/src/server/DevServerProxy.ts:83](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServerProxy.ts#L83)

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

#### Defined in

[packages/repack/src/server/DevServerProxy.ts:84](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServerProxy.ts#L84)

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

### forwardRequest

▸ **forwardRequest**(`platform`, `request`, `reply`, `multipartRes?`): `Promise`<`void`\>

Forward request to a [DevServer](./DevServer.md) running inside compiler worker for the `platform`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `platform` | `string` | Application platform. |
| `request` | [`DevServerRequest`](../types/DevServerRequest.md) | Request instance to forward. |
| `reply` | [`DevServerReply`](../types/DevServerReply.md) | Reply instance to send received data through. |
| `multipartRes?` | `MultipartResponse` | - |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/repack/src/server/DevServerProxy.ts:217](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServerProxy.ts#L217)

___

### run

▸ **run**(): `Promise`<`void`\>

Runs the proxy.

#### Returns

`Promise`<`void`\>

#### Overrides

[BaseDevServer](./BaseDevServer.md).[run](./BaseDevServer.md#run)

#### Defined in

[packages/repack/src/server/DevServerProxy.ts:406](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServerProxy.ts#L406)

___

### runWorker

▸ **runWorker**(`platform`): `Promise`<`void`\>

Spawn new compiler worker for given `platform`.
If the worker is already running, a warning is emitted and the method stops it's execution.
The port on which [DevServer](./DevServer.md) inside worker will be running is random, so no assumptions
should be taken regarding the port number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `platform` | `string` | Application platform for which to spawn new worker. |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/repack/src/server/DevServerProxy.ts:115](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServerProxy.ts#L115)

___

### setup

▸ **setup**(): `Promise`<`void`\>

Sets up routes.

#### Returns

`Promise`<`void`\>

#### Overrides

[BaseDevServer](./BaseDevServer.md).[setup](./BaseDevServer.md#setup)

#### Defined in

[packages/repack/src/server/DevServerProxy.ts:281](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServerProxy.ts#L281)
