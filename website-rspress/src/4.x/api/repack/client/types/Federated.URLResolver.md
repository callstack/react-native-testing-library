# Type alias: URLResolver

[Federated](../modules/Federated.md).URLResolver

Ƭ **URLResolver**: (`scriptId`: `string`, `caller?`: `string`) => `string` \| (`webpackContext`: [`WebpackContext`](../interfaces/WebpackContext.md)) => `string` \| `undefined`

#### Type declaration

▸ (`scriptId`, `caller?`): `string` \| (`webpackContext`: [`WebpackContext`](../interfaces/WebpackContext.md)) => `string` \| `undefined`

Resolves URL to a container or a chunk when using Module Federation,
based on given `scriptId` and `caller`.

##### Parameters

| Name | Type |
| :------ | :------ |
| `scriptId` | `string` |
| `caller?` | `string` |

##### Returns

`string` \| (`webpackContext`: [`WebpackContext`](../interfaces/WebpackContext.md)) => `string` \| `undefined`

#### Defined in

[packages/repack/src/modules/ScriptManager/federated.ts:12](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/federated.ts#L12)
