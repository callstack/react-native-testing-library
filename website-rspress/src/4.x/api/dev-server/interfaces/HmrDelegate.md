# Interface: HmrDelegate

Delegate with implementation for HMR-specific functions.

## Table of contents

### Methods

- [getUriPath](./HmrDelegate.md#geturipath)
- [onClientConnected](./HmrDelegate.md#onclientconnected)

## Methods

### getUriPath

▸ **getUriPath**(): `string`

Get URI under which HMR server will be running, e.g: `/hmr`

#### Returns

`string`

#### Defined in

[plugins/wss/types.ts:6](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/plugins/wss/types.ts#L6)

___

### onClientConnected

▸ **onClientConnected**(`platform`, `clientId`): `void`

Callback for when the new HMR client is connected.

Useful for running initial synchronization or any other side effect.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `platform` | `string` | Platform of the connected client. |
| `clientId` | `string` | Id of the connected client. |

#### Returns

`void`

#### Defined in

[plugins/wss/types.ts:16](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/plugins/wss/types.ts#L16)
