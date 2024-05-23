# Interface: DelegateContext

[Server](../modules/Server.md).DelegateContext

A delegate context used in `delegate` builder in [Config](./Server.Config.md).

Allows to emit logs, notify about compilation events and broadcast events to connected clients.

## Table of contents

### Properties

- [log](./Server.DelegateContext.md#log)

### Methods

- [broadcastToHmrClients](./Server.DelegateContext.md#broadcasttohmrclients)
- [broadcastToMessageClients](./Server.DelegateContext.md#broadcasttomessageclients)
- [notifyBuildEnd](./Server.DelegateContext.md#notifybuildend)
- [notifyBuildStart](./Server.DelegateContext.md#notifybuildstart)

## Properties

### log

• **log**: `FastifyLoggerInstance`

A logger instance, useful for emitting logs from the delegate.

#### Defined in

[types.ts:81](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L81)

## Methods

### broadcastToHmrClients

▸ **broadcastToHmrClients**<`E`\>(`event`, `platform`, `clientIds?`): `void`

Broadcast arbitrary event to all connected HMR clients for given `platform`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `E` | Arbitrary event to broadcast. |
| `platform` | `string` | Platform of the clients to which broadcast should be sent. |
| `clientIds?` | `string`[] | Ids of the client to which broadcast should be sent. If `undefined` the broadcast will be sent to all connected clients for the given `platform`. |

#### Returns

`void`

#### Defined in

[types.ts:97](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L97)

___

### broadcastToMessageClients

▸ **broadcastToMessageClients**<`E`\>(`event`): `void`

Broadcast arbitrary method-like event to all connected message clients.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `Object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `E` | Arbitrary method-like event to broadcast. |

#### Returns

`void`

#### Defined in

[types.ts:108](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L108)

___

### notifyBuildEnd

▸ **notifyBuildEnd**(`platform`): `void`

Send notification about compilation end for given `platform`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `platform` | `string` |

#### Returns

`void`

#### Defined in

[types.ts:87](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L87)

___

### notifyBuildStart

▸ **notifyBuildStart**(`platform`): `void`

Send notification about compilation start for given `platform`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `platform` | `string` |

#### Returns

`void`

#### Defined in

[types.ts:84](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L84)
