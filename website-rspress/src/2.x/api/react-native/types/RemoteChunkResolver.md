# Type alias: RemoteChunkResolver

Ƭ **RemoteChunkResolver**: (`chunkId`: `string`, `parentChunkId?`: `string`) => `Promise`<[`RemoteChunkLocation`](../interfaces/RemoteChunkLocation.md)\>

#### Type declaration

▸ (`chunkId`, `parentChunkId?`): `Promise`<[`RemoteChunkLocation`](../interfaces/RemoteChunkLocation.md)\>

Defines a function to resolve remote chunk used in [ChunkManagerConfig](../interfaces/ChunkManagerConfig.md).
It's an async function which should return an object with defining how [ChunkManager](../classes/ChunkManager.md)
should fetch a remote chunk. All fields describing the chunk are listed in [RemoteChunkLocation](../interfaces/RemoteChunkLocation.md).

##### Parameters

| Name | Type |
| :------ | :------ |
| `chunkId` | `string` |
| `parentChunkId?` | `string` |

##### Returns

`Promise`<[`RemoteChunkLocation`](../interfaces/RemoteChunkLocation.md)\>

#### Defined in

[types.ts:88](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L88)
