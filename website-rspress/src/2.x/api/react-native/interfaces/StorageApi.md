# Interface: StorageApi

Interface for storage backend used in [ChunkManagerConfig](./ChunkManagerConfig.md).
The interface is modelled on Async Storage from `react-native-community`.

## Table of contents

### Methods

- [getItem](./StorageApi.md#getitem)
- [removeItem](./StorageApi.md#removeitem)
- [setItem](./StorageApi.md#setitem)

## Methods

### getItem

▸ **getItem**(`key`): `Promise`<`undefined` \| ``null`` \| `string`\>

Gets the data for the key.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`undefined` \| ``null`` \| `string`\>

#### Defined in

[types.ts:99](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L99)

___

### removeItem

▸ **removeItem**(`key`): `Promise`<`void`\>

Removes the item based on the key.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[types.ts:103](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L103)

___

### setItem

▸ **setItem**(`key`, `value`): `Promise`<`void`\>

Sets the item value based on the key.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[types.ts:101](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L101)
