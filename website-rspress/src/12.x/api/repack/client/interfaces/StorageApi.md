# Interface: StorageApi

Interface for storage backend used in {@link ScriptManagerConfig}.
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

[packages/repack/src/modules/ScriptManager/types.ts:146](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L146)

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

[packages/repack/src/modules/ScriptManager/types.ts:150](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L150)

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

[packages/repack/src/modules/ScriptManager/types.ts:148](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L148)
