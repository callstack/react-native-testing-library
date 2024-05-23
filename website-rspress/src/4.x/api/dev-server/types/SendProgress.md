# Type alias: SendProgress

Ƭ **SendProgress**: (`data`: [`ProgressData`](../interfaces/ProgressData.md)) => `void`

#### Type declaration

▸ (`data`): `void`

Type representing a function to send the progress.

Used by [CompilerDelegate](../interfaces/CompilerDelegate.md) in `getAsset` function to send the compilation
progress to the client who requested the asset.

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ProgressData`](../interfaces/ProgressData.md) |

##### Returns

`void`

#### Defined in

[types.ts:190](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L190)
