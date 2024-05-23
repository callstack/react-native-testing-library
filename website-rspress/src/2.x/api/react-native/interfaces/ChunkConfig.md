# Interface: ChunkConfig

Internal representation of Chunk config specifying it's remote location
and the data necessary to fetch it.

**`internal`**

## Table of contents

### Properties

- [absolute](./ChunkConfig.md#absolute)
- [body](./ChunkConfig.md#body)
- [fetch](./ChunkConfig.md#fetch)
- [headers](./ChunkConfig.md#headers)
- [method](./ChunkConfig.md#method)
- [query](./ChunkConfig.md#query)
- [timeout](./ChunkConfig.md#timeout)
- [url](./ChunkConfig.md#url)

## Properties

### absolute

• **absolute**: `boolean`

Whether chunk's URL is an absolute FileSystem URL on a target device.

#### Defined in

[types.ts:150](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L150)

___

### body

• `Optional` **body**: `string`

Request body.

#### Defined in

[types.ts:156](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L156)

___

### fetch

• **fetch**: `boolean`

Whether to fetch chunk from the network or use cached one.

#### Defined in

[types.ts:146](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L146)

___

### headers

• `Optional` **headers**: `Record`<`string`, `string`\>

Request headers.

#### Defined in

[types.ts:154](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L154)

___

### method

• **method**: ``"GET"`` \| ``"POST"``

HTTP method.

#### Defined in

[types.ts:142](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L142)

___

### query

• `Optional` **query**: `string`

Query params.

#### Defined in

[types.ts:152](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L152)

___

### timeout

• **timeout**: `number`

Custom timeout for chunk fetch requests.

#### Defined in

[types.ts:148](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L148)

___

### url

• **url**: `string`

Path-only URL to a chunk's remote location.

#### Defined in

[types.ts:144](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L144)
