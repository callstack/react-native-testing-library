# Interface: MessagesDelegate

[Server](../modules/Server.md).MessagesDelegate

Delegate with implementation for messages used in route handlers.

## Table of contents

### Methods

- [getHello](./Server.MessagesDelegate.md#gethello)
- [getStatus](./Server.MessagesDelegate.md#getstatus)

## Methods

### getHello

▸ **getHello**(): `string`

Get message to send as a reply for `GET /` route.

#### Returns

`string`

#### Defined in

[types.ts:132](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L132)

___

### getStatus

▸ **getStatus**(): `string`

Get message to send as a reply for `GET /status` route.

#### Returns

`string`

#### Defined in

[types.ts:135](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L135)
