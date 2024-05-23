# Interface: ChunkManagerConfig

Configuration options for [ChunkManager](../classes/ChunkManager.md).

## Table of contents

### Properties

- [forceRemoteChunkResolution](./ChunkManagerConfig.md#forceremotechunkresolution)
- [resolveRemoteChunk](./ChunkManagerConfig.md#resolveremotechunk)
- [storage](./ChunkManagerConfig.md#storage)

## Properties

### forceRemoteChunkResolution

• `Optional` **forceRemoteChunkResolution**: `boolean`

Forces `ChunkManager` to always use `resolveRemoteChunk` function to resolve location
of a chunk, regardless if the chunk is marked as local chunk or if the development server
is running.

#### Defined in

[types.ts:131](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L131)

___

### resolveRemoteChunk

• **resolveRemoteChunk**: [`RemoteChunkResolver`](../types/RemoteChunkResolver.md)

An async function to resolve URL to remote chunks hosted on remove servers.
You can use remote config, feature flags or A/B testing inside this function
return different URLs based on this logic.

#### Defined in

[types.ts:124](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L124)

___

### storage

• `Optional` **storage**: [`StorageApi`](./StorageApi.md)

Optional: A storage backend to cache resolved URLs for chunks.
The stored data is used to detect if URL to previously downloaded
chunk hasn't changed to avoid over-fetching the chunk.
If the perviously resolved URL matches new URL, the chunk won't be downloaded
again and the previously downloaded chunk will be executed instead.

#### Defined in

[types.ts:117](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L117)
