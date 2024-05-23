# Class: ChunkManager

A manager to ease resolving, downloading and executing additional code from async chunks or
any arbitrary JavaScript files.

- In development mode, all chunks will be resolved and downloaded from the Development server.
- In production mode, local chunks will be resolved and loaded from filesystem and remote
chunks will be resolved and downloaded based on the `resolveRemoteChunk` function.
- You can force all resolution, regardless of the mode, to go through `resolveRemoteChunk`
function by setting `forceRemoteChunkResolution: true` in `ChunkManager.configure(...)`.

This API is only useful if you are working with any form of Code Splitting.

Example of using this API with async chunks:
```js
import * as React from 'react';
import { ChunkManager } from '@callstack/repack/client';

ChunkManager.configure({
  resolveRemoteChunk: async (chunkId) => {
    return {
      url: `http://domain.exaple/apps/${chunkId}`,
    };
  },
});

// ChunkManager.loadChunk is called internally when running `import()`
const TeacherModule = React.lazy(() => import('./Teacher.js'));
const StudentModule = React.lazy(() => import('./Student.js'));

export function App({ role }) {
  if (role === 'teacher') {
    return <TeacherModule />;
  }

  return <StudentModule />
}
```

## Table of contents

### Constructors

- [constructor](./ChunkManager.md#constructor)

### Methods

- [configure](./ChunkManager.md#configure)
- [invalidateChunks](./ChunkManager.md#invalidatechunks)
- [loadChunk](./ChunkManager.md#loadchunk)
- [preloadChunk](./ChunkManager.md#preloadchunk)
- [resolveChunk](./ChunkManager.md#resolvechunk)

## Constructors

### constructor

• **new ChunkManager**()

## Methods

### configure

▸ `Static` **configure**(`config`): `void`

Configures `ChunkManager` to be able to resolve location of additional
chunks (or arbitrary code) in production.
Optionally, it also allows to set up caching to avoid over-fetching of chunks.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`ChunkManagerConfig`](../interfaces/ChunkManagerConfig.md) | Configuration options. |

#### Returns

`void`

#### Defined in

[ChunkManager.ts:60](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/ChunkManager.ts#L60)

___

### invalidateChunks

▸ `Static` **invalidateChunks**(`chunksIds?`): `Promise`<`void`\>

Clears the cache (if configured in [ChunkManager.configure](./ChunkManager.md#configure)) and removes downloaded
files for given chunks from the filesystem.

This function can be awaited to detect if the chunks were invalidated and for error handling.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `chunksIds` | `string`[] | `[]` | Array of chunk Ids to clear from cache and remove from filesystem. |

#### Returns

`Promise`<`void`\>

#### Defined in

[ChunkManager.ts:108](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/ChunkManager.ts#L108)

___

### loadChunk

▸ `Static` **loadChunk**(`chunkId`, `parentChunkId?`): `Promise`<`void`\>

Resolves given chunk's location, download and execute it.
Once the returned Promise is resolved, the code should have been evaluated.

The execution of the code is handled internally by threading in React Native.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunkId` | `string` | Id of the chunk. |
| `parentChunkId?` | `string` | Id of the parent chunk. |

#### Returns

`Promise`<`void`\>

#### Defined in

[ChunkManager.ts:85](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/ChunkManager.ts#L85)

___

### preloadChunk

▸ `Static` **preloadChunk**(`chunkId`): `Promise`<`void`\>

Resolves given chunk's location and download it without executing.

This function can be awaited to detect if the chunk was downloaded and for error handling.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunkId` | `string` | Id of the chunk. |

#### Returns

`Promise`<`void`\>

#### Defined in

[ChunkManager.ts:96](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/ChunkManager.ts#L96)

___

### resolveChunk

▸ `Static` **resolveChunk**(`chunkId`, `parentChunkId?`): `Promise`<[`ChunkConfig`](../interfaces/ChunkConfig.md)\>

Resolves a URL to a given chunks and  whether to download a chunk
or reuse previously downloaded one.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunkId` | `string` | Id of the chunk. |
| `parentChunkId?` | `string` | - |

#### Returns

`Promise`<[`ChunkConfig`](../interfaces/ChunkConfig.md)\>

Promise with chunk's URL as `url` and a boolean `fetch` whether to download a chunk
or reuse previously downloaded one.

#### Defined in

[ChunkManager.ts:72](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/ChunkManager.ts#L72)
