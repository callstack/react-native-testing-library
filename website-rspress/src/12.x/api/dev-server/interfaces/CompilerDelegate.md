# Interface: CompilerDelegate

Delegate with implementation for compiler-specific functions.

## Table of contents

### Methods

- [getAsset](./CompilerDelegate.md#getasset)
- [getMimeType](./CompilerDelegate.md#getmimetype)
- [inferPlatform](./CompilerDelegate.md#inferplatform)

## Methods

### getAsset

▸ **getAsset**(`filename`, `platform`, `sendProgress?`): `Promise`<`string` \| `Buffer`\>

Get compiled asset content.

If the compilation is in progress, it should wait until compilation finishes and then return the asset.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | Filename of the asset to get. |
| `platform` | `string` | Platform of the asset to get. |
| `sendProgress?` | [`SendProgress`](../types/SendProgress.md) | Function to notify the client who requested the asset about compilation progress. |

#### Returns

`Promise`<`string` \| `Buffer`\>

#### Defined in

[plugins/compiler/types.ts:16](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/plugins/compiler/types.ts#L16)

___

### getMimeType

▸ **getMimeType**(`filename`, `platform`, `data`): `string`

Detect MIME type of the asset from `filename`, `platform` or `data` (or from combination of either).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | Filename of the asset. |
| `platform` | `string` | Platform of the asset. |
| `data` | `string` \| `Buffer` | Asset's content. |

#### Returns

`string`

#### Defined in

[plugins/compiler/types.ts:29](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/plugins/compiler/types.ts#L29)

___

### inferPlatform

▸ `Optional` **inferPlatform**(`uri`): `undefined` \| `string`

Detect the platform from the URI - either from filename, query params or both.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uri` | `string` | URI string. |

#### Returns

`undefined` \| `string`

#### Defined in

[plugins/compiler/types.ts:40](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/plugins/compiler/types.ts#L40)
